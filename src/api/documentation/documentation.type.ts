export interface IDocumentation {
  id: string;
  logo: string | null;
  type: number | null;
  title: string;
  document: object;
  created_at: string | null;
  created_by: string;
  updated_at: string | null;
  is_deleted: boolean | null;
  author?: any;
}

export interface IDocumentationRequest {
  title: string;
  document: object;
  type: number | null;
  logo?: string;
}

export interface IDocumentationResponse {
  data: IDocumentation;
  statusCode: number;
}
export interface IDocumentationsResponse {
  data: {
    documentations: IDocumentation[];
    pagination: {
      page: number;
      page_size: number;
      total: number;
      page_count: number;
    };
  };
  statusCode: number;
}
