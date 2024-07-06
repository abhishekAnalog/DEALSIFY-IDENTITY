import { Injectable } from "@nestjs/common";
import { Role, rolesDocument } from "./schemas/roles.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GenericRepository } from "src/repository/GenericMongoRepository";

@Injectable()
export class roleRepository extends GenericRepository<rolesDocument> {
    constructor(
        @InjectModel(Role.name)
        protected readonly model: Model<rolesDocument>,
    ) {
        super(model);
    }

}