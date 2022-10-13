import { COMMON_TYPES, MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { actionTaskRepository } from "@/repositories/action_task.repository";
import { generalInquiryRepository } from "@/repositories/general_inquiry.repository";
import { projectRepository } from "@/repositories/project.repository";
import { RespondedOrPendingStatus, UserAttributes } from "@/types";
import {
  ActionTaskModelEnum,
  ActionTaskModelKey,
  ActionTaskStatus,
} from "@/types/action_task.type";
import { ProjectTrackingNotificationStatus } from "../project_tracking/project_tracking_notification.model";
import { settingService } from "../setting/setting.service";
import { projectTrackingRepository } from "./../project_tracking/project_tracking.repository";
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
    let createdActionTask;
    for (const commonTypeId of payload.common_type_ids) {
      createdActionTask = await actionTaskRepository.create({
        model_name: ActionTaskModelEnum[payload.model_name],
        model_id: payload.model_id,
        status: ActionTaskStatus["To-Do-List"],
        common_type_id: commonTypeId,
        created_by: user.id,
      });
    }

    if (!createdActionTask) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }

    //update status when has assign tasks
    switch (ActionTaskModelEnum[payload.model_name]) {
      case ActionTaskModelEnum.notification:
        await projectTrackingNotificationRepository.update(payload.model_id, {
          status: ProjectTrackingNotificationStatus["Followed-up"],
        });
        break;

      case ActionTaskModelEnum.request:
        await projectRepository.update(payload.model_id, {
          status: RespondedOrPendingStatus.Responded,
        });
        break;

      case ActionTaskModelEnum.inquiry:
        await generalInquiryRepository.update(payload.model_id, {
          status: RespondedOrPendingStatus.Responded,
        });
        break;

      default:
        break;
    }

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async getList(
    userId: string,
    modelId: string,
    modelName: ActionTaskModelKey
  ) {
    //update user read notification or request

    if (ActionTaskModelEnum[modelName] !== ActionTaskModelEnum.inquiry) {
      await projectTrackingRepository.updateUniqueAttribute(
        ActionTaskModelEnum[modelName],
        "read_by",
        modelId,
        userId
      );
    }

    const result = await actionTaskRepository.getListActionTask(
      ActionTaskModelEnum[modelName],
      modelId
    );

    return successResponse({
      data: result,
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
