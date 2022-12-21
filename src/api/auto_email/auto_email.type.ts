import { IAutoEmailAttributes, Pagination } from "@/types";
export interface IUpdateAutoEmailRequest {
  topic: number;
  targeted_for: number;
  title: string;
  message: string;
}

export interface IAutoEmailResponse {
  data: IAutoEmailAttributes;
  statusCode: number;
}

export interface IAutoEmailsResponse {
  data: {
    auto_emails: IAutoEmailAttributes[];
    pagination: Pagination;
  };
  statusCode: number;
}
