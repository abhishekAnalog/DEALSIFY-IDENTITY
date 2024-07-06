import { Injectable, PipeTransform } from '@nestjs/common';
import Paginator from './paginator';

@Injectable()
export default class PaginatorTransformPipe implements PipeTransform {
  transform({
    pageNumber,
    pageSize,
    sortOrder,
    sortField,
    columnSearchInput,
  }: Paginator): Paginator {
    let skip = 0;
    if (!pageNumber || pageNumber === 1) {
      pageNumber = 0;
    } else {
      pageNumber--;
    }

    if (!pageSize) {
      pageSize = 10;
    }
    if (pageNumber && pageSize) {
      skip = pageNumber * pageSize;
    }
    return {
      pageNumber,
      pageSize,
      skip,
      sortOrder,
      sortField,
      columnSearchInput,
    };
  }
}
