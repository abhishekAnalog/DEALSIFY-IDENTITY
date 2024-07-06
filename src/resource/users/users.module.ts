import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UsersSchema } from './schemas/users.schemas';
import { UsersController } from './users.controller';
import { usersRepository } from './users.repository';
import {
  Company,
  companySchema,
} from '../company/schemas/onboard/company.schemas';
import { UsersTokenSchema } from './auth/schemas/usertoken.schema';
import { AllowSpecialCharacterHelpers } from 'src/common/pipes/allow-special-character-helpers';
import { JsonBuilderHelpers } from 'src/common/pipes/json-builder-helpers';
import { DateHelpers } from 'src/common/types/date.helper';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
      {
        name: Company.name,
        schema: companySchema,
      },
      {
        name: 'UserTokens',
        schema: UsersTokenSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    usersRepository,
    AllowSpecialCharacterHelpers,
    JsonBuilderHelpers,
    DateHelpers,
  ],
  exports: [UsersService],
})
export class UsersModule {}
