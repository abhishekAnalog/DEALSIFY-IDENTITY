import { IsNotEmpty } from "@nestjs/class-validator";
import { IsString } from "class-validator";

export class NewsletterCreateDto {

    @IsString()
    @IsNotEmpty()
    readonly email: string;
}