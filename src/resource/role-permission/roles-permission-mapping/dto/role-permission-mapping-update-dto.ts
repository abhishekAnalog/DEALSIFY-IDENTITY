import { PartialType } from "@nestjs/swagger";
import { RolesPermissionMaapingCreateDto } from "./role-permission-mapping-create-dto";

export class UpdateRolePermissionMappingDto extends PartialType(RolesPermissionMaapingCreateDto) {}