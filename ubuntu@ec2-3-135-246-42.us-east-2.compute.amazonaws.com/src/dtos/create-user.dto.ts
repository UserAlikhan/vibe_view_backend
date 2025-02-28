import { ROLES } from "@prisma/client";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {

    @IsOptional()
    @IsString()
    clerk_id: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    username: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 20)
    password: string;

    @IsOptional()
    @IsBoolean()
    isGoogleAccount: boolean;

    @IsOptional()
    @IsEnum(ROLES)
    role: ROLES;
}
