import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { FilterBarsDto } from './bars.types';

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

  async filtrationOptions() {
    // All the filteration options
    const options = Object.keys(Prisma.BarsScalarFieldEnum).filter(
      (key) => key !== 'id' && key !== "name" && key !== "rating" && key !== "country" && key !== "address" 
      && key !== "reserve_link" && key !== "longitude" && key !== "latitude" && key !== "zipCode" 
      && key !== "createdAt" && key !== "updatedAt"
    )

    const allTheData = await this.databaseService.bars.findMany();

    const keysWithValues = options.map((option) => {

      const values = [...new Set(allTheData.map((data) => data[option]))];
      const testValues = ["$60–70", "$1–10", "$90–100", "$20–30", "$40–50", "$30–40", "$10–20", "$50–60", "$70–80", "$80–90"]

      if (option === "average_cocktail_price") {
        const cleanedValues = testValues.filter((value) => value !== "N/A" && value !== null && value !== undefined)
        const firstPriceList = cleanedValues.map((value) => {
          return value.split("–")[0].split("$")[1]
          }
        )
        const sortedValues = []
        // Bubble Sort
        for (let i = 0; i < firstPriceList.length; i++) {
          for (let j = 0; j < (firstPriceList.length - i - 1); j++) {
            if (firstPriceList[j] > firstPriceList[j + 1]) {
              var temp = firstPriceList[j]
              firstPriceList[j] = firstPriceList[j + 1]
              firstPriceList[j + 1] = temp
            }
          }
        }

        for (let i = 0; i < firstPriceList.length; i++) {
          for (let j = 0; j < cleanedValues.length; j++) {
            if (cleanedValues[j].split("–")[0].split("$")[1] === firstPriceList[i]) {
              sortedValues.push(cleanedValues[j])
            }
          }
        }
        
        return { [option]: sortedValues }
      }

      if (option === "isOpen" || option === "website_link" || option === "phone_number" || option === "description") {
        return { [option]: [true, false] }
      }

      return { [option]: values.filter((value) => value !== "N/A" && value !== null && value !== undefined) };
    });

    console.log("KEYS WITH VALUES ", keysWithValues)

    return keysWithValues;
  }

  async getBarsBasedOnFilters(filters: FilterBarsDto) {
    let filteredOptions = await this.databaseService.bars.findMany({
      where: {
        average_cocktail_price: {
          equals: filters.average_cocktail_price
        },
        state: {
          equals: filters.state
        },
        city: {
          equals: filters.city
        },
        isOpen: {
          equals: filters.isOpen
        }
      }
    })

    if (filters.reserve_link === true) {
      filteredOptions = filteredOptions.filter((bar) => bar.reserve_link != "N/A" && bar.reserve_link != null && bar.reserve_link != "")
    }

    if (filters.website_link === true) {
      filteredOptions = filteredOptions.filter((bar) => bar.website_link != "N/A" && bar.website_link != null && bar.website_link != "")
    }
    
    if (filters.phone_number === true) {
      filteredOptions = filteredOptions.filter((bar) => bar.phone_number != "N/A" && bar.phone_number != null && bar.phone_number != "")
    }

    if (filters.description === true) {
      filteredOptions = filteredOptions.filter((bar) => bar.description != "N/A" && bar.description != null && bar.description != "")
    }
    
    return filteredOptions
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
