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
    group_count: number;
    attribute_count: number;
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
