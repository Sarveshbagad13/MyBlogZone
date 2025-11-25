import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userdata || state.auth.userData);

    const isAuthor = post && userData ? (post.userid ?? post.userId) === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    // load preview blob -> object URL
    useEffect(() => {
        let currentUrl = null;
        async function loadPreview() {
            if (!post) return;

            // Accept both lowercase `featuredimage` and camelCase `featuredImage`.
            const raw = post.featuredimage ?? post.featuredImage;
            const fileId = raw && typeof raw === "object" ? raw.$id || null : raw;

            if (!fileId) {
                setPreviewUrl(null);
                return;
            }

            try {
                const blob = await appwriteService.getFilePreview(fileId);
                if (!blob) {
                    setPreviewUrl(null);
                    return;
                }

                currentUrl = URL.createObjectURL(blob);
                setPreviewUrl(currentUrl);
            } catch (err) {
                console.log("Post :: preview load error", err);
                setPreviewUrl(null);
            }
        }

        loadPreview();

        return () => {
            if (currentUrl) URL.revokeObjectURL(currentUrl);
        };
    }, [post]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full mb-4">
                    <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2 bg-white">
                        {previewUrl ? (
                            <img src={previewUrl} alt={post.title} className="rounded-xl w-full h-96 object-cover"  />
                        ) : (
                            <div className="w-full h-96 bg-gray-300 rounded-xl flex items-center justify-center">No Image</div>
                        )}
                    </div>
                    {isAuthor && (
                        <div className="flex gap-3 mt-2">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {parse(post.content)}
                    </div>
            </Container>
        </div>
    ) : null;
}