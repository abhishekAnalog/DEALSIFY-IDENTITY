import { IsNotEmpty } from "@nestjs/class-validator";
import { IsEmail, IsString, isObject } from "class-validator";
import { phoneNumber } from "src/common/types/phonenumber.schema";
import { Address } from "src/resource/company/schemas/types/address";

export class SchoolifyLeadCreateDto {

    @IsString()
    @IsNotEmpty()
    readonly schoolName: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    readonly contactPerson: string;

    @IsString()
    readonly recaptchaToken: string;

    readonly address: Address;

    readonly phone: phoneNumber[];
}