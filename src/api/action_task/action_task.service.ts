import { ActionTaskStatus } from "./../../types/action_task.type";
import { COMMON_TYPES, MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from "@/helper/response.helper";
import { actionTaskRepository } from "@/repositories/action_task.repository";
import { generalInquiryRepository } from "@/repositories/general_inquiry.repository";
import { projectRepository } from "@/repositories/project.repository";
import { RespondedOrPendingStatus, UserAttributes } from "@/types";
import { ActionTaskModel } from "@/types/action_task.type";
import { ProjectTrackingNotificationStatus } from "../project_tracking/project_tracking_notification.model";
import { settingService } from "../setting/setting.service";
import { projectTrackingNotificationRepository } from "./../project_tracking/project_tracking_notification.repository copy";
import {
  ActionTaskRequestCreate,
  ActionTaskRequestUpdateStatus,
} from "./action_task.type";

class ActionTaskService {
  public async create(user: UserAttributes, payload: ActionTaskRequestCreate) {
    // insert into common_types
    payload.common_type_ids = await settingService.findOrCreateList(
      payload.common_type_ids,
      user.relation_id,
      COMMON_TYPES.ACTION_TASK
    );

    //insert into actions_tasks
    const createdActionTask = await actionTaskRepository.create({
      ...payload,
      model_name: payload.model_name,
      model_id: payload.model_id,
      status: ActionTaskStatus.To_do_list,
      common_type_ids: payload.common_type_ids,
      created_by: user.id,
    });

    if (!createdActionTask) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }

    switch (payload.model_name) {
      case ActionTaskModel.notification:
        await projectTrackingNotificationRepository.update(payload.model_id, {
          status: ProjectTrackingNotificationStatus["Followed-up"],
        });
        break;
      case ActionTaskModel.request:
        await projectRepository.update(payload.model_id, {
          status: RespondedOrPendingStatus.Responded,
        });
        break;
      case ActionTaskModel.inquiry:
        await generalInquiryRepository.update(payload.model_id, {
          status: RespondedOrPendingStatus.Responded,
        });
        break;
      default:
        break;
    }

    return successResponse({
      data: createdActionTask,
    });
  }

  public async update(id: string, payload: ActionTaskRequestUpdateStatus) {
    const updatedStatus = await actionTaskRepository.findAndUpdate(id, {
      status: payload.status,
    });

    if (!updatedStatus) {
      return errorMessageResponse(MESSAGES.ACTION_TASK.NOT_FOUND, 404);
    }

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
}
export const actionTaskService = new ActionTaskService();
export default ActionTaskService;
