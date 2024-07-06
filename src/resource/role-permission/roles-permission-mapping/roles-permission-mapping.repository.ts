import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RolesPermissionMapping, rolesPermissionMappingDocument } from "./schema/roles.permission.mapping.schema";
import { Model } from "mongoose";
import { GenericRepository } from "src/repository/GenericMongoRepository";

@Injectable()
export class rolesPermissionMappingRepository extends GenericRepository<rolesPermissionMappingDocument> {
    constructor(
        @InjectModel(RolesPermissionMapping.name)
        protected readonly model: Model<rolesPermissionMappingDocument>,
    ) {
        super(model);
    }

}