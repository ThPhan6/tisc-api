export interface IDocumentation {
  id: string;
  logo?: string | null;
  type?: number | null;
  title: string;
  document: string;
  created_at?: any;
  created_by: string;
  updated_at?: any;
}

export interface IDocumentationRequest {
  title: string;
  document: string;
}

export interface IDocumentationResponse {
  data: IDocumentation;
  statusCode: number;
}
export interface IDocumentationsResponse {
  data: IDocumentation[];
  statusCode: number;
}
