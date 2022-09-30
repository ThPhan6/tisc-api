import BaseRepository from "@/repositories/base.repository";
import ProjectModel, { ProjectAttributes } from "./project.model";

class ProjectRepository extends BaseRepository<ProjectAttributes> {
  protected model: ProjectModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectAttributes> = {
    id: "",
    code: "",
    name: "",
    location: "",
    country_id: "",
    state_id: "",
    city_id: "",
    country_name: "",
    state_name: "",
    city_name: "",
    address: "",
    phone_code: "",
    postal_code: "",
    project_type_id: "",
    project_type: "",
    building_type_id: "",
    building_type: "",
    measurement_unit: 1,
    design_due: "",
    construction_start: "",
    team_profile_ids: [],

    product_ids: [],

    design_id: "",
    status: 0,
    created_at: "",
    is_deleted: false,
  };

  constructor() {
    super();
    this.model = new ProjectModel();
  }
}

export const projectRepository = new ProjectRepository();

export default ProjectRepository;
