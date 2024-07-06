import { IsNotEmpty } from "@nestjs/class-validator";
import {   IsString } from "class-validator";

export class RolesCreateDto {
 
    @IsString()
    @IsNotEmpty()
    readonly roles: string;
}