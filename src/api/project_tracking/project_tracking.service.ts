import { COMMON_TYPES, MESSAGES } from "@/constants";
import { pagination } from "@/helpers/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import productRepository from "@/repositories/product.repository";
import { projectRequestRepository } from "@/repositories/project_request.repository";
import { ActivityTypes, logService } from "@/services/log.service";
import {
  CommonTypeAttributes,
  EProjectTrackingType,
  ProjectStatus,
  ProjectTrackingPriority,
  ProjectTrackingStage,
  RespondedOrPendingStatus,
  SortOrder,
  SummaryInfo,
  UserAttributes,
} from "@/types";
import { isEmpty, isNil, omit, pick } from "lodash";
import { v4 as uuid } from "uuid";
import { CreateProjectRequestBody } from "../../models/project_request.model";
import { projectTrackingRepository } from "../../repositories/project_tracking.repository";
import { locationService } from "../location/location.service";
import { settingService } from "../setting/setting.service";
import {
  GetProjectListFilter,
  GetProjectListSort,
  ProjectTrackingBrandRequest,
  ProjectTrackingCreateRequest,
  ProjectTrackingListResponse,
} from "./project_tracking.types";

class ProjectTrackingService {
  private async getProjectInfo(
    user: UserAttributes,
    payload: Partial<
      Pick<
        ProjectTrackingCreateRequest,
        "project_stage_id" | "project_type_id" | "building_type_id"
      >
    >
  ) {
    let projectStage = null;
    if (!isEmpty(payload.project_stage_id)) {
      projectStage = await commonTypeRepository.find(
        payload.project_stage_id as string
      );
    }

    let projectType: CommonTypeAttributes | null = null;
    if (!isEmpty(payload.project_type_id)) {
      const existedProjectType = await commonTypeRepository.find(
        payload.project_type_id as string
      );

      if (!existedProjectType) {
        const newProjectType = await commonTypeRepository.findOrCreate(
          payload.project_type_id as string,
          user.relation_id,
          COMMON_TYPES.PROJECT_TYPE
        );

        if (newProjectType) {
          projectType = newProjectType;
        }
      } else {
        projectType = existedProjectType;
      }
    }

    let projectBuilding: CommonTypeAttributes | null = null;
    if (!isEmpty(payload.building_type_id)) {
      const existedProjectBuilding = await commonTypeRepository.find(
        payload.building_type_id as string
      );

      if (!existedProjectBuilding) {
        const newProjectBuilding = await commonTypeRepository.findOrCreate(
          payload.building_type_id as string,
          user.relation_id,
          COMMON_TYPES.PROJECT_BUILDING
        );

        if (newProjectBuilding) {
          projectBuilding = newProjectBuilding;
        }
      } else {
        projectBuilding = existedProjectBuilding;
      }
    }

    return {
      projectType,
      projectBuilding,
      projectStage: projectStage ?? null,
    };
  }

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

  private async updateProjectRequest(
    user: UserAttributes,
    payload: Partial<ProjectTrackingCreateRequest>,
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

    const projectInfo = await this.getProjectInfo(user, payload);
    const { projectBuilding, projectStage, projectType } = projectInfo;

    const project = await projectTrackingRepository.create({
      address: payload.address ?? "",
      note: payload.note ?? "",
      postal_code: payload.postal_code ?? "",
      project_code: payload.project_code ?? "",
      project_name: payload.project_name,
      partner_id: payload.partner_id ?? "",
      design_firm: payload.design_firm ?? "",
      date_of_delivery: payload.date_of_delivery ?? "",
      date_of_tender: payload.date_of_tender ?? "",
      location_id: location.data.id,
      city_id: GEOLocation.data.city_id,
      state_id: GEOLocation.data.state_id,
      brand_id: user.relation_id,
      project_stage_id: projectStage?.id ?? "",
      project_type_id: projectType?.id ?? "",
      building_type_id: projectBuilding?.id ?? "",
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
      data: { project_id: project.id },
    });

    return successResponse({
      data: pick(project, [
        "id",
        "project_code",
        "project_name",
        "location_id",
        "state_id",
        "city_id",
        "address",
        "postal_code",
        "project_type_id",
        "building_type_id",
        "project_stage_id",
        "date_of_tender",
        "date_of_delivery",
        "note",
        "design_firm",
        "project_status",
        "priority",
        "partner_id",
        "brand_id",
        "type",
      ]),
    });
  }

  private async updateBrandProject(
    payload: Partial<ProjectTrackingBrandRequest> & { id: string },
    user: UserAttributes,
    path: string
  ) {
    const existedProject = await projectTrackingRepository.find(
      payload.id as string
    );

    if (!existedProject) {
      return errorMessageResponse(MESSAGES.PROJECT_TRACKING_NOT_FOUND);
    }

    if (payload.project_name !== undefined) {
      const existedProject = await projectTrackingRepository.findBy({
        project_name: payload.project_name,
      });

      if (existedProject) {
        return errorMessageResponse(MESSAGES.PROJECT_NAME_EXISTED);
      }
    }

    const newPayload = pick({ ...existedProject, ...payload }, [
      "project_code",
      "project_name",
      "location_id",
      "city_id",
      "state_id",
      "address",
      "postal_code",
      "project_type_id",
      "building_type_id",
      "project_stage_id",
      "date_of_tender",
      "date_of_delivery",
      "note",
      "design_firm",
      "project_status",
      "priority",
      "partner_id",
    ]);

    if (
      payload.location_id !== undefined ||
      payload.city_id !== undefined ||
      payload.state_id !== undefined
    ) {
      if (payload.location_id === undefined) {
        return errorMessageResponse(MESSAGES.LOCATION_REQUIRED);
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

      newPayload.location_id = location.data.id;
      newPayload.city_id = GEOLocation.data.city_id;
      newPayload.state_id = GEOLocation.data.state_id;
    }

    if (
      !isNil(payload.project_stage_id) ||
      !isNil(payload.project_type_id) ||
      !isNil(payload.building_type_id)
    ) {
      const projectInfo = await this.getProjectInfo(user, payload);

      if (!isNil(payload.project_stage_id)) {
        newPayload.project_stage_id = projectInfo.projectStage?.id ?? "";
      }

      if (!isNil(payload.project_type_id)) {
        newPayload.project_type_id = projectInfo.projectType?.id ?? "";
      }

      if (!isNil(payload.building_type_id)) {
        newPayload.building_type_id = projectInfo.projectBuilding?.id ?? "";
      }
    }

    const project = await projectTrackingRepository.update(
      payload.id,
      newPayload
    );

    if (!project) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    logService.create(ActivityTypes.update_brand_project, {
      path,
      user_id: user.id,
      relation_id: user.relation_id,
      data: { project_id: project.id },
    });

    return successResponse({
      data: pick(project, [
        "id",
        "project_code",
        "project_name",
        "location_id",
        "state_id",
        "city_id",
        "address",
        "postal_code",
        "project_type_id",
        "building_type_id",
        "project_stage_id",
        "date_of_tender",
        "date_of_delivery",
        "note",
        "design_firm",
        "project_status",
        "priority",
        "partner_id",
        "brand_id",
        "type",
      ]),
    });
  }

  private async getListDesignerProject(
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

  private async getListBrandProject(
    user: UserAttributes,
    limit: number,
    offset: number,
    filter: GetProjectListFilter,
    sort: GetProjectListSort = "project_name",
    order: SortOrder = "ASC"
  ) {
    const projects =
      await projectTrackingRepository.getListBrandProjectTracking(
        user.relation_id,
        limit,
        offset,
        filter,
        sort,
        order
      );

    const total =
      await projectTrackingRepository.getListBrandProjectTrackingTotal(
        user.relation_id,
        filter
      );

    return successResponse({
      data: {
        projectTrackings: projects,
        pagination:
          typeof total?.[0] === "number"
            ? pagination(limit, offset, total[0])
            : undefined,
      },
    });
  }

  public create = async (
    user: UserAttributes,
    payload: ProjectTrackingCreateRequest,
    path: string
  ) => {
    switch (payload.type) {
      case EProjectTrackingType.BRAND:
        return this.createBrandProject(payload, user, path);
      case EProjectTrackingType.PARTNER:
        return this.createBrandProject(payload, user, path);
      default:
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
  };

  public async update(
    user: UserAttributes,
    payload: Partial<ProjectTrackingCreateRequest>,
    path: string
  ) {
    switch (payload.type) {
      case EProjectTrackingType.BRAND:
        return this.updateBrandProject(payload as any, user, path);
      case EProjectTrackingType.PARTNER:
        return this.updateBrandProject(payload as any, user, path);
      default:
        return this.updateProjectRequest(
          user,
          {
            priority: payload.priority,
            assigned_teams: payload.assigned_teams,
            read_by: payload.read_by,
          },
          path
        );
    }
  }

  public async delete(user: UserAttributes, id: string, path: string) {
    const existedProject = await projectTrackingRepository.find(id);

    if (!existedProject) {
      return errorMessageResponse(MESSAGES.PROJECT_TRACKING_NOT_FOUND);
    }

    switch (existedProject.type) {
      case EProjectTrackingType.BRAND: {
        logService.create(ActivityTypes.delete_brand_project, {
          path: path,
          user_id: user.id,
          relation_id: user.relation_id,
          data: {
            project_id: existedProject.id,
          },
        });

        const deletedProject = await projectTrackingRepository.delete(id);

        if (!deletedProject) {
          return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
        }

        return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
      }
      default:
        return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
    }
  }

  public createAssistanceRequest = async (
    userId: string,
    productId: string,
    projectId: string
  ) => {
    const product = await productRepository.find(productId);

    if (!product) {
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

  public async getList(
    getWorkspace: boolean,
    user: UserAttributes,
    limit: number,
    offset: number,
    filter: GetProjectListFilter,
    sort: GetProjectListSort = "project_name",
    order: SortOrder = "ASC"
  ) {
    switch (Number(filter.type)) {
      case EProjectTrackingType.BRAND:
        return this.getListBrandProject(
          user,
          limit,
          offset,
          filter,
          sort,
          order
        );
      case EProjectTrackingType.PARTNER:
        return this.getListBrandProject(
          user,
          limit,
          offset,
          filter,
          sort,
          order
        );
      default:
        return this.getListDesignerProject(
          getWorkspace,
          user,
          limit,
          offset,
          filter,
          sort,
          order
        );
    }
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
            "project_type_id",
            "building_type_id",
            "project_stage_id",
            "date_of_tender",
            "date_of_delivery",
            "note",
            "design_firm",
            "project_status",
            "priority",
            "partner_id",
            "brand_id",
            "type",
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
