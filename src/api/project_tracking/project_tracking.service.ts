import { COMMON_TYPES } from "@/constants";
import { pagination } from "@/helper/common.helper";
import { successResponse } from "@/helper/response.helper";
import { ProjectStatus, SortOrder, UserAttributes } from "@/types";
import { settingService } from "../setting/setting.service";
import { CreateProjectRequestBody } from "./project_request.model";
import { projectRequestRepository } from "./project_request.repository";
import {
  ProjectTrackingPriority,
  TrackingStatus,
} from "./project_tracking.model";
import { projectTrackingRepository } from "./project_tracking.repository";
import {
  GetProjectListFilter,
  GetProjectListSort,
} from "./project_tracking.types";

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

  public async getListProjectTracking(
    user: UserAttributes,
    limit: number,
    offset: number,
    filter: GetProjectListFilter,
    sort: GetProjectListSort = "created_at",
    order: SortOrder = "DESC"
  ) {
    const projectTrackings =
      await projectTrackingRepository.getListProjectTracking(
        user.relation_id,
        limit,
        offset,
        filter,
        sort,
        order
      );

    const results = projectTrackings.map((el, index) => ({
      id: el.project_tracking.id,
      created_at: el.project_tracking.created_at,
      priority: el.project_tracking.priority,
      priorityName: ProjectTrackingPriority[el.project_tracking.priority],
      projectName: el.project.name,
      projectLocation: el.project.location,
      projectType: el.project.project_type,
      designFirm: el.designFirm.name,
      projectStatus: ProjectStatus[el.project.status],
      requestCount: el.projectRequests.length,
      newRequest: el.projectRequests.some((el) =>
        el.read_by ? el.read_by.includes(user.id) === false : true
      ),
      notificationCount: 0,
      newNotification: index % 2 ? true : false,
      newTracking: el.project_tracking.read_by
        ? el.project_tracking.read_by.includes(user.id) === false
        : true,
      assignedTeams: el.members,
    }));

    return successResponse({
      data: {
        projectTrackings: results,
        pagination: pagination(limit, offset, projectTrackings.length),
      },
    });
  }
}

export const projectTrackingService = new ProjectTrackingService();

export default ProjectTrackingService;
