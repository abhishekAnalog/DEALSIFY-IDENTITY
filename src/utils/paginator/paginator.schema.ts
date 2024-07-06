export interface PaginatorSchematicsInterface<T = any> {
  data: T[];
  totalRecords: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  succeeded: boolean;
}
export interface PaginatorSchemaInterface<T = any> {
  data: T;
  totalRecords: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  succeeded: boolean;
}
export class PaginatorSchema {
  static build<T = any>(
    totalRecords: number,
    data: T[],
    page: number,
    pageSize: number,
    succeeded: boolean,
  ): PaginatorSchematicsInterface<T> {
    const totalPages = Math.ceil(totalRecords / pageSize);
    return <PaginatorSchematicsInterface<T>>{
      data,
      totalRecords,
      pageSize,
      pageNumber: page,
      totalPages,
      succeeded: true,
    };
  }

  static buildResult<T = any>(
    totalRecords: number,
    data: T,
    page: number,
    pageSize: number,
    succeeded: boolean,
  ): PaginatorSchemaInterface<T> {
    const totalPages = Math.ceil(totalRecords / pageSize);
    return <PaginatorSchemaInterface<T>>{
      data,
      totalRecords,
      pageSize,
      pageNumber: page,
      totalPages,
      succeeded: true,
    };
  }
}
