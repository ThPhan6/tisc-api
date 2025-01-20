import { activityLogRepository } from "@/repositories/activity_log.repository";
import { Request } from "@hapi/hapi";

const LOG_METHODS = ["put", "patch", "post", "delete"];
class ActivityLogService {
  constructor() {}
  public createActivityLog = async (request: Request, userId: string) => {
    if (LOG_METHODS.includes(request.method)) {
      let savedInput: any = request.payload;
      if (request.path.indexOf("login") !== -1) {
        savedInput = {
          ...savedInput,
          password: "",
        };
      }
      const data = {
        user_id: userId,
        path: request.path,
        method: request.method,
        input: savedInput,
      };
      await activityLogRepository.create(data);
    }
  };
}

export const activityLogService = new ActivityLogService();
