export interface IMessageResponse {
  message: string;
  statusCode: number;
}

export interface IPagination {
  page: number;
  page_size: number;
  total: number;
  page_count: number;
}
