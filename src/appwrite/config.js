import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            const payload = {
                title,
                content,
                status,
            };

            const effectiveFeatured = featuredImage || undefined;
            const effectiveUserId = userId || undefined;

            if (effectiveFeatured) payload.featuredimage = effectiveFeatured;
            if (effectiveUserId) payload.userid = effectiveUserId;

            console.log('Appwrite Service :: createPost payload', payload)

            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                payload
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
            throw error;
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            const payload = {
                title,
                content,
                status,
            };

            const effectiveFeatured = featuredImage || undefined;
            if (effectiveFeatured) payload.featuredimage = effectiveFeatured;

            console.log('Appwrite Service :: updatePost payload', payload)

            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                payload
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
            throw error;
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                

            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        if (!fileId) return false;

        const id = typeof fileId === "object" ? fileId.$id || null : fileId;
        if (!id) return false;

        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                id
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    async getFilePreview(fileId){
        if (!fileId) return null;

        const id = typeof fileId === "object" ? fileId.$id || null : fileId;
        if (!id) return null;

        try {
            const result = await this.bucket.getFilePreview(
                conf.appwriteBucketId,
                id
            );

            if (!result) return null;

            if (typeof Blob !== 'undefined' && result instanceof Blob) return result;

            if (typeof result.arrayBuffer === 'function') {
                const buffer = await result.arrayBuffer();
                return new Blob([buffer]);
            }

            if (result.buffer) {
                return new Blob([result.buffer]);
            }

            try {
                return new Blob([result]);
            } catch (e) {
                console.log('Appwrite service :: getFilePreview :: could not normalize preview', e, result);
                return null;
            }

        } catch (error) {
            console.log('Appwrite service :: getFilePreview :: error', error);
            return null;
        }
    }
}


const service = new Service()
export default service