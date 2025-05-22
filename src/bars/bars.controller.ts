import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseInterceptors,
} from '@nestjs/common';
import { BarsService } from './bars.service';
import { Prisma } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('bars')
@UseGuards(RolesGuard)
export class BarsController {
  constructor(private readonly barsService: BarsService) { }

  @Post()
  @Roles(['ADMIN'])
  @UseGuards(AuthGuard)
  async create(@Body() createBarDto: Prisma.BarsCreateInput) {
    return await this.barsService.create(createBarDto);
  }

  @Get()
  async findAll(@Query() query: { page: number, limit: number, takeAll: string }) {
    const takeAll = query.takeAll === "true";
    return await this.barsService.findAll(
      Number(query.page) || 1, 
      Number(query.limit) || 5, 
      takeAll
    );
  }

  @Get('/filtrationOptions')
  async filtrationOptions() {
    return await this.barsService.filtrationOptions();
  }

  @Get("/getBestRatingBars")
  async getBestRatingBars(@Query() query: { page: number, limit: number }) {
    return await this.barsService.getBestRatingBars(
      Number(query.page) || 1,
      Number(query.limit) || 5,
    );
  }

  @Get("/getBarsBasedOnCity")
  async getBarsBasedOnCity(@Query() query: { page: number, limit: number, city: string }) {
    return await this.barsService.getBarsBasedOnCity(
      Number(query.page) || 1,
      Number(query.limit) || 5,
      query.city,
    )
  }

  @Get("/getBarsBasedOnFilters")
  async getBarsBasedOnFilters(@Query() filters: any) {
    return await this.barsService.getBarsBasedOnFilters(filters);
  }

  @Get("/search")
  async searchBars(@Query() query: { search: string }) {
    const searchTerm = query.search;
    console.log("searchTerm ", searchTerm)
    return await this.barsService.searchBars(searchTerm)
  }

  @Post('/nearestToYou')
  async findNearestToYou(
    @Body() coordinates: { latitude: number; longitude: number },
  ) {
    return await this.barsService.findNearestToYou(
      coordinates.latitude,
      coordinates.longitude,
    );
  }
  
  @Post("/upload-logo")
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("logo"))
  async uploadLogo(
    @Body() dataDto: { barId: number },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 15 }),
          new FileTypeValidator({ fileType: "image/*" })
        ]
      })
    ) logo: Express.Multer.File
  ) {
    return await this.barsService.uploadLogo(logo, +dataDto.barId, {
      width: 500,
      height: 500,
      quality: 90,
      format: "png"
    });
  }

  @Get("get-logo/:barId")
  async getLogo(@Param("barId") barId: string) {
    return await this.barsService.getLogo(+barId)
  }

  @Delete("delete-logo/:barId")
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  async deleteLogo(@Param("barId") barId: string) {
    return await this.barsService.deleteLogo(+barId)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.barsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(['ADMIN'])
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateBarDto: Prisma.BarsUpdateInput,
  ) {
    return await this.barsService.update(+id, updateBarDto);
  }

  @Patch(":barId/updateLiveFeed")
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  async updateLiveFeed(@Param("barId") barId: string, @Query() query: { isLiveFeedAvailable: string }) {
    const isLiveFeedAvailable = query.isLiveFeedAvailable === "true"
    return await this.barsService.updateLiveFeed(barId, isLiveFeedAvailable)
  }

  @Delete(':id')
  @Roles(['ADMIN'])
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return await this.barsService.remove(+id);
  }

  @Delete("/deleteAll")
  @Roles(["ADMIN"])
  @UseGuards(AuthGuard)
  async deleteAll() {
    return await this.barsService.deleteAll();
  }
}