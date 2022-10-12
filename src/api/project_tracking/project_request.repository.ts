import BaseRepository from "@/repositories/base.repository";
import ProjectRequestModel, {
  ProjectRequestAttributes,
  ProjectRequestStatus,
} from "./project_request.model";

class ProjectRequestRepository extends BaseRepository<ProjectRequestAttributes> {
  protected model: ProjectRequestModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectRequestAttributes> = {
    id: "",
    message: "",
    product_id: "",
    project_id: "",
    read_by: [],
    request_for_ids: [],
    project_tracking_id: "",
    status: ProjectRequestStatus.Pending,
    title: "",
    created_at: "",
    updated_at: "",
    created_by: "",
  };

  constructor() {
    super();
    this.model = new ProjectRequestModel();
  }
}

export const projectRequestRepository = new ProjectRequestRepository();

export default ProjectRequestRepository;
