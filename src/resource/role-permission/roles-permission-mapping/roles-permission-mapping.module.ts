import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RolesPermissionMapping, RolesPermissionMappingSchema } from "./schema/roles.permission.mapping.schema";
import { rolesPermissionMappingController } from "./roles-permission-mapping.controller";
import { rolesPermissionMappingService } from "./roles-permission-mapping.service";
import { rolesPermissionMappingRepository } from "./roles-permission-mapping.repository";
 
@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: RolesPermissionMapping.name,
                    schema: RolesPermissionMappingSchema
                }
              
            ])
    ],
    controllers: [rolesPermissionMappingController],
    providers: [rolesPermissionMappingService,rolesPermissionMappingRepository],
    exports: [rolesPermissionMappingService],
})
export class RolesPermissionMappingModule { }
