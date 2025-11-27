import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'

function PostCard({$id, title, featuredImage, featuredimage}) {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const raw = featuredimage ?? featuredImage;
        const fileId = raw && typeof raw === 'object' ? raw.$id || null : raw;

        if (fileId) {
            // Use getFilePreview to get the URL directly
            const previewUrl = appwriteService.getFilePreviewUrl(fileId);
            setPreviewUrl(previewUrl);
        } else {
            setPreviewUrl(null);
        }
    }, [featuredImage, featuredimage]);
    
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4'>
                {previewUrl ? (
                    <img src={previewUrl} alt={title} className='w-full h-40 object-cover rounded-xl' />
                ) : (
                    <div className='w-full h-40 bg-gray-300 rounded-xl flex items-center justify-center'>No Image</div>
                )}

            </div>
            <h2
            className='text-xl font-bold'
            >{title}</h2>
        </div>
    </Link>
  )
}


export default PostCard