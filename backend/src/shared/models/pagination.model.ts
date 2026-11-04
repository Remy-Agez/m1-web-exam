export interface PaginationModel {
  page: number;
  limit: number;
}

export interface PageModel<T> {
  totalCount: number;
  items: T[];
}
