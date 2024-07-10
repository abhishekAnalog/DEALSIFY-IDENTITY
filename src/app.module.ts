import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection, Schema } from 'mongoose';
import configuration from './app.config';
import { AuthModule } from './resource/users/auth/auth.module';
import { UsersModule } from './resource/users/users.module';
import { ErpModulesModule } from './resource/role-permission/erp-modules/erp-modules.modules';
import { PermissionModule } from './resource/role-permission/permission/permission.modules';
import { RoleModule } from './resource/role-permission/roles/roles.modules';
import { RolesPermissionMappingModule } from './resource/role-permission/roles-permission-mapping/roles-permission-mapping.module';
import { UserRolesMappingModule } from './resource/role-permission/user-roles-mapping/user-roles-mapping.module';
import { AdminUsersModule } from './resource/admin-users/admin.users.module';
import { LeadsModule } from './resource/leads/leads.module';
import { PreferencesModule } from './resource/preferences/preferences.module';
import { ApiKeyGenerateModule } from './resource/api-key-generate/api-key-generate.module';
import { CompanyModule } from './resource/company/company.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
  MongooseModule.forRootAsync({
    imports: [],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('database.url'),
      connectionFactory: (connection: Connection) => {
        connection.plugin((schema: Schema) => {
          //For future use it returns all config of schemas
        });
        return connection;
      },
    }),
  }),
    AuthModule,
    UsersModule,
    ErpModulesModule,
    PermissionModule,
    RoleModule,
    RolesPermissionMappingModule,
    UserRolesMappingModule,
    AdminUsersModule,
    LeadsModule,
    PreferencesModule,
    ApiKeyGenerateModule,
    CompanyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
