export interface IDocumentation {
  id: string;
  logo: string | null;
  type: number | null;
  title: string;
  document: object;
  created_at?: any;
  created_by: string;
  updated_at?: any;
  isDeleted: boolean;
}

export interface IDocumentationRequest {
  title: string;
  document: object;
  type: number | null;
}

export interface IDocumentationResponse {
  data: IDocumentation;
  statusCode: number;
}
export interface IDocumentationsResponse {
  data: IDocumentation[];
  statusCode: number;
}
