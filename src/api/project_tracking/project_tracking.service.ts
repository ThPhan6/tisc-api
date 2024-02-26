import { COMMON_TYPES, MESSAGES } from "@/constants";
import { pagination } from "@/helpers/common.helper";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
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
import { ActivityTypes, logService } from "@/services/log.service";
import { commonTypeRepository } from "@/repositories/common_type.repository";

class ProjectTrackingService {
  public createProjectRequest = async (
    payload: CreateProjectRequestBody,
    userId: string,
    relationId: string,
    path: string
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
    logService.create(ActivityTypes.create_project_request, {
      path,
      user_id: userId,
      relation_id: relationId,
      data: { product_id: payload.product_id },
    });
    return successResponse({
      data: response,
    });
  };
  public createAssistanceRequest = async (
    userId: string,
    productId: string,
    projectId: string
  ) => {
    const product = await productRepository.find(productId);

    if (!product) {
      console.log("product not found");
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    const projectTracking =
      await projectTrackingRepository.findOrCreateIfNotExists(
        projectId,
        product.brand_id
      );

    const commonType = await commonTypeRepository.findBy({
      type: COMMON_TYPES.REQUEST_FOR,
      name: "Assistance request",
      relation_id: "",
    });
    if (commonType) {
      await projectRequestRepository.create({
        request_for_ids: [commonType.id],
        project_id: projectId,
        product_id: productId,
        title: "Assistance request",
        message: "This product need you to continue specify.",
        created_by: userId,
        status: RespondedOrPendingStatus.Pending,
        project_tracking_id: projectTracking.id,
      });
    }
    return true;
  };

  public async getListProjectTracking(
    getWorkspace: boolean,
    user: UserAttributes,
    limit: number,
    offset: number,
    filter: GetProjectListFilter,
    sort: GetProjectListSort = "project_name",
    order: SortOrder = "ASC"
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
