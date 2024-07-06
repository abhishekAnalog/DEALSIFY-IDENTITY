import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Modules, modulesDocument } from './schemas/erp-modules.schemas';
import { GenericRepository } from 'src/repository/GenericMongoRepository';

@Injectable()
export class erpModulesRepository extends GenericRepository<modulesDocument> {
  constructor(
    @InjectModel(Modules.name)
    protected readonly model: Model<modulesDocument>,
  ) {
    super(model);
  }
}
