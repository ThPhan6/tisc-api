import { IDocument, IDocumentation, Pagination } from "@/types";

export interface IDocumentationRequest {
  title: string;
  document: IDocument;
}
export interface IHowto {
  id: string;
  title: string;
  document: IDocument;
}
export interface IHowtosResponse {
  data: any[];
  statusCode: number;
}
export interface IAllHowtoResponse {
  data: {
    tisc: any;
    brand: any;
    design: any;
  };
  statusCode: number;
}

export interface IDocumentationResponse {
  data: IDocumentation;
  statusCode: number;
}
export interface IDocumentationsResponse {
  data: {
    documentations: IDocumentation[];
    pagination: Pagination;
  };
  statusCode: number;
}

export interface IDocumentPolicy {
  id: string;
  title: string;
  document: object;
}
export interface IGetPoliciesLandingPage {
  data: [
    {
      terms_of_services: IDocumentPolicy;
    },
    {
      privacy_policy: IDocumentPolicy;
    },
    {
      cookie_policy: IDocumentPolicy;
    }
  ];
  statusCode: number;
}
