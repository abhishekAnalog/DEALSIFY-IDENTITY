import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ versionKey: false })
export class LeadStage {
  @Prop({ type: Types.ObjectId, index: true })
  _id: Types.ObjectId;

  @Prop({ required: true, index: true })
  status_label: string;

  @Prop()
  status: string;
  @Prop({ index: true })
  status_color: string;

  @Prop({ index: true })
  credibility: string;
}
// Generate a Mongoose Schema before use as Subdocument
export const leadStageSchema = SchemaFactory.createForClass(LeadStage);