import { MODEL_NAMES } from "../constant/common.constant";
import Model from "./index";

export interface IDocumentationAttributes {
  id: string;
  logo: string | null;
  type: number | null;
  title: string;
  document: object;
  created_at: string | null;
  created_by: string;
  updated_at: string | null;
  is_deleted: boolean | null;
}
export const DOCUMENTATION_NULL_ATTRIBUTES = {
  id: null,
  logo: null,
  type: null,
  title: null,
  document: null,
  created_at: null,
  created_by: null,
  updated_at: null,
  is_deleted: null,
};
export default class DocumentationModel extends Model<IDocumentationAttributes> {
  constructor() {
    super(MODEL_NAMES.DOCUMENTTATIONS);
  }
}
