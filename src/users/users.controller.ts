import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
  Put,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @Roles(['ADMIN'])
  @UseGuards(AuthGuard)
  async findAll() {
    return await this.usersService.findAll();
  }

  @Post("upload-avatar")
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Body() dataDto: { userId: number }, 
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        ]
      })
    ) avatar: Express.Multer.File
  ) {
    console.log("UPLOAD AVATAR ", avatar)
    console.log("DATA DTO ", dataDto)
    // return avatar;
    return await this.usersService.uploadAvatar(avatar, +dataDto.userId);
  }

  @Get("get-avatar/:userId")
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async getAvatar(@Param('userId') userId: string) {
    return await this.usersService.getAvatar(+userId);
  }

  @Delete("delete-avatar/:userId")
  async deleteAvatar(@Param('userId') userId: string) {
    return await this.usersService.deleteAvatar(+userId);
  }

  @Get(':id')
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Roles(['ADMIN', 'USER'])
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(['ADMIN'])
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
