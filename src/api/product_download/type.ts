export interface IProductDownloadRequest {
  product_id: string;
  contents: {
    title: string;
    url: string;
  }[];
}

export interface IUpdateProductDownloadRequest {
  contents: {
    id?: string;
    title: string;
    url: string;
  }[];
}

export interface IProductDownloadResponse {
  data: {
    id: string;
    product_id: string;
    contents: {
      id: string;
      title: string;
      url: string;
    }[];
    created_at: string;
  };
  statusCode: number;
}
