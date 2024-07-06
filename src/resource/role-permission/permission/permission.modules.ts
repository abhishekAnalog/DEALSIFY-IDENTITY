import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { permissionRepository } from './permission.repository';
import { permissionService } from './permission.service';
import { permissionController } from './permission.controller';
import { erpModulesService } from '../erp-modules/erp-modules.service';
import { erpModulesRepository } from '../erp-modules/erp-modules.repository';
import { Modules, ModulesSchema } from '../erp-modules/schemas/erp-modules.schemas';
import { UsersModule } from 'src/resource/users/users.module';


@Module({
    imports: [
        UsersModule,
        MongooseModule.forFeature(
            [
                {
                    name: Permission.name,
                    schema: PermissionSchema
                },
                {
                    name: Modules.name,
                    schema: ModulesSchema
                },
            ])
    ],
    controllers: [permissionController],
    providers: [permissionService, permissionRepository, erpModulesService, erpModulesRepository,],
    exports: [permissionService],
})
export class PermissionModule { }
