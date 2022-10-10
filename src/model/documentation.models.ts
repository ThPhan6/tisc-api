import { IDocumentationAttributes } from "@/types";
import Model from "@/Database/Model";

export const DOCUMENTATION_NULL_ATTRIBUTES = {
  id: null,
  logo: null,
  type: null,
  title: null,
  document: {},
  created_at: null,
  created_by: null,
  number: 0,
  updated_at: null,
  is_deleted: false,
};

export default class DocumentationModel extends Model<IDocumentationAttributes> {
  protected table = "documentations";
  protected softDelete = true;
}
