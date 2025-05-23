import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CameraUrlsService } from './camera-urls.service';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Prisma } from '@prisma/client';

@Controller('camera-urls')
export class CameraUrlsController {
  constructor(private readonly cameraUrlsService: CameraUrlsService) {}
  
  @Get("")
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  async getAllCameraUrls() {
    return await this.cameraUrlsService.getAllCameraUrls();
  }

  @Get(":barId")
  async getCameraUrlByBarId(@Param("barId") barId: string) {
    return await this.cameraUrlsService.getCameraUrlByBarId(barId);
  }

  @Post("")
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  async createCameraUrl(@Body() createCameraUrlDto: Prisma.CameraUrlsCreateInput) {
    return await this.cameraUrlsService.createCameraUrl(createCameraUrlDto);
  }

  @Put(":cameraUrlId")
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  async updateCameraUrl(@Param("cameraUrlId") cameraUrlId: string, @Body() updateCameraUrlDto: Prisma.CameraUrlsUpdateInput) {
    return await this.cameraUrlsService.updateCameraUrl(cameraUrlId, updateCameraUrlDto);
  }

  @Delete(":cameraUrlId")
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  async deleteCameraUrl(@Param("cameraUrlId") cameraUrlId: string) {
    return await this.cameraUrlsService.deleteCameraUrl(cameraUrlId);
  }
}
