import { v2 as cloudinary } from "cloudinary";
import streamifier from 'streamifier';

import "dotenv/config"
import { AppError } from "./appError";

cloudinary.config({
    cloud_name: "dzg1y0hm2",
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string
})
export class CloudUploader {
    constructor() { }

    async uploadToCloudinary(fileBuffer: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let upload_stream = cloudinary.uploader.upload_stream(
                { resource_type: "raw"}, 
                (error, result) => {
                    if (error) {
                        return reject(new AppError('Cloudinary upload error', 500)); // Reject with custom error
                    }
                    if (result?.secure_url) {
                        return resolve(result.secure_url); // Resolve with the secure URL
                    }
                    return reject(new AppError('Cloudinary returned no URL', 500)); // Reject if no URL is returned
                }
            )
            upload_stream.end(fileBuffer)
        })
    };
    async removeOldImage(url: string) {
        try {
            // Extract public ID from the URL

            const publicId = url.split("/").pop()?.split(".")[0] || undefined;

            let result;
            if (publicId) result = await cloudinary.uploader.destroy(publicId);


            // Call Cloudinary's destroy method to delete the image

            if (result.result === 'ok') {
                console.log('Image deleted successfully');
                return { message: 'Image deleted successfully' };
            } else {
                console.log('Error deleting image:', result);
                return { message: 'Error deleting image', error: result };
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            return { message: 'Error deleting image', error };
        }
    }
}


