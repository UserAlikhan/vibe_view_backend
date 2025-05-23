import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CameraUrlsService {
    constructor(private readonly databaseService: DatabaseService) {}

    async getAllCameraUrls() {
        return await this.databaseService.cameraUrls.findMany();
    }

    async getCameraUrlByBarId(barId: string) {
        return await this.databaseService.cameraUrls.findFirst({ where: { bar_id: +barId } });
    }
    
    async createCameraUrl(createCameraUrlDto: Prisma.CameraUrlsCreateInput) {
        return await this.databaseService.cameraUrls.create({ data: createCameraUrlDto });
    }

    async updateCameraUrl(cameraUrlId: string, updateCameraUrlDto: Prisma.CameraUrlsUpdateInput) {
        return await this.databaseService.cameraUrls.update({ where: { id: +cameraUrlId }, data: updateCameraUrlDto });
    }
    
    async deleteCameraUrl(cameraUrlId: string) {
        return await this.databaseService.cameraUrls.delete({ where: { id: +cameraUrlId } });
    }
}