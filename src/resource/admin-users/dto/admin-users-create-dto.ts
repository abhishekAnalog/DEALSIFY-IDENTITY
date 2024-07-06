import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AdminUsersCreateDto {

    @IsString()
    @IsNotEmpty()
    readonly userName: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly phoneNumber: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly image: string;
}