import { Module, forwardRef } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { Preferences, preferencesSchema } from "./schemas/preferences.schemas";
import { PreferencesController } from "./preferences.controller";
import { PreferencesService } from "./preferences.service";

@Module({
    imports: [
      forwardRef(() => UsersModule),
      MongooseModule.forFeature([
        { name: Preferences.name, schema: preferencesSchema },
      ]),
    ],
    controllers: [PreferencesController],
    providers: [PreferencesService],
    exports: [PreferencesService],
  })
  export class PreferencesModule { }
  