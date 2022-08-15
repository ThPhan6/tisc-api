import { type } from "os";
import { IPagination } from "./../../type/common.type";
export interface IDocumentation {
  id: string;
  logo: string | null;
  type: number | null;
  title: string;
  document: object;
  created_at: string | null;
  created_by: string;
  updated_at: string | null;
  author?: any;
}

export interface IDocumentationRequest {
  title: string;
  document: object;
}
export interface IHowto {
  id: string;
  title: string;
  document: object;
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
    pagination: IPagination;
  };
  statusCode: number;
}

export type DocumentPolicy = {
  id: string;
  title: string;
  document: object;
};
export interface IDocumentPolicy {
  id: string;
  title: string;
  document: object;
}
export interface IGetPoliciesLandingPage {
  data: [
    {
      terms_of_services: DocumentPolicy;
    },
    {
      privacy_policy: DocumentPolicy;
    },
    {
      cookie_policy: DocumentPolicy;
    }
  ];
  statusCode: number;
}
