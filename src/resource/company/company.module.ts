import { Module } from "@nestjs/common";
import { companyService } from "./company.service";
import { Company, companySchema } from "./schemas/onboard/company.schemas";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: Company.name,
                    schema: companySchema
                }

            ])
    ],
    providers: [companyService],
    exports: [companyService],
})
export class CompanyModule { }