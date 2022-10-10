import BaseRepository from "@/repositories/base.repository";
import ProjectTrackingNotificationModel, {
  ProjectTrackingNotificationAttributes,
} from "./project_tracking_notification.model";

class ProjectTrackingNotificationRepository extends BaseRepository<ProjectTrackingNotificationAttributes> {
  protected model: ProjectTrackingNotificationModel;

  constructor() {
    super();
    this.model = new ProjectTrackingNotificationModel();
  }
}

export const projectTrackingNotificationRepository =
  new ProjectTrackingNotificationRepository();

export default ProjectTrackingNotificationRepository;
