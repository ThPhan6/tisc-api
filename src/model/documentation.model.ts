import { MODEL_NAMES } from "../constant/common.constant";
import { IDocumentation } from "../api/documentation/documentation.type";
import Model from "./index";

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
export default class DocumentationModel extends Model<IDocumentation> {
  constructor() {
    super(MODEL_NAMES.DOCUMENTTATIONS);
  }
}
