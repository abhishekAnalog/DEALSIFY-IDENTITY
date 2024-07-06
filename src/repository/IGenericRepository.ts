import { FilterQuery, QueryOptions } from 'mongoose';
import { UpdateQuery } from 'mongoose';
import { Projection } from './types';
import { PaginatorSchematicsInterface } from 'src/utils/paginator/paginator.schema';
import { SchemaId } from 'src/types/helper';

export interface IGenericRepository<T> {
  findById(id: SchemaId, options?: QueryOptions): Promise<T>;

  findAll(query?: FilterQuery<T>): Promise<Array<T>>;

  findAllPaginated(
    query?: FilterQuery<T>,
    options?: QueryOptions,
    projection?: Projection<T>,
  ): Promise<PaginatorSchematicsInterface<T>>;

  first(query: FilterQuery<T>): Promise<T>;

  update(id: string, data: UpdateQuery<T>): Promise<T>;

  create<DTO = any>(data: DTO): Promise<T>;

  delete(id: SchemaId): Promise<T>;
}
