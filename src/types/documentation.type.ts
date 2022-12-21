import { Pagination } from "@/types";

export interface IDocumentationAttributes {
  id: string;
  logo: string | null;
  type: number | null;
  title: string;
  document: IDocument;
  created_at: string | null;
  created_by: string;
  updated_at: string | null;
  number: number;
}

export interface IDocument {
  document: string;
  question_and_answer: {
    question: string;
    answer: string;
  }[];
}
export interface IDocumentation {
  id: string;
  logo: string | null;
  type: number | null;
  title: string;
  document: IDocument;
  created_at: string | null;
  created_by: string;
  updated_at: string | null;
  author?: any;
}

export type DocumentationType = 1 | 2 | 3 | 4;

export interface ListDocumentationWithPagination {
  data: IDocumentation[];
  pagination: Pagination;
}
