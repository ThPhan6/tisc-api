import BaseRepository from "@/repositories/base.repository";
import { TrackingStatus } from "./project_tracking.model";
import ProjectTrackingNotificationModel, {
  ProjectTrackingNotificationAttributes,
  ProjectTrackingNotificationType,
} from "./project_tracking_notification.model";

class ProjectTrackingNotificationRepository extends BaseRepository<ProjectTrackingNotificationAttributes> {
  protected model: ProjectTrackingNotificationModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectTrackingNotificationAttributes> =
    {
      id: "",
      product_id: "",
      project_tracking_id: "",
      read_by: [],
      status: TrackingStatus.Pending,
      type: ProjectTrackingNotificationType.Considered,
      created_at: "",
      updated_at: "",
    };

  constructor() {
    super();
    this.model = new ProjectTrackingNotificationModel();
  }
}

export const projectTrackingNotificationRepository =
  new ProjectTrackingNotificationRepository();

export default ProjectTrackingNotificationRepository;
