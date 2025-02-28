import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BarsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBarDto: Prisma.BarsCreateInput) {
    return await this.databaseService.bars.create({ data: createBarDto });
  }

  async findAll() {
    return await this.databaseService.bars.findMany({
      include: {
        images: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.databaseService.bars.findUnique({
      where: {
        id: id,
      },
      include: {
        images: true,
      },
    });
  }

  async findNearestToYou(latitude: number, longitude: number) {
    const allBars = await this.databaseService.bars.findMany({
      include: {
        images: true,
      },
    });

    const haversineDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
    ) => {
      const R = 6371; // Radius of the Earth in kilometers
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance;
    };

    const barsWithDistance = allBars.map((bar) => {
      const distance = haversineDistance(
        latitude,
        longitude,
        bar.latitude,
        bar.longitude,
      );
      return { ...bar, distance };
    });

    barsWithDistance.sort((a, b) => a.distance - b.distance);

    return barsWithDistance;
  }

  async update(id: number, updateBarDto: Prisma.BarsUpdateInput) {
    return await this.databaseService.bars.update({
      where: {
        id: id,
      },
      data: updateBarDto,
    });
  }

  async remove(id: number) {
    return await this.databaseService.bars.delete({
      where: {
        id: id,
      },
    });
  }
}
