import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BarsImagesService {

    private s3Client: S3Client;

    constructor(
        private readonly databaseService: DatabaseService, 
    ) {
        this.s3Client = new S3Client({
            region: process.env.BUCKET_REGION,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            }
        })
    }

    async uploadImage(image: Express.Multer.File, barId: number, isCoverImage?: boolean) {
        const bar = await this.databaseService.bars.findUnique({
            where: {
                id: barId
            }
        });

        if (!bar) {
            throw new NotFoundException("Bar not found");
        }

        const randomImageName = () => {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        }

        const imageName = randomImageName();

        const uploadParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: 'BarImages/' + imageName,
            Body: image.buffer,
            ContentType: image.mimetype,
        }

        const command = new PutObjectCommand(uploadParams);

        try {
            const response = await this.s3Client.send(command);

            if (response) {
                // If the image was saved to s3, save it to the database
                const newImage = await this.databaseService.barsImages.create({
                    data: {
                        image_name: imageName,
                        bar_id: barId,
                        isCoverImage: isCoverImage,
                    }
                })

                return newImage;
            }
        } catch (error) {
            console.error("Failed to upload image", error);
            throw new Error("Failed to upload image");
        }
    }

    async getImageUrlsForSpecificBar(barId: number) {

        const urls = [];
        const barImages = await this.databaseService.barsImages.findMany({
            where: {
                bar_id: barId,
            }
        });

        if (!barImages[0]) {
            return [];
        }

        for (const image of barImages) {
            const getObjectParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: "BarImages/" + image.image_name,
            }

            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(this.s3Client, command, {
                expiresIn: 60 * 60 * 24 * 7 - 60, // 7 days - 1 minute
            })
            // if image is gonna be used as a cover, add it to the beginning of the array
            if (image.isCoverImage) {
                urls.unshift(url);
            } else {
                urls.push(url);
            }
        }
        
        return urls;
    }

    async deleteImage(imageId: number) {
        const image = await this.databaseService.barsImages.findUnique({
            where: {
                id: imageId
            }
        })

        if (!image) {
            throw new NotFoundException("Image not found");
        }

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: "BarImages/" + image.image_name,
        }

        const command = new DeleteObjectCommand(params);

        await this.s3Client.send(command);

        await this.databaseService.barsImages.delete({
            where: {
                id: imageId
            }
        }) 

        return {
            message: "Image was deleted successfully"
        }
    }

    async getALlImagesForSpecificBar(barId: number) {

        const images = await this.databaseService.barsImages.findMany({
            where: {
                bar_id: barId,
            },
        })

        if (!images[0]) {
            throw new NotFoundException("Images were not found");
        }

        return images;
    }
}
