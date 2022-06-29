export interface IUpdateAutoEmailRequest {
  topic: number;
  targeted_for: number;
  title: string;
  message: string;
}

export interface IAutoEmailResponse {
  data: {
    id: string;
    topic: number;
    targeted_for: number;
    title: string;
    message: string;
    created_at: string;
  };
  statusCode: number;
}

export interface IAutoEmailsResponse {
  data: {
    id: string;
    topic: number;
    targeted_for: number;
    title: string;
    message: string;
    created_at: string;
  }[];
  statusCode: number;
}
