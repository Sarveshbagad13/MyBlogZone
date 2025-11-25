import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredImage, featuredimage}) {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        let currentUrl = null;
        async function loadPreview() {
            const raw = featuredimage ?? featuredImage;
            const fileId = raw && typeof raw === 'object' ? raw.$id || null : raw;

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
                console.log('PostCard :: preview load error', err);
                setPreviewUrl(null);
            }
        }

        loadPreview();

        return () => {
            if (currentUrl) URL.revokeObjectURL(currentUrl);
        };
    }, [featuredImage, featuredimage]);
    
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4'>
                {previewUrl ? (
                    <img src={previewUrl} alt={title} className='w-full h-40 object-cover rounded-xl' />
                ) : null}

            </div>
            <h2
            className='text-xl font-bold'
            >{title}</h2>
        </div>
    </Link>
  )
}


export default PostCard