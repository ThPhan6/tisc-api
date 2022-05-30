import { MODEL_NAMES } from "../constant/common.constant";
import { IDocumentation } from "../api/documentation/documentation.type";
import Model from "./index";

export default class DocumentationModel extends Model<IDocumentation> {
  constructor() {
    super(MODEL_NAMES.DOCUMENTTATIONS);
  }
}
