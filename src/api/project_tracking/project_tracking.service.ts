import { COMMON_TYPES, MESSAGES } from "@/constants";
import { pagination } from "@/helpers/common.helper";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import productRepository from "@/repositories/product.repository";
import { ActivityTypes, logService } from "@/services/log.service";
import {
  EProjectTrackingType,
  ProjectStatus,
  ProjectTrackingEntity,
  ProjectTrackingPriority,
  ProjectTrackingStage,
  RespondedOrPendingStatus,
  SortOrder,
  SummaryInfo,
  UserAttributes,
} from "@/types";
import { isNil, omit, pick } from "lodash";
import { v4 as uuid } from "uuid";
import { projectTrackingRepository } from "../../repositories/project_tracking.repository";
import { settingService } from "../setting/setting.service";
import { CreateProjectRequestBody } from "../../models/project_request.model";
import {
  GetProjectListFilter,
  GetProjectListSort,
  ProjectTrackingBrandRequest,
  ProjectTrackingCreateRequest,
} from "./project_tracking.types";
import { projectRequestRepository } from "@/repositories/project_request.repository";
import { locationService } from "../location/location.service";
import { spawn } from "child_process";

class ProjectTrackingService {
  private async createProjectRequest(
    user: UserAttributes,
    payload: CreateProjectRequestBody,
    path: string
  ) {
    payload.request_for_ids = await settingService.findOrCreateList(
      payload.request_for_ids,
      user.relation_id,
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
      created_by: user.id,
      status: RespondedOrPendingStatus.Pending,
      project_tracking_id: projectTracking.id,
    });
    logService.create(ActivityTypes.create_project_request, {
      path,
      user_id: user.id,
      relation_id: user.relation_id,
      data: { product_id: payload.product_id },
    });
    return successResponse({
      data: response,
    });
  }

  private async createBrandProject(
    payload: ProjectTrackingBrandRequest,
    user: UserAttributes,
    path: string
  ) {
    const existedProject = await projectTrackingRepository.findBy({
      project_name: payload.project_name,
    });

    if (existedProject) {
      return errorMessageResponse(MESSAGES.PROJECT_NAME_EXISTED);
    }

    const location = await locationService.get(payload.location_id);

    if (!location?.data) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND);
    }

    const GEOLocation = await locationService.getGeoLocation({
      country_id: location.data.country_id,
      city_id: payload.city_id,
      state_id: payload.state_id,
    });

    if (!GEOLocation?.data) {
      return errorMessageResponse(MESSAGES.LOCATION_NOT_FOUND);
    }

    const project = await projectTrackingRepository.create({
      ...payload,
      location_id: location.data.id,
      city_id: GEOLocation.data.city_id,
      state_id: GEOLocation.data.state_id,
      brand_id: user.relation_id,
      priority: payload?.priority ?? ProjectTrackingPriority.Non,
      type: EProjectTrackingType.BRAND,
    });

    if (!project) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    logService.create(ActivityTypes.create_brand_project, {
      path,
      user_id: user.id,
      relation_id: user.relation_id,
      data: { brand_project: project.id },
    });

    return successResponse({
      data: project,
    });
  }

  public create = async (
    user: UserAttributes,
    payload: ProjectTrackingCreateRequest,
    path: string
  ) => {
    if (payload.type === EProjectTrackingType.DESIGNER) {
      return this.createProjectRequest(
        user,
        {
          project_id: payload.project_id,
          product_id: payload.product_id,
          title: payload.title,
          message: payload.message,
          request_for_ids: payload.request_for_ids,
        },
        path
      );
    }

    if (payload.type === EProjectTrackingType.BRAND) {
      return this.createBrandProject(payload, user, path);
    }

    if (payload.type === EProjectTrackingType.PARTNER) {
    }
  };

  public async update(
    user: UserAttributes,
    payload: Partial<ProjectTrackingEntity>,
    path: string
  ) {
    const response = await projectTrackingRepository.update(
      payload.id as string,
      omit(payload, "id")
    );

    if (response === false) {
      return errorMessageResponse("Update project tracking failed.");
    }

    if (payload.assigned_teams && payload.assigned_teams[0]) {
      logService.create(ActivityTypes.assign_member_to_project_tracking, {
        path: path,
        user_id: user.id,
        relation_id: user.relation_id,
        data: {
          user_id: payload.assigned_teams[0],
          project_tracking_id: payload.id,
        },
      });
    }

    if (payload.priority) {
      logService.create(ActivityTypes.update_priority, {
        path: path,
        user_id: user.id,
        relation_id: user.relation_id,
        data: {
          priority_name: ProjectTrackingPriority[payload.priority],
          project_tracking_id: payload.id,
        },
      });
    }

    return successResponse(response);
  }

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

    let commonType = await commonTypeRepository.findBy({
      type: COMMON_TYPES.REQUEST_FOR,
      name: "Assistance request",
      relation_id: "",
    });
    if (!commonType) {
      commonType = await commonTypeRepository.findBy({
        type: COMMON_TYPES.REQUEST_FOR,
        name: "Assistance request",
        relation_id: null,
      });
    }
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

    let projectStage = undefined;
    if (filter.project_stage) {
      const types = await commonTypeRepository.getAllBy({
        type: COMMON_TYPES.PROJECT_STAGE,
      });

      projectStage = types.find(
        (el) => el.name === ProjectTrackingStage[filter.project_stage]
      )?.id;

      if (projectStage) {
        filter.project_stage = projectStage as any;
      }
    }

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

  public async get(
    user: UserAttributes,
    id: string,
    type: EProjectTrackingType
  ) {
    switch (Number(type)) {
      case EProjectTrackingType.BRAND: {
        const response = await projectTrackingRepository.find(id);

        if (!response) {
          return errorMessageResponse(MESSAGES.PROJECT_TRACKING_NOT_FOUND, 404);
        }

        return successResponse({
          data: pick(response, [
            "id",
            "project_code",
            "project_name",
            "location_id",
            "state_id",
            "city_id",
            "address",
            "postal_code",
            "project_type",
            "building_type",
            "date_of_tender",
            "date_of_delivery",
            "note",
            "design_firm",
            "project_status",
            "priority",
            "partner_id",
            "project_stage_id",
            "brand_id",
          ]),
        });
      }

      case EProjectTrackingType.PARTNER: {
        const response = await projectTrackingRepository.find(id);

        if (!response) {
          return errorMessageResponse(MESSAGES.PROJECT_TRACKING_NOT_FOUND, 404);
        }

        return successResponse({
          data: response,
        });
      }

      default:
        const response = await projectTrackingRepository.getOne(
          id,
          user.id,
          user.relation_id
        );

        if (!response.length) {
          return errorMessageResponse(MESSAGES.PROJECT_TRACKING_NOT_FOUND, 404);
        }

        await projectTrackingRepository.updateUniqueAttribute(
          "project_trackings",
          "read_by",
          id,
          user.id
        );

        return successResponse({
          data: response[0],
        });
    }
  }

  public async getProjectTrackingSummary(
    user: UserAttributes,
    workspace: boolean
  ) {
    const response = await projectTrackingRepository.getSummary(
      user.relation_id,
      workspace ? user.id : undefined
    );
    const summary = response[0];

    if (!summary) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    const mappingSummary: SummaryInfo[] = [
      {
        id: uuid(),
        label: "PROJECTS",
        quantity: summary.project.total,
        subs: [
          {
            id: uuid(),
            label: "Live",
            quantity: summary.project.live,
          },
          {
            id: uuid(),
            label: "On Hold",
            quantity: summary.project.onHold,
          },
          {
            id: uuid(),
            label: "Archived",
            quantity: summary.project.archived,
          },
        ],
      },
      {
        id: uuid(),
        label: "REQUESTS",
        quantity: summary.request.total,
        subs: [
          {
            id: uuid(),
            label: "Pending",
            quantity: summary.request.pending,
          },
          {
            id: uuid(),
            label: "Responded",
            quantity: summary.request.responded,
          },
        ],
      },
      {
        id: uuid(),
        label: "NOTIFICATIONS",
        quantity: summary.notification.total,
        subs: [
          {
            id: uuid(),
            label: "Keep-in-view",
            quantity: summary.notification.keepInView,
          },
          {
            id: uuid(),
            label: "Followed-up",
            quantity: summary.notification.followedUp,
          },
        ],
      },
    ];

    return successResponse({
      data: mappingSummary,
    });
  }
}

export const projectTrackingService = new ProjectTrackingService();

export default ProjectTrackingService;
