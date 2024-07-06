import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

export type rolesDocument = HydratedDocument<Role>;

@Schema({
    collection: 'Role'
})
export class Role {
    @Prop({ unique: true, required: true })
    Roles: string;

}

export const RoleSchema = SchemaFactory.createForClass(Role);
