import Model from "@/Database/Model";

import { TemplateAttributes } from "@/types";

export default class TemplateModel extends Model<TemplateAttributes> {
  protected table = "templates";
  protected softDelete = true;
}
