import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config"
import { Container, PostCard } from '../components'

function AllPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let mounted = true
        appwriteService.getPosts().then((res) => {
            if (mounted && res) {
                setPosts(res.documents || [])
            }
        })
        return () => { mounted = false }
    }, [])

  return (
    <div className='w-full py-8'> 
      <Container>
        <div className='flex flex-wrap'>
            {posts.map((post) => (
                <div key={post.$id} className='p-2 w-1/4'>
                <PostCard {...post} />
                </div>
            ))}
        </div>
      </Container>
    </div>
  )
}

export default AllPosts
