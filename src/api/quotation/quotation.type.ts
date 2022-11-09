import { Pagination, IQuotationAttributes } from "@/types";

export interface IQuotationRequest {
  author: string;
  identity: string;
  quotation: string;
}

export interface IQuotationResponse {
  data: IQuotationAttributes;
  statusCode: number;
}

export interface IQuotationsResponse {
  data: {
    quotations: IQuotationAttributes[];
    pagination: Pagination;
  };
  statusCode: number;
}
