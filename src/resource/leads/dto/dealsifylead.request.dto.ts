import { IsNotEmpty } from "@nestjs/class-validator";
import { IsEmail, IsString, isObject } from "class-validator";
import { phoneNumber } from "src/common/types/phonenumber.schema";

export class DealsifyLeadCreateDto {

    @IsString()
    @IsNotEmpty()
    readonly companyName: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
 
    @IsString()
    readonly notes: string;

    @IsString()
    readonly recaptchaToken: string;

    readonly phone: phoneNumber[];
}