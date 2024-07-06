import { Injectable } from "@nestjs/common";
import { GenericRepository } from "src/repository/GenericMongoRepository";
import { UserRolesMapping, userRolesMappingDocument } from "./schemas/user.role.mapping.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class userRolesMappingRepository extends GenericRepository<userRolesMappingDocument> {
    constructor(
        @InjectModel(UserRolesMapping.name)
        protected readonly model: Model<userRolesMappingDocument>,
    ) {
        super(model);
    }

}