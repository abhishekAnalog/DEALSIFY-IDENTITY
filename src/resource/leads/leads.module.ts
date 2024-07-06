import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { leadsController } from "./leads.controller";
import { newsletterSchema, newsletter_subscriptions } from "./schemas/newsletter.schema";
import { leadsService } from "./leads.service";
import { leads, leadsSchema } from "./schemas/leads.schema";
import { PreferencesModule } from "../preferences/preferences.module";
import { JsonBuilderHelpers } from "src/common/pipes/json-builder-helpers";
import { ConfigModule } from "@nestjs/config";
import { ApiKeyGuard } from "src/guards/ApiKey.guard";
import { CompanyModule } from "../company/company.module";
import { RecaptchaService } from "src/common/service/recaptcha.service";
import { HttpModule, HttpService } from "@nestjs/axios";

@Module({
    imports: [
        ConfigModule.forRoot(),
        CompanyModule,
        forwardRef(() => PreferencesModule),
        MongooseModule.forFeature(
            [
                {
                    name: newsletter_subscriptions.name,
                    schema: newsletterSchema
                },

                {
                    name: leads.name,
                    schema: leadsSchema
                }
            ]),
        HttpModule  // Add HttpModule to imports
    ],
    controllers: [leadsController],
    providers: [leadsService, JsonBuilderHelpers, ApiKeyGuard, RecaptchaService],
    exports: [leadsService],
})
export class LeadsModule { }
