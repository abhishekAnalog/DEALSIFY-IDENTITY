import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";

export type newsletterDocument = HydratedDocument<newsletter_subscriptions>;

@Schema({
    timestamps: true,
    versionKey: false
})
export class newsletter_subscriptions {
    @Prop({ index: true, required: true})
    email: string;
}

export const newsletterSchema = SchemaFactory.createForClass(newsletter_subscriptions);
