import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
    
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;
}