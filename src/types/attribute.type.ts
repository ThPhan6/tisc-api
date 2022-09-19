export interface SubAttribute {
  id: string;
  name: string;
  basis_id: string;
  basis?: any;
}

export interface IAttributeAttributes {
  id: string;
  type: number;
  name: string;
  subs: SubAttribute[];
  created_at: string;
  updated_at: string | null;
}

interface SubAttributeResponse extends SubAttribute {
  content_type: string;
  description: string;
  description_1?: string;
  description_2?: string;
}

export interface AttributeResponseData {
  id: string;
  name: string;
  count: number;
  subs: SubAttributeResponse[];
  created_at: string;
}

export interface IContentType {
  id: string;
  name?: string;
  type: string;
  name_1?: string;
  name_2?: string;
}

export type AttributeType = 1 | 2 | 3;

export interface ListAttributeWithPagination {
  pagination: {
    page: number;
    page_size: number;
    total: number;
    page_count: number;
  };
  data: IAttributeAttributes[];
}
