import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { BarsImagesService } from './bars-images.service';
import { Roles } from 'src/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('bars-images')
export class BarsImagesController {
  constructor(private readonly barsImagesService: BarsImagesService) {}

  @Post("upload-image")
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("image"))
  async uploadImage(
    @Body() dataDto: {barId: number, isCoverImage?: string},
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 15 }),
          new FileTypeValidator({ fileType: "image/*" })
        ]
      })
    )  image: Express.Multer.File
  ) {
    return await this.barsImagesService.uploadImage(
      image,
      +dataDto.barId,
      dataDto.isCoverImage,
    );
  }

  @Get('get-all-images/:barId')
  async getAllImages(@Param("barId") barId: number) {
    return await this.barsImagesService.getImageUrlsForSpecificBar(+barId)
  }

  @Delete("delete-image/:imageId")
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  async deleteImage(@Param("imageId") imageId: number) {
    return await this.barsImagesService.deleteImage(imageId)
  }
}