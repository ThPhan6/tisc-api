import {
  AttributeResponseData,
  IAttributeAttributes,
} from "@/types/attribute.type";
import { IPagination } from "@/type/common.type";

export interface IAttributeResponse {
  data: AttributeResponseData;
  statusCode: number;
}
export interface IAttributesResponse {
  data: {
    attributes: AttributeResponseData[];
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
    id: string;
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

export interface IGetAllAttributeResponse {
  data: {
    general: IAttributeAttributes[];
    feature: IAttributeAttributes[];
    specification: IAttributeAttributes[];
  };
  statusCode: number;
}
