import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Company } from 'src/resource/company/schemas/onboard/company.schemas';

export type usersDocument = HydratedDocument<Users>;

@Schema({
  timestamps: true,
})
export class Users {
  @Prop({ unique: true, index: true, required: true })
  email: string;

  @Prop({ required: false })
  role: string;

  @Prop({ required: false, index: false })
  emailRestrictionDate: Date;

  @Prop({ required: false, index: false })
  emailRestrictionCount: number;

  @Prop({ required: false })
  image: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  isActive: boolean;

  @Prop({
    ref: 'Company',
    type: SchemaTypes.ObjectId,
    required: true,
    index: true,
  })
  company_id: Company;

  @Prop()
  reset_password_token: string;

  @Prop()
  resetTokenExpires: number;

  @Prop()
  resetToken: string;

  @Prop()
  sendMailCount: number;

  @Prop()
  phoneNumber: string;

  @Prop()
  reset_password_expires: number;

  @Prop({ index: true, required: true })
  name: string;

  @Prop({ index: true })
  refresh_token: string;

  @Prop({ index: true })
  created_id: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
