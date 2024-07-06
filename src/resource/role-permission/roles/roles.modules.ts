import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Role, RoleSchema } from "./schemas/roles.schema";
import { roleController } from "./roles.controller";
import { roleRepository } from "./roles.respository";
import { roleService } from "./roles.service";


@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: Role.name,
                    schema: RoleSchema
                }

            ])
    ],
    controllers: [roleController],
    providers: [roleRepository, roleService],
    exports: [roleRepository],
})
export class RoleModule { }
