import { IQuotationAttributes } from "@/types/quotation.type";
import { IPagination } from "@/type/common.type";
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
    pagination: IPagination;
  };
  statusCode: number;
}
