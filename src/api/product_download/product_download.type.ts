export interface IProductDownloadRequest {
  product_id: string;
  file_name: string;
  url: string;
}

export interface IProductDownloadResponse {
  data: {
    id: string;
    product_id: string;
    file_name: string;
    url: string;
    created_at: string;
  };
  statusCode: number;
}
export interface IProductDownloadsResponse {
  data: {
    id: string;
    product_id: string;
    file_name: string;
    url: string;
    created_at: string;
  }[];
  statusCode: number;
}
