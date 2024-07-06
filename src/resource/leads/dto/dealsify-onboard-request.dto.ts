import { IsNotEmpty } from "@nestjs/class-validator";
import { IsEmail, IsString, isObject } from "class-validator";
import { phoneNumber } from "src/common/types/phonenumber.schema";

export class DealsifyOnboardRequest {

    @IsString()
    @IsNotEmpty()
    readonly companyName: string;

    @IsString()
    readonly contactPerson: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    readonly industry: string;

    @IsString()
    readonly otherIndustry: string;

    @IsString()
    readonly jobTitle: string;

    @IsString()
    readonly otherJobTitle: string;

    @IsString()
    readonly currentErpSystem: string;

    @IsString()
    readonly comments: string;

    @IsString()
    readonly recaptchaToken: string;

    readonly phone: phoneNumber[];
}