import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ versionKey: false, timestamps: false })
export class phoneNumber {
  @Prop({ index: true })
  phone: Number;
}
