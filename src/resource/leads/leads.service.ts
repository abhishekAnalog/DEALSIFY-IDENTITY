import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { newsletterDocument, newsletter_subscriptions } from "./schemas/newsletter.schema";
import mongoose, { Model } from "mongoose";
import { NewsletterCreateDto } from "./dto/newslater.request.dto";
import { DealsifyLeadCreateDto } from "./dto/dealsifylead.request.dto";
import { leads, leadsDocument } from "./schemas/leads.schema";
import { PreferencesService } from "../preferences/preferences.service";
import { JsonBuilderHelpers } from "src/common/pipes/json-builder-helpers";
import { DealsifyOnboardRequest } from "./dto/dealsify-onboard-request.dto";
import { SchoolifyLeadCreateDto } from "./dto/schoolify.leads.request.dto";
import { RecaptchaService } from "src/common/service/recaptcha.service";

@Injectable()
export class leadsService {
    constructor(
        @InjectModel(newsletter_subscriptions.name)
        private newslaterModel: Model<newsletterDocument>,
        @InjectModel(leads.name)
        private leadsModel: Model<leadsDocument>,
        @Inject(forwardRef(() => PreferencesService))
        private readonly preferencesService: PreferencesService,
        private jsonBuilderHelpers: JsonBuilderHelpers,
        private recaptchaService: RecaptchaService

    ) { }

    async create(
        request: NewsletterCreateDto
    ): Promise<any> {
        try {

            const setQuery = {
                email: request.email
            };
            await this.newslaterModel.create(setQuery as any);
            return {
                successed: true,
                message: 'Email sent successfully',
                status: 'success',
            };

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

    async leadCreate(
        request: DealsifyLeadCreateDto,
        companyId: string
    ): Promise<any> {
        try {
            // this.recaptchaService.verify(request.recaptchaToken,"")
            // Get the current date
            const now = new Date();

            // Set the time components to zero to keep only the date part
            const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const preferenceData =
                await this.preferencesService.findPreferencesInfo(companyId);
            const generatedString = await this.jsonBuilderHelpers.manageAutoGenSeq(
                preferenceData,
                process.env.AUTO_GEN_LEAD,
            );
            const leadNo = generatedString.sequenceNoFormattedString;
            await this.preferencesService.updateTransactionCustomization(
                preferenceData?.data?._id.toString(),
                generatedString['companyPreference'],
            );
            const setQuery = {
                email: request.email,
                lead_no: leadNo,
                company_id: new mongoose.Types.ObjectId(companyId),
                user_id: new mongoose.Types.ObjectId("6448f7f4de452b32c81134d5"),
                assign: {
                    _id: new mongoose.Types.ObjectId("6448f7f4de452b32c81134d5"),
                    name: "Kapil Bhalala",
                },
                phoneNumber: request.phone,
                date: dateOnly,
                customerData: {
                    customer_name: request.companyName
                },
                referenceData: {
                    reference: "Google leads",
                    _id: new mongoose.Types.ObjectId("6458f25041b464f8e7bb35a3")
                },
                notes: request.notes
            };
            await this.leadsModel.create(setQuery as any);
            return {
                successed: true,
                message: 'Your lead generated successfully',
                status: 'success',
            };

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


    async onboardLeadCreate(
        request: DealsifyOnboardRequest,
        companyId: string
    ): Promise<any> {
        try {
            // Get the current date
            const now = new Date();

            // Set the time components to zero to keep only the date part
            const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const preferenceData =
                await this.preferencesService.findPreferencesInfo(companyId);
            const generatedString = await this.jsonBuilderHelpers.manageAutoGenSeq(
                preferenceData,
                process.env.AUTO_GEN_LEAD,
            );
            const leadNo = generatedString.sequenceNoFormattedString;
            await this.preferencesService.updateTransactionCustomization(
                preferenceData?.data?._id.toString(),
                generatedString['companyPreference'],
            );
            const setQuery = {
                email: request.email,
                lead_no: leadNo,
                company_id: new mongoose.Types.ObjectId(companyId),
                user_id: new mongoose.Types.ObjectId("6448f7f4de452b32c81134d5"),
                assign: {
                    _id: new mongoose.Types.ObjectId("6448f7f4de452b32c81134d5"),
                    name: "Kapil Bhalala",
                },
                phoneNumber: request.phone,
                date: dateOnly,
                contact_person: request.contactPerson,
                customerData: {
                    customer_name: request.companyName
                },
                referenceData: {
                    reference: "Google leads",
                    _id: new mongoose.Types.ObjectId("6458f25041b464f8e7bb35a3")
                },
                notes: `industry:${request.industry},jobTitle:${request.jobTitle},currentErpSystem:${request.currentErpSystem},comments:${request.comments},` +
                    `otherIndustry:${request.otherIndustry},otherJobTitle:${request.otherJobTitle}`
            };
            await this.leadsModel.create(setQuery as any);
            return {
                successed: true,
                message: 'Your lead generated successfully',
                status: 'success',
            };

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


    async schoolifyLeadCreate(
        request: SchoolifyLeadCreateDto,
        companyId: string
    ): Promise<any> {
        try {
            // Get the current date
            const now = new Date();

            // Set the time components to zero to keep only the date part
            const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const preferenceData =
                await this.preferencesService.findPreferencesInfo(companyId);
            const generatedString = await this.jsonBuilderHelpers.manageAutoGenSeq(
                preferenceData,
                process.env.AUTO_GEN_LEAD,
            );
            const leadNo = generatedString.sequenceNoFormattedString;
            await this.preferencesService.updateTransactionCustomization(
                preferenceData?.data?._id.toString(),
                generatedString['companyPreference'],
            );
            const setQuery = {
                email: request.email,
                lead_no: leadNo,
                company_id: new mongoose.Types.ObjectId(companyId),
                user_id: new mongoose.Types.ObjectId("644a939eaf9161f4a256587b"),
                assign: {
                    _id: new mongoose.Types.ObjectId("644a939eaf9161f4a256587b"),
                    name: "Schoolify",
                },
                phoneNumber: request.phone,
                date: dateOnly,
                contact_person: request.contactPerson,
                customerData: {
                    customer_name: request.schoolName
                },
                referenceData: {
                    reference: "Google leads",
                    _id: new mongoose.Types.ObjectId("6596bd08bdac21515e964ca6")
                }
            };
            await this.leadsModel.create(setQuery as any);
            return {
                successed: true,
                message: 'Your lead generated successfully',
                status: 'success',
            };

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