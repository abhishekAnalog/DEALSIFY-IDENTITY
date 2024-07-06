import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Company } from 'src/resource/company/schemas/onboard/company.schemas';

export type adminUsersDocument = HydratedDocument<AdminUsers>;

@Schema({
  // collection: 'AdminUsers',
  timestamps: true,
})
export class AdminUsers {
  @Prop({ unique: true, index: true, required: true })
  email: string;

  @Prop({ required: false })
  userName: string;

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
  companyId: Company;

  @Prop()
  phoneNumber: string;
}

export const adminUsersSchema = SchemaFactory.createForClass(AdminUsers);
