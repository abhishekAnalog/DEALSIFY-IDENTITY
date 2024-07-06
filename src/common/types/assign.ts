import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ versionKey: false })
export class Assign {
  @Prop({ type: Types.ObjectId, index: true })
  _id: Types.ObjectId;

  @Prop({ required: true, index: true })
  name: string;
}