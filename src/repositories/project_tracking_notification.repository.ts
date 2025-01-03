import BaseRepository from "@/repositories/base.repository";
import ProjectTrackingNotificationModel, {
  ProjectTrackingNotificationAttributes,
  ProjectTrackingNotificationStatus,
  ProjectTrackingNotificationType,
} from "../models/project_tracking_notification.model";

class ProjectTrackingNotificationRepository extends BaseRepository<ProjectTrackingNotificationAttributes> {
  protected model: ProjectTrackingNotificationModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectTrackingNotificationAttributes> =
    {
      id: "",
      project_product_id: "",
      project_tracking_id: "",

      read_by: [],
      status: ProjectTrackingNotificationStatus["Keep-in-view"],
      type: ProjectTrackingNotificationType.Considered,

      created_by: "",

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
