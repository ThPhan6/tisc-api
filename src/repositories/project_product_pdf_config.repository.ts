import ProjectProductPDFConfigModel from "@/model/project_product_pdf_config.model";
import { ProjectProductPDFConfigAttribute } from "@/types";
import BaseRepository from "./base.repository";

class ProjectProductPDFConfigRepository extends BaseRepository<ProjectProductPDFConfigAttribute> {
  protected model: ProjectProductPDFConfigModel;
  protected DEFAULT_ATTRIBUTE: Partial<ProjectProductPDFConfigAttribute> = {
    id: "",
    project_id: "",
    location_id: "",
    issuing_for_id: "",
    issuing_date: "",
    revision: "",
    has_cover: false,
    document_title: "",
    template_ids: [],
  }

  constructor() {
    super();
    this.model = new ProjectProductPDFConfigModel();
  }

}

export default ProjectProductPDFConfigRepository;
export const projectProductPDFConfigRepository = new ProjectProductPDFConfigRepository();
