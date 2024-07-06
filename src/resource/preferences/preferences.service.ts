import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Preferences, preferencesDocument } from "./schemas/preferences.schemas";
import mongoose, { Model } from "mongoose";
import { UpdateTransactionCustomizationDto } from "./dto/transaction-customization-preference.dto";

@Injectable()
export class PreferencesService {
    constructor(
        @InjectModel(Preferences.name)
        private preferencesModal: Model<preferencesDocument>
    ) { }


    public async findPreferencesInfo(companyId: string) {
        try {
            const getOneRecord = await this.preferencesModal
                .findOne({ company_id: companyId })
                .exec();

            if (getOneRecord) {
                return { data: getOneRecord, status: 'success', companyId: companyId };
            } else {
                throw new HttpException(
                    {
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

    async updateTransactionCustomization(
        id: string,
        updateTransactionCustomizationDto: UpdateTransactionCustomizationDto,
    ): Promise<any> {
        try {
            const updateObject = {};
            let existObj = JSON.parse(
                JSON.stringify(updateTransactionCustomizationDto),
            ); // Deep copy
            for (const [key, value] of Object.entries(existObj)) {
                updateObject[`transactionCustomize.$.${key}`] = value;
            }

            const updatedData = await this.preferencesModal
                .findOneAndUpdate(
                    {
                        _id: new mongoose.Types.ObjectId(id),
                        'transactionCustomize.transactionType':
                            updateTransactionCustomizationDto.transactionType,
                    },
                    { $set: updateObject },
                    { new: true },
                )
                .exec();

            if (!updatedData) {
                return { message: 'Preferences not found', status: 'error' };
            }

            return {
                data: updatedData,
                message: 'Preferences Updated Successfully!',
                status: 'success',
            };
        } catch (err) {
            throw err;
        }
    }
}