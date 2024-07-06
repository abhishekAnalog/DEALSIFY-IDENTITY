import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateModulesDto {
     
    @IsNotEmpty()    
    readonly moduleName: string[];

    @IsBoolean()
    readonly isSpecific: boolean;

}