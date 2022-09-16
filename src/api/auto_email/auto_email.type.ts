import { IAutoEmailAttributes } from "@/types/auto_email.type";
import { IPagination } from "@/type/common.type";
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
    pagination: IPagination;
  };
  statusCode: number;
}
