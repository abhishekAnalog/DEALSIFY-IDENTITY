import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Company, companyDocument } from "../company/schemas/onboard/company.schemas";
import mongoose, { Model } from "mongoose";
import { RandomStringService } from "src/common/pipes/generate-random-string";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApiKeyGenerateService {
    constructor(
        @InjectModel(Company.name)
        private companyModal: Model<companyDocument>,
        private readonly randomStringService: RandomStringService
    ) { }

    public async apiKeyGenerate(companyId: string) {
        try {
            const getOneRecord = await this.companyModal
                .findOne({ _id: companyId })
                .exec();
            if (getOneRecord) {
                const generateRandomToken = this.randomStringService.generateRandomString(30);
                const saltRounds = 2;
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(generateRandomToken, salt);
                const setQuery = {
                    apiToken: hash
                };
                await this.companyModal.findOneAndUpdate(new mongoose.Types.ObjectId(companyId), setQuery)
                return { key: generateRandomToken, successed: true, status: 'success', message: "Your API key was generated successfully" };
            } else {
                throw new HttpException(
                    {
                        successed: false,
                        status: 'fail',
                        message: 'No Record Found!!!',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }
        } catch (error) {
            // Custom error handling logic
            if (error instanceof HttpException) {
                // Handle HttpException here or re-throw it
                throw error;
            } else {
                // You can throw your custom error here if needed
                throw new HttpException(
                    {
                        message: 'Internal server error!!!',
                        stack: error.stack,
                        name: error.name,
                        status: 'fail',
                        err: error.message,
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }
}