import { MongooseModule } from "@nestjs/mongoose";
import { Company, companySchema } from "../company/schemas/onboard/company.schemas";
import { Module } from "@nestjs/common";
import { ApiKeyGenerateService } from "./api-key-generate.service";
import { ApiKeyGenerateController } from "./api-key-generate.controller";
import { RandomStringService } from "src/common/pipes/generate-random-string";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Company.name,
                schema: companySchema
            },
        ]),
    ],
    controllers: [ApiKeyGenerateController],
    providers: [ApiKeyGenerateService, RandomStringService],
    exports: [ApiKeyGenerateService],
})
export class ApiKeyGenerateModule { }