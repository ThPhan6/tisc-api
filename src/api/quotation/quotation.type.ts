export interface IQuotationRequest {
  author: string;
  identity: string;
  quotation: string;
}

export interface IQuotationResponse {
  data: {
    id: string;
    author: string;
    identity: string;
    quotation: string;
    created_at: string;
  };
  statusCode: number;
}

export interface IQuotationsResponse {
  data: {
    id: string;
    author: string;
    identity: string;
    quotation: string;
    created_at: string;
  }[];
  statusCode: number;
}
