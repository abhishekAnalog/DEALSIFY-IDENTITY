import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";
import { Role } from "../../roles/schemas/roles.schema";
import { Users } from "src/resource/users/schemas/users.schemas";

export type userRolesMappingDocument = HydratedDocument<UserRolesMapping>;

@Schema({
    collection: 'UserRolesMapping',
})
export class UserRolesMapping {

    @Prop({
        ref: 'Role',
        type: SchemaTypes.ObjectId,
        required: true,
        index: true,
    })
    roleId: Role;

    @Prop({
        ref: 'Users',
        type: SchemaTypes.ObjectId,
        required: true,
        index: true,
    })
    permissionId: Users;

}

export const UserRolesMappingSchema = SchemaFactory.createForClass(UserRolesMapping);
