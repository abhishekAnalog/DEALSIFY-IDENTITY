import { PartialType } from "@nestjs/swagger";
import { UserRolesMaapingCreateDto } from "./user-roles-mapping-create-dto";


export class UpdateUserRolesMappingDto extends PartialType(UserRolesMaapingCreateDto) { }