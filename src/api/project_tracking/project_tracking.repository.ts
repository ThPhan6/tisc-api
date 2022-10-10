import BaseRepository from "@/repositories/base.repository";
import { v4 } from "uuid";
import { CreateProjectRequestBody } from "./project_request.model";
import ProjectTrackingModel, {
  ProjectTrackingAttributes,
} from "./project_tracking.model";

class ProjectTrackingRepository extends BaseRepository<ProjectTrackingAttributes> {
  protected model: ProjectTrackingModel;

  constructor() {
    super();
    this.model = new ProjectTrackingModel();
  }

  public async findOrCreateIfNotExists(
    payload: CreateProjectRequestBody
  ): Promise<ProjectTrackingAttributes> {
    const now = new Date();
    return this.model.rawQueryV2(
      `UPSERT {project_id: @project_id}
      INSERT @payloadWithId
      UPDATE {}
      IN project_trackings
      RETURN { doc: NEW }
    `,
      {
        project_id: payload.project_id,
        payloadWithId: {
          ...payload,
          id: v4(),
          created_at: now,
          updated_at: now,
        },
      }
    );
  }
}

export const projectTrackingRepository = new ProjectTrackingRepository();

export default ProjectTrackingRepository;
