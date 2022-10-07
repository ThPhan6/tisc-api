import { COMMON_TYPES } from "@/constants";
import { successResponse } from "@/helper/response.helper";
import { settingService } from "../setting/setting.service";
import { CreateProjectRequestBody } from "./project_request.model";
import { projectRequestRepository } from "./project_request.repository";
import { TrackingStatus } from "./project_tracking.model";
import { projectTrackingRepository } from "./project_tracking.repository";

class ProjectTrackingService {
  public createProjectRequest = async (
    payload: CreateProjectRequestBody,
    userId: string,
    relationId: string
  ) => {
    payload.request_for_ids = await settingService.findOrCreateList(
      payload.request_for_ids,
      relationId,
      COMMON_TYPES.REQUEST_FOR
    );

    const projectTracking =
      await projectTrackingRepository.findOrCreateIfNotExists(payload);

    const response = await projectRequestRepository.create({
      ...payload,
      created_by: userId,
      status: TrackingStatus.Pending,
      project_tracking_id: projectTracking.id,
    });

    return successResponse({
      data: response,
    });
  };
}

export const projectTrackingService = new ProjectTrackingService();

export default ProjectTrackingService;
