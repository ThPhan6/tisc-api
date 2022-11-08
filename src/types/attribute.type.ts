import { Pagination } from "@/types";

export interface SubAttribute {
  id: string;
  name: string;
  basis_id: string;
  basis?: any;
}

export interface AttributeProps {
  id: string;
  type: AttributeType;
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

export enum AttributeType {
  General = 1,
  Feature = 2,
  Specification = 3,
}

export interface ListAttributeWithPagination {
  pagination: Pagination;
  data: AttributeProps[];
}
