import BaseRepository from "@/repositories/base.repository";
import ProjectRequestModel, {
  ProjectRequestAttributes,
} from "./project_request.model";

class ProjectRequestRepository extends BaseRepository<ProjectRequestAttributes> {
  protected model: ProjectRequestModel;

  constructor() {
    super();
    this.model = new ProjectRequestModel();
  }
}

export const projectRequestRepository = new ProjectRequestRepository();

export default ProjectRequestRepository;
