import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserRolesMapping, UserRolesMappingSchema } from "./schemas/user.role.mapping.schema";
import { userRolesMappingController } from "./user-roles-mapping.controller";
import { userRolesMappingService } from "./user-roles-mapping.service";
import { userRolesMappingRepository } from "./user-roles-mapping.respository";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: UserRolesMapping.name,
                    schema: UserRolesMappingSchema
                }

            ])
    ],
    controllers: [userRolesMappingController],
    providers: [userRolesMappingService, userRolesMappingRepository],
    exports: [userRolesMappingService],
})
export class UserRolesMappingModule { }