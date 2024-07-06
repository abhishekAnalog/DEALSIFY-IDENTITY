import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import mongoose, { Model } from "mongoose";
import { Company, companyDocument } from "./schemas/onboard/company.schemas";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from 'bcrypt';

@Injectable()
export class companyService {
    constructor(
        @InjectModel(Company.name)
        private companyModel: Model<companyDocument>
    ) { }

    public async validateApiKey(apiKey: string) {
        try {
            // Fetch only the apiToken field for each company
            const potentialCompanies = await this.companyModel.find().select('apiToken').exec();

            for (const company of potentialCompanies) {
                // Check if apiKey and company.apiToken are defined and not null
                if (apiKey && company.apiToken) {
                    const isMatch = await bcrypt.compare(apiKey, company.apiToken);
                    if (isMatch) {
                        // Fetch the full company record since only apiToken was selected earlier
                        return this.companyModel.findById(company._id).exec();
                    }
                }
            }

            // If no record found, throw a custom exception
            throw new HttpException(
                { status: 'fail', message: 'No Record Found!!!' },
                HttpStatus.BAD_REQUEST
            );
        } catch (error) {
            // Proper error handling
            if (error instanceof HttpException) {
                throw error; // Rethrow HttpException
            } else {
                // Throw a custom internal server error
                throw new HttpException(
                    {
                        message: 'Internal server error!!!',
                        stack: error.stack,
                        name: error.name,
                        status: 'fail',
                        err: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }
}