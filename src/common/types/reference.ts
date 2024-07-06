import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ versionKey: false ,timestamps:false })
export class Reference {
  @Prop({ type: Types.ObjectId, index: true })
  _id: Types.ObjectId;

  @Prop({ required: true, index: true })
  reference: string;
}
