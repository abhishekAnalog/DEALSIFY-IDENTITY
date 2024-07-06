import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Modules, ModulesSchema } from './schemas/erp-modules.schemas';
import { erpModulesController } from './erp-modules.controller';
import { erpModulesService } from './erp-modules.service';
import { erpModulesRepository } from './erp-modules.repository';
 
 

@Module({
    imports: [
        MongooseModule.forFeature(
            [{
                name: Modules.name,
                schema: ModulesSchema
            },
            ])
    ],
    controllers: [erpModulesController],
    providers: [erpModulesService, erpModulesRepository],
    exports: [erpModulesService],
})
export class ErpModulesModule { }
