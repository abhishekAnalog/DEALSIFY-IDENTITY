import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AdminUsers, adminUsersSchema } from "./schemas/admin.users.schema";
import { adminUsersController } from "./admin.users.controller";
import { adminUsersService } from "./admin.users.service";
import { adminUsersRepository } from "./admin.users.repository";



@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: AdminUsers.name,
                    schema: adminUsersSchema
                }
            ])
    ],
    controllers: [adminUsersController],
    providers: [adminUsersService, adminUsersRepository],
    exports: [adminUsersService],
})
export class AdminUsersModule { }
