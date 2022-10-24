import ProjectProductPDFConfigModel from "@/model/project_product_pdf_config.model";
import {
  ProjectProductPDFConfigAttribute,
  ProjectProductPDFConfigWithLocationAndType,
} from "@/types";
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

  public updateByProjectId = (
    projectId: string,
    payload: Partial<ProjectProductPDFConfigAttribute>
  ) => {
    return this.model
      .where('project_id', '==', projectId)
      .update(payload);
  }

  public findWithInfoByProjectId = async (projectId: string) => {
    return await this.model.where('project_product_pdf_configs.project_id', '==', projectId)
    .join('locations', 'locations.id', '==', 'project_product_pdf_configs.location_id')
    .join('common_types', 'common_types.id', '==', 'project_product_pdf_configs.issuing_for_id')
    .first(true) as ProjectProductPDFConfigWithLocationAndType | undefined;
  }


}

export default ProjectProductPDFConfigRepository;
export const projectProductPDFConfigRepository = new ProjectProductPDFConfigRepository();
