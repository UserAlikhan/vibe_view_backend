import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { FilterBarsDto } from './bars.types';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as sharp from 'sharp';
import { BarsImagesService } from 'src/bars-images/bars-images.service';

interface ImageProcessingOptions {
  width: number;
  height: number;
  quality: number;
  format: 'jpeg' | 'png';
}

@Injectable()
export class BarsService {
  private s3Client: S3Client;
  private readonly defaultImageOptions: ImageProcessingOptions = {
    width: 500,
    height: 500,
    quality: 90,
    format: 'png'
  };

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly barsImagesService: BarsImagesService
  ) {
    this.s3Client = new S3Client({
      region: process.env.BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      }
    })
  }

  private async processImage(
    image: Express.Multer.File,
    options: Partial<ImageProcessingOptions> = {}
  ) {
    const processOptions = { ...this.defaultImageOptions, ...options };

    try {
      let imageProcessor = sharp(image.buffer)
        .resize({
          width: this.defaultImageOptions.width,
          height: this.defaultImageOptions.height,
          fit: "contain",
          position: "center"
        }
      )

      switch (processOptions.format) {
        case 'jpeg':
          imageProcessor = imageProcessor.jpeg({
            quality: processOptions.quality,
            progressive: true,
            mozjpeg: true,
          })
          break;
        case 'png':
          imageProcessor = imageProcessor.png({
            quality: processOptions.quality,
            progressive: true,
            compressionLevel: 9,
          })
          break;
      }

      return await imageProcessor.sharpen().withMetadata().toBuffer()
    } catch (error) {
      console.error("Failed to process image ", error)
      throw new Error("Failed to process image")
    }
  }

  async create(createBarDto: Prisma.BarsCreateInput) {
    return await this.databaseService.bars.create({ data: createBarDto });
  }
  // get all bars function with pagination
  // if takeAll is true, return all bars
  async findAll(page: number = 1, limit: number = 5, takeAll: boolean = false) {
    const skip = (page - 1) * limit;

    const allBars = await this.databaseService.bars.findMany({
      skip: takeAll ? 0 : skip,
      take: takeAll ? undefined : limit,
      include: {
        cameraUrls: true
      }
    });

    let barsWithUrls = await Promise.all(allBars.map(async (bar) => {
      const urls = await this.barsImagesService.getImageUrlsForSpecificBar(bar.id)
      return {
        ...bar,
        urls: urls
      }
    }));

    return barsWithUrls;
  }

  async findOne(id: number) {
    return await this.databaseService.bars.findUnique({
      where: {
        id: id,
      },
      include: {
        images: true,
        cameraUrls: true
      },
    });
  }

  async getBestRatingBars(page: number = 1, limit: number = 5) {
    const skip = (page - 1) * limit;

    const bestRatingBars = await this.databaseService.bars.findMany({
      skip: skip,
      take: limit,
      include: {
        cameraUrls: true,
      },
      orderBy: {
        rating: "desc"
      }
    })

    const barsWithUrls = await Promise.all(bestRatingBars.map(async (bar) => {
      const urls = await this.barsImagesService.getImageUrlsForSpecificBar(bar.id);
      return {
        ...bar,
        urls: urls
      }
    }))

    return barsWithUrls;
  }

  async getBarsBasedOnCity(page: number = 1, limit: number = 5, city: string) {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.BarsWhereInput = { city: { equals: city } };

    const bars = await this.databaseService.bars.findMany({
      skip: skip,
      take: limit,
      where: whereClause,
      include: {
        cameraUrls: true,
      },
    })
  
    const barsWithUrls = await Promise.all(bars.map(async (bar) => {
      const urls = await this.barsImagesService.getImageUrlsForSpecificBar(bar.id);
      return {
        ...bar,
        urls: urls
      }
    }))

    return barsWithUrls;
  }

  async filtrationOptions() {
    // All the filteration options
    const options = Object.keys(Prisma.BarsScalarFieldEnum).filter(
      (key) => key === "average_cocktail_price" || key === "state" || key === "city" || key === "isOpen" || key === "website_link" || key === "phone_number"
    )

    const allTheData = await this.databaseService.bars.findMany({
      include: {
        cameraUrls: true,
      },
    });

    const keysWithValues = options.map((option) => {
      // Creating unique set of available values for each option
      const values = [...new Set(allTheData.map((data) => data[option]))];
      // const testValues = ["$60–70", "$1–10", "$90–100", "$20–30", "$40–50", "$30–40", "$10–20", "$50–60", "$70–80", "$80–90"]

      if (option === "average_cocktail_price") {
        const cleanedValues: string[] = values.filter((value) => value !== "N/A" && value !== null && value !== undefined) as string[]
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

      if (option === 'isOpen') {
        return { [option]: ["open", "closed"] }
      }

      if (option === "website_link" || option === "phone_number") {
        return { [option]: ["has", "no"] }
      }

      return { [option]: values.filter((value) => value !== "N/A" && value !== null && value !== undefined) };
    });

    console.log("KEYS WITH VALUES ", keysWithValues)

    return keysWithValues;
  }

  async getBarsBasedOnFilters(filters: FilterBarsDto) {
    if (Object.keys(filters).length === 0) return await this.databaseService.bars.findMany({
      include: {
        cameraUrls: true,
      },
    })

    // First, only include non-undefined filters in the where clause
    const whereClause: any = {};
    
    if (filters.average_cocktail_price) whereClause.average_cocktail_price = { equals: filters.average_cocktail_price };
    if (filters.state) whereClause.state = { equals: filters.state };
    if (filters.city) whereClause.city = { equals: filters.city };
    if (filters.isOpen !== undefined) {
      whereClause.isOpen = { 
        equals: typeof filters.isOpen === "string" ? 
               (filters.isOpen as string) === "open" : 
               !!filters.isOpen
      };
    }

    // Get initial results without website_link and phone_number filters
    let filteredOptions = await this.databaseService.bars.findMany({
      where: whereClause,
      include: {
        images: true,
      },
    });
    
    // Apply website_link filter if specified
    if (filters.website_link === "has") {
      filteredOptions = filteredOptions.filter((bar) => 
        bar.website_link !== "N/A" && 
        bar.website_link !== null && 
        bar.website_link !== undefined &&
        bar.website_link !== ""
      );
    } else if (filters.website_link === "no") {
      filteredOptions = filteredOptions.filter(bar => 
        bar.website_link === "N/A" || 
        bar.website_link === null || 
        bar.website_link === undefined ||
        bar.website_link === ""
      );
    }
        
    // Apply phone_number filter if specified
    if (filters.phone_number === "has") {
      filteredOptions = filteredOptions.filter((bar) => 
        bar.phone_number !== "N/A" && 
        bar.phone_number !== null && 
        bar.phone_number !== undefined &&
        bar.phone_number !== ""
      );
    } else if (filters.phone_number === "no") {
      filteredOptions = filteredOptions.filter(bar => 
        bar.phone_number === "N/A" || 
        bar.phone_number === null || 
        bar.phone_number === undefined ||
        bar.phone_number === ""
      );
    }
    
    return filteredOptions;
  }

  async findNearestToYou(latitude: number, longitude: number) {
    const allBars = await this.databaseService.bars.findMany({
      include: {
        cameraUrls: true,
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

    const barsWithUrls = await Promise.all(barsWithDistance.map(async (bar) => {
      const urls = await this.barsImagesService.getImageUrlsForSpecificBar(bar.id)
      return {
        ...bar,
        urls: urls
      }
    }));

    return barsWithUrls;
  }

  async searchBars(searchTerm: string) {
    // Handle empty search term
    if (!searchTerm || searchTerm.trim() === '') {
      return [];
    }
    
    try {
      const where: Prisma.BarsWhereInput = {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { address: { contains: searchTerm, mode: "insensitive" } },
          { zipCode: { contains: searchTerm, mode: "insensitive" }},
          { city: { contains: searchTerm, mode: "insensitive" }},
          { state: { contains: searchTerm, mode: "insensitive" }},
        ]
      };

      const bars = await this.databaseService.bars.findMany({
        where: where,
        include: {
          cameraUrls: true,
        },
      })

      const barsWithUrls = await Promise.all(bars.map(async (bar) => {
        const urls = await this.barsImagesService.getImageUrlsForSpecificBar(bar.id)
        return {
          ...bar,
          urls: urls
        }
      }));

      return barsWithUrls;
      
    } catch (error) {
      console.error("Error searching bars:", error);
      throw new Error("Failed to search bars");
    }
  }

  async update(id: number, updateBarDto: Prisma.BarsUpdateInput) {
    return await this.databaseService.bars.update({
      where: {
        id: id,
      },
      data: updateBarDto,
      include: {
        cameraUrls: true,
      },
    });
  }
 
  async remove(id: number) {
    return await this.databaseService.bars.delete({
      where: {
        id: id,
      },
    });
  }

  async deleteAll() {
    return await this.databaseService.bars.deleteMany();
  }

  async uploadLogo(
    logo: Express.Multer.File,
    barId: number,
    options: Partial<ImageProcessingOptions> = {}
  ) {
    const bar = await this.findOne(barId);

    if (!bar) {
      throw new NotFoundException("Bar not found");
    }

    const processedLogoBuffer = await this.processImage(logo, options);

    const randomImageName = () => {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    const imageName = randomImageName();

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: "Logos/" + (bar.logoName ? bar.logoName: imageName),
      Body: processedLogoBuffer,
      ContentType: logo.mimetype,
    }

    const command = new PutObjectCommand(params);

    try {
      const response = await this.s3Client.send(command);

      if (response && !bar.logoName) {
        const updatedBar = await this.databaseService.bars.update({
          where: {
            id: barId,
          },
          data: {
            logoName: imageName
          },
          include: {
            cameraUrls: true,
          },
        })

        return updatedBar;
      }

      return bar;
    } catch (error) {
      throw new Error("Error uploading logo");
    }
  }

  async getLogo(barId: number) {
    const bar = await this.findOne(barId);

    if (!bar) {
      throw new NotFoundException("Bar not found");
    }

    if (!bar.logoName) {
      return null;
    } 

    const getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: "Logos/" + bar.logoName,
    }

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 60 * 24 * 7 - 60, // 7 days - 1 minute
    })

    return url;
  }

  async deleteLogo(barId: number) {
    const bar = await this.findOne(barId);

    if (!bar) {
      throw new NotFoundException("Bar not found");
    }

    if (bar.logoName) { 
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: "Logos/" + bar.logoName,
      };

      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);

      const barWithDeletedLogo = await this.databaseService.bars.update({
        where: {
          id: barId,
        },
        data: {
          logoName: null
        },
        include: {
          cameraUrls: true,
        },
      });

      return barWithDeletedLogo;
    }
  }
}
