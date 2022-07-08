import { IPagination } from "./../../type/common.type";
export interface IAttribute {
  id: string;
  name: string;
  count: number;
  subs: {
    id: string;
    name: string;
    basis_id: string;
    content_type: string;
    description: string;
    description_1?: string;
    description_2?: string;
  }[];
  created_at: string;
}

export interface IAttributeResponse {
  data: IAttribute;
  statusCode: number;
}
export interface IAttributesResponse {
  data: {
    attributes: IAttribute[];
    summary: {
      name: string;
      value: number;
    }[];
    pagination: IPagination;
  };
  statusCode: number;
}

export interface IAttributeRequest {
  name: string;
  type: number;
  subs: {
    name: string;
    basis_id: string;
    description: string;
  }[];
}
export interface IUpdateAttributeRequest {
  name: string;
  subs: {
    id: any;
    name: string;
    basis_id: string;
    description: string;
  }[];
}

export interface IContentTypesResponse {
  data: {
    texts: any;
    conversions: any;
    presets: any;
    options: any;
  };
  statusCode: number;
}

type TAttributeProduct = {
  subs: {
    basis: any;
    id: string;
    name: string;
    basis_id: string;
  }[];
  id: string;
  type: number;
  name: string;
  created_at: string;
};

export interface IGetAllAttributeResponse {
  data: {
    general: TAttributeProduct[];
    feature: TAttributeProduct[];
    specification: TAttributeProduct[];
  };
  statusCode: number;
}

export interface ISubAttribute {
  id: string;
  name: string;
  basis_id: string;
}

export interface IContentType {
  id: string;
  name?: string;
  type: string;
  name_1?: string;
  name_2?: string;
}
