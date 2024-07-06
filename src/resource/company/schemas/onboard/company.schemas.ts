import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Address } from '../types/address';

@Schema({ versionKey: false })
@Schema({
  timestamps: true,
})
export class Company {
  @Prop({ required: true })
  companyName: string;

  @Prop()
  logo: string;

  @Prop({ type: Address })
  companyAddress: Address;

  @Prop()
  currency: string;

  @Prop({ index: true })
  timezone: string;

  @Prop({ index: true })
  language: string;
  @Prop({ index: true })
  businessCategory: string;
  @Prop({ index: true })
  gstIn: string;
  @Prop({ index: true })
  phone: string;
  @Prop({ index: true })
  email: string;
  @Prop()
  website: string;
  @Prop()
  isActive: boolean;
  @Prop()
  financialYear: string;
  
  @Prop()
  apiToken: string;
}

export type companyDocument = HydratedDocument<Company>;
export const companySchema = SchemaFactory.createForClass(Company);
