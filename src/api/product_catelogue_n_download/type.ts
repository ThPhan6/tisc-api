export interface IProductCatelogueNDownloadRequest {
  product_id: string;
  contents: {
    id?: string;
    title: string;
    url: string;
  }[];
}

export interface IUpdateProductCatelogueNDownloadRequest {
  contents: {
    id?: string;
    title: string;
    url: string;
  }[];
}

export interface IProductCatelogueNDownloadResponse {
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
