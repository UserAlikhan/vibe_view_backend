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
} from '@nestjs/common';
import { BarsService } from './bars.service';
import { Prisma } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { FilterBarsDto } from './bars.types';

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

  @Get("/getBarsBasedOnFilters")
  async getBarsBasedOnFilters(@Query() filters: any) {
    return await this.barsService.getBarsBasedOnFilters(filters);
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

  @Delete(':id')
  @Roles(['ADMIN'])
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return await this.barsService.remove(+id);
  }
}
