import { IsNotEmpty } from "@nestjs/class-validator";

export class UserRolesMaapingCreateDto {

    
    @IsNotEmpty()
    readonly roleId: string[];
     
    @IsNotEmpty()
    readonly userId: string;
}