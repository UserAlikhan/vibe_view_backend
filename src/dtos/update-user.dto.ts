import { ROLES } from "@prisma/client";
import { IsBoolean, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {

    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsInt()
    clerk_id: number;

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
