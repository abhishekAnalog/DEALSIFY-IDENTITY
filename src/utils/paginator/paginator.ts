import { IsOptional, IsString } from '@nestjs/class-validator';
import { Type } from '@nestjs/class-transformer';
export default class Paginator {
  @IsOptional()
  @Type(() => Number)
  pageNumber?: number;

  @IsOptional()
  @Type(() => Number)
  pageSize?: number;

  @IsOptional()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsString()
  @Type(() => String)
  sortField?: string;

  @IsOptional()
  @IsString()
  sortOrder: 'ascend' | 'descend' = 'ascend';

  @IsOptional()
  @IsString()
  @Type(() => String)
  columnSearchInput?: string;
}
