import { COMMON_TYPES, MESSAGES } from "@/constants";
import { pagination } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import productRepository from "@/repositories/product.repository";
import { settingService } from "../setting/setting.service";
import {
  ProjectStatus,
  RespondedOrPendingStatus,
  SortOrder,
  UserAttributes,
} from "@/types";
import { CreateProjectRequestBody } from "./project_request.model";
import { projectRequestRepository } from "./project_request.repository";
import { ProjectTrackingPriority } from "./project_tracking.model";
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

    const product = await productRepository.find(payload.product_id);

    if (!product) {
      console.log("product not found");
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    const projectTracking =
      await projectTrackingRepository.findOrCreateIfNotExists(
        payload.project_id,
        product.brand_id
      );

    const response = await projectRequestRepository.create({
      ...payload,
      created_by: userId,
      status: RespondedOrPendingStatus.Pending,
      project_tracking_id: projectTracking.id,
    });

    return successResponse({
      data: response,
    });
  };

  public async getListProjectTracking(
    getWorkspace: boolean,
    user: UserAttributes,
    limit: number,
    offset: number,
    filter: GetProjectListFilter,
    sort: GetProjectListSort = "created_at",
    order: SortOrder = "DESC"
  ) {
    const filterId = getWorkspace ? user.id : undefined;
    const projectTrackings =
      await projectTrackingRepository.getListProjectTracking(
        user.relation_id,
        limit,
        offset,
        filter,
        sort,
        order,
        filterId
      );

    const results = projectTrackings.map((el) => ({
      id: el.project_tracking.id,
      created_at: el.project_tracking.created_at,
      priority: el.project_tracking.priority,
      priorityName: ProjectTrackingPriority[el.project_tracking.priority],
      projectName: el.project.name,
      projectLocation: el.projectLocation,
      projectType: el.project.project_type,
      designFirm: el.designFirm?.name,
      projectStatus: ProjectStatus[el.project.status],
      requestCount: el.projectRequests.length,
      newRequest: el.projectRequests.some((item) =>
        item.read_by ? item.read_by.includes(user.id) === false : true
      ),
      notificationCount: el.notifications.length,
      newNotification: el.notifications.some((item) =>
        item.read_by ? item.read_by.includes(user.id) === false : true
      ),
      newTracking: el.project_tracking.read_by
        ? el.project_tracking.read_by.includes(user.id) === false
        : true,
      assignedTeams: el.members,
    }));

    const total = getWorkspace
      ? null
      : await projectTrackingRepository.getListProjectTrackingTotal(
          user.relation_id,
          filter
        );
    return successResponse({
      data: {
        projectTrackings: results,
        pagination:
          typeof total?.[0] === "number"
            ? pagination(limit, offset, total[0])
            : undefined,
      },
    });
  }
}

export const projectTrackingService = new ProjectTrackingService();

export default ProjectTrackingService;
