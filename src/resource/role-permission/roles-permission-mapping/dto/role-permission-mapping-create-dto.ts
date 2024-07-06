import { IsNotEmpty } from "@nestjs/class-validator";
import { IsString } from "class-validator";

export class RolesPermissionMaapingCreateDto {


    @IsString()
    @IsNotEmpty()
    readonly roleId: string;
     
    @IsNotEmpty()
    readonly permissionId: string[];
}