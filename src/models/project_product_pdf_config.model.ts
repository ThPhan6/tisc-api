import Model from "@/Database/Model";

import { ProjectProductPDFConfigAttribute } from "@/types";

export default class ProjectProductPDFConfigModel extends Model<ProjectProductPDFConfigAttribute> {
  protected table = "project_product_pdf_configs";
  protected softDelete = true;
}
