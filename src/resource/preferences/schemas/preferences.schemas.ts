import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Company } from 'src/resource/company/schemas/onboard/company.schemas';
import { Users } from 'src/resource/users/schemas/users.schemas';

@Schema({ versionKey: false })
export class TransactionCustomize {
    @Prop({ required: true })
    transactionType: string;

    @Prop({ required: true })
    series: string;

    @Prop({ required: true })
    delimiter: string;

    @Prop({ required: true })
    sequenceLength: number;

    @Prop({ required: true })
    sequence: number;
}

// Generate a Mongoose Schema before use as Subdocument
const transactionCustomizeSchema =
    SchemaFactory.createForClass(TransactionCustomize);

@Schema({
    timestamps: true,
})
export class Preferences {
    @Prop({ index: true, required: true })
    financialYear: string;

    @Prop({ required: true, index: true })
    currency: string;

    @Prop({ index: true })
    defaultLanguage: string;

    @Prop({ index: true })
    timeZone: string;

    @Prop({ index: true })
    dateFormat: string;

    @Prop({ type: [transactionCustomizeSchema] })
    transactionCustomize: TransactionCustomize[];
    
    @Prop({
        ref: Company.name,
        type: SchemaTypes.ObjectId,
        required: true,
        index: true,
    })
    company_id: Company;

    @Prop({
        ref: Users.name,
        type: SchemaTypes.ObjectId,
        required: true,
        index: true,
    })
    user_id: Users;

    @Prop({
        ref: Users.name,
        type: SchemaTypes.ObjectId,
        required: true,
        index: true,
    })
    created_id: Users;

    @Prop({
        ref: Users.name,
        type: SchemaTypes.ObjectId,
        index: true,
    })
    updated_id: Users;
}

export type preferencesDocument = HydratedDocument<Preferences>;
export const preferencesSchema = SchemaFactory.createForClass(Preferences);
