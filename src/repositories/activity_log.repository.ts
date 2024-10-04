import ActivityLogModel, {
  ActivityLogAttributes,
} from "@/models/activity_log.model";
import BaseRepository from "./base.repository";

class ActivityLogRepository extends BaseRepository<ActivityLogAttributes> {
  protected model: ActivityLogModel;
  protected DEFAULT_ATTRIBUTE: Partial<ActivityLogAttributes> = {
    id: "",
    user_id: "",
    path: "",
    method: "",
    input: {},
    created_at: "",
  };

  constructor() {
    super();
    this.model = new ActivityLogModel();
  }
}

export default ActivityLogRepository;
export const activityLogRepository = new ActivityLogRepository();
