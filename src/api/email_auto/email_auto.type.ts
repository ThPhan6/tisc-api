export interface IUpdateEmailAutoRequest {
  topic: number;
  targeted_for: number;
  title: string;
  message: string;
}

export interface IEmailAutoResponse {
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

export interface IEmailsAutoResponse {
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
