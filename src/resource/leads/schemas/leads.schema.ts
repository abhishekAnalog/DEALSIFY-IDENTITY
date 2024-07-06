import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { Assign } from "src/common/types/assign";
import { LeadStage, leadStageSchema } from "src/common/types/leadStage";
import { phoneNumber } from "src/common/types/phonenumber.schema";
import { Reference } from "src/common/types/reference";
import { Company } from "src/resource/company/schemas/onboard/company.schemas";
import { Address } from "src/resource/company/schemas/types/address";
import { Users } from "src/resource/users/schemas/users.schemas";
import { CustomFields, customFieldSchema } from "src/utils/entities/customfields.schema";

export type leadsDocument = HydratedDocument<leads>;

@Schema({
    timestamps: true

})
export class leads {
    @Prop({ required: true, index: true })
    date: Date;
    @Prop({ type: [customFieldSchema], default: [] })
    customLeadsFields: CustomFields[];
    @Prop({ index: true })
    nextFollowupDate: Date;

    @Prop({ type: Address })
    address: Address;

    @Prop({
        required: true,
        type: Reference,
        index: true,
    })
    referenceData: Reference;

    @Prop({
        required: true,
        type: Assign,
        index: true,
    })
    assign: Assign;

    @Prop({
        required: true,
        type: [leadStageSchema],
        index: true,
    })
    leadStage: LeadStage[];

    @Prop({
        required: false,
        type: String,
        index: true,
    })
    queryType: string;
    @Prop({
        ref: 'Company',
        type: SchemaTypes.ObjectId,
        required: true,
        index: true,
    })
    company_id: Company;

    @Prop({
        ref: 'Users',
        type: SchemaTypes.ObjectId,
        required: true,
        index: true,
    })
    user_id: Users;
    @Prop({
        required: true,
        type: Object,
        index: true,
    })
    customerData: object;

    //Remove this key after doc completed
    @Prop({
        type: Object,
        index: true,
    })
    customer_id: object;

    @Prop({ index: true })
    contact_person: string;

    @Prop({ index: true })
    phoneNumber: phoneNumber[];

    @Prop({ index: true })
    email: string;

    @Prop({ index: true, required: true })
    lead_no: String;

    @Prop()
    subject: string;

    @Prop()
    languagePreference: string;
    @Prop({ index: true, unique: true })
    indiaMartUniqueId: string;
    @Prop({ index: true, unique: true })
    tradeIndiaUid: string;
    @Prop()
    notes: string;

    @Prop()
    created_id: string;

    @Prop()
    updated_id: string;
}

export const leadsSchema = SchemaFactory.createForClass(leads);
