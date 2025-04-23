import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { PutObjectCommand, GetObjectCommand, S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClerkClient, Client, verifyToken } from '@clerk/backend';


@Injectable()
export class UsersService {
  private s3Client: S3Client;

  constructor(private readonly databaseService: DatabaseService){
    this.s3Client = new S3Client({
      region: process.env.BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      }
    })
  }

  async uploadAvatar(avatar: Express.Multer.File, userId: number) {

    const user = await this.findOne(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const randomImageName = () => {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    const imageName = randomImageName();

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: "Avatars/" + (user.avatarName ? user.avatarName : imageName),
      Body: avatar.buffer,
      ContentType: avatar.mimetype,
    }

    const command = new PutObjectCommand(params);

    try {

      const response = await this.s3Client.send(command);

      if (response) {
        // After image was uploaded into s3, update the user in the database
        const updatedUser = await this.databaseService.users.update({
          where: {
            id: +userId,
          },
          data: {
            avatarName: user.avatarName ? user.avatarName : imageName
          }
        })
  
        return updatedUser;
      }
    } catch (error) {
      console.error("Error uploading avatar", error);
      throw error;
    }
  }

  async getAvatar(userId: number) {
    const user = await this.findOne(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }
    // If there is no avatar return null
    // so we do not send fake link to the user
    if (!user.avatarName) {
      return null;
    }
    
    const getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: "Avatars/" + user.avatarName,
    }

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 60 * 24 * 7 - 60, // 7 days - 1 minute
    })

    return url;
  }

  async deleteAvatar(userId: number) {
    const user = await this.findOne(userId);
    
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.avatarName) {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: "Avatars/" + user.avatarName,
      }

      const command = new DeleteObjectCommand(params);
      await this.s3Client.send(command);  

      const updatedUser = await this.databaseService.users.update({
        where: {
          id: userId,
        },
        data: {
          avatarName: null,
        }
      })

      return updatedUser;
    }
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userData = { ...createUserDto, password: hashedPassword };
    return await this.databaseService.users.create({
      data: userData,
      select: {
        id: true,
        clerk_id: true,
        email: true,
        username: true,
        isGoogleAccount: true,
      }
    });
  }

  async findAll() {
    return await this.databaseService.users.findMany({
      select: {
        id: true,
        clerk_id: true,
        email: true,
        username: true,
        isGoogleAccount: true,
      }
    });
  }

  async findOne(id: number) {
    return await this.databaseService.users.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        clerk_id: true,
        email: true,
        username: true,
        isGoogleAccount: true,
        avatarName: true,
      }
    });
  }

  async findUsersRole(email: string) {
    const foundUser = await this.databaseService.users.findUnique({
      where: {
        email: email
      }
    })

    return foundUser.role
  }

  async findByEmail(email: string) {
    return await this.databaseService.users.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        clerk_id: true,
        email: true,
        username: true,
        password: true,
        isGoogleAccount: true,
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.databaseService.users.update({
      where: {
        id: id,
      },
      data: updateUserDto,
      select: {
        id: true,
        clerk_id: true,
        email: true,
        username: true,
        isGoogleAccount: true,
      }
    });
  }

  async resetPassword(userId: number, resetToken: string, newPassword: string) {

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.databaseService.users.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      }
    })
  }

  async remove(id: number) {
    return await this.databaseService.users.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
        clerk_id: true,
        email: true,
        username: true,
        isGoogleAccount: true,
      }
    });
  }
}
