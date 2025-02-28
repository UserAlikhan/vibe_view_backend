import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { CreateUserDto } from 'src/dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) { }

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
