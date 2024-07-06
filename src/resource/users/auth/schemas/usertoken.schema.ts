import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Users } from '../../schemas/users.schemas';
import { Company } from 'src/resource/company/schemas/onboard/company.schemas';

export type usersTokenDocument = HydratedDocument<UserTokens>;

@Schema({
  collection: 'UserTokens',
  timestamps: true,
})
export class UserTokens {
  @Prop({ required: true })
  token: string;

  @Prop({ required: false })
  isLogin: boolean;

  @Prop({
    ref: Users.name,
    type: SchemaTypes.ObjectId,
    required: true,
    index: true,
  })
  userId: Users;

  @Prop({
    ref: Company.name,
    type: SchemaTypes.ObjectId,
    required: true,
    index: true,
  })
  companyId: Company;

  @Prop()
  tokenExpires: Date;

  @Prop()
  tokenCreated: Date;
}

export const UsersTokenSchema = SchemaFactory.createForClass(UserTokens);
