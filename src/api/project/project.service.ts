import { ALL_REGIONS, COMMON_TYPES, MESSAGES } from "@/constants";
import { objectDiff, pagination } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { designerRepository } from "@/repositories/designer.repository";
import { locationRepository } from "@/repositories/location.repository";
import { projectRepository } from "@/repositories/project.repository";
import { countryStateCityService } from "@/service/country_state_city.service";
import { ActivityTypes, logService } from "@/service/log.service";
import {
  ICountryStateCity,
  ProjectStatus,
  SortOrder,
  SummaryInfo,
  UserAttributes,
  UserType,
} from "@/types";
import { isEqual, isNumber, pick, sumBy, uniq, difference } from "lodash";
import { v4 } from "uuid";
import { mappingProjectGroupByStatus } from "./project.mapping";
import { CreateProjectRequest } from "./project.type";

class ProjectService {
  public async create(
    user: UserAttributes,
    payload: CreateProjectRequest,
    path: string
  ) {
    if (user.type !== UserType.Designer) {
      return errorMessageResponse(MESSAGES.JUST_DESIGNER_CAN_CREATE);
    }

    const project = await projectRepository.findBy({
      code: payload.code,
      design_id: user.relation_id,
    });

    if (project) {
      return errorMessageResponse(MESSAGES.PROJECT_EXISTED);
    }

    const projectType = await commonTypeRepository.findOrCreate(
      payload.project_type_id,
      user.relation_id,
      COMMON_TYPES.PROJECT_TYPE
    );

    const buildingType = await commonTypeRepository.findOrCreate(
      payload.building_type_id,
      user.relation_id,
      COMMON_TYPES.PROJECT_BUILDING
    );

    const isValidGeoLocation =
      await countryStateCityService.validateLocationData(
        payload.country_id,
        payload.city_id,
        payload.state_id
      );

    if (isValidGeoLocation !== true) {
      return isValidGeoLocation;
    }

    const countryStateCity = await countryStateCityService.getCountryStateCity(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

    if (!countryStateCity) {
      return errorMessageResponse(
        MESSAGES.COUNTRY_STATE_CITY.COUNTRY_STATE_CITY_NOT_FOUND
      );
    }

    const locationInfo = {
      country_id: countryStateCity.country_id,
      state_id: countryStateCity.state_id,
      city_id: countryStateCity.city_id,
      country_name: countryStateCity.country_name,
      state_name: countryStateCity.state_name,
      city_name: countryStateCity.city_name,
      phone_code: countryStateCity.phone_code,
      address: payload.address,
      postal_code: payload.postal_code,
    };
    const location = await locationRepository.create(locationInfo);

    if (!location) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    const createdProject = await projectRepository.create({
      code: payload.code,
      name: payload.name,
      location_id: location.id,
      ...locationInfo, // Remove this when the location refactor official run
      project_type: projectType.name,
      project_type_id: projectType.id,
      building_type: buildingType.name,
      building_type_id: buildingType.id,
      measurement_unit: payload.measurement_unit,
      design_due: payload.design_due,
      construction_start: payload.construction_start,
      design_id: user.relation_id || "",
      status: payload.status,
    });

    if (!createdProject) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    logService.create(ActivityTypes.create_project, {
      path,
      user_id: user.id,
      relation_id: user.relation_id,
      data: { project_id: createdProject.id },
    });
    return successResponse({
      data: createdProject,
    });
  }

  public async getProject(id: string) {
    const project = await projectRepository.getProjectWithLocation(id);

    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }
    // const { location, ...data } = project;

    return successResponse({
      data: project,
    });
  }

  public async getProjects(
    getWorkspace: boolean,
    user: UserAttributes,
    limit: number,
    offset: number,
    filter: any,
    sort: string,
    order: SortOrder
  ) {
    await projectRepository.syncProjectLocations();

    const filterId = getWorkspace ? user.id : undefined;

    const projects = await projectRepository.getListProject(
      user.relation_id,
      limit,
      offset,
      sort,
      order,
      filter,
      filterId
    );

    const totalProject = getWorkspace
      ? null
      : await projectRepository.countProjectBy(user.relation_id, filter);

    return successResponse({
      data: {
        projects,
        pagination: isNumber(totalProject)
          ? pagination(limit, offset, totalProject)
          : undefined,
      },
    });
  }

  public async getAll(user: UserAttributes) {
    const projects = await projectRepository.getActiveProjectsByDesignFirm(
      user.relation_id,
      ProjectStatus.Live,
      ["id", "code", "name"],
      user.id
    );

    return successResponse({
      data: projects,
    });
  }

  public async update(
    id: string,
    user: UserAttributes,
    payload: CreateProjectRequest,
    path: string
  ) {
    const project = await projectRepository.getProjectWithLocation(id);

    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    if (
      user.type !== UserType.Designer ||
      project.design_id !== user.relation_id
    ) {
      return errorMessageResponse(MESSAGES.GENERAL.NOT_AUTHORIZED_TO_PERFORM);
    }

    const projectExisted = await projectRepository.getProjectExist(
      id,
      payload.code,
      user.relation_id
    );

    if (projectExisted) {
      return errorMessageResponse(MESSAGES.PROJECT_EXISTED);
    }

    const projectType = isEqual(
      project.project_type_id,
      payload.project_type_id
    )
      ? { name: project.project_type, id: project.project_type_id }
      : await commonTypeRepository.findOrCreate(
          payload.project_type_id,
          user.relation_id,
          COMMON_TYPES.PROJECT_TYPE
        );

    const buildingType = isEqual(
      project.building_type_id,
      payload.building_type_id
    )
      ? { name: project.building_type, id: project.building_type_id }
      : await commonTypeRepository.findOrCreate(
          payload.building_type_id,
          user.relation_id,
          COMMON_TYPES.PROJECT_BUILDING
        );

    const locationHaveUpdated =
      isEqual(
        pick(payload, ["country_id", "state_id", "city_id"]),
        pick(project, ["country_id", "state_id", "city_id"])
      ) === false;

    const { country_id, city_id, state_id, ...customPayload } = payload;
    let locationInfo: Partial<
      ICountryStateCity & { address: string; postal_code: string }
    > = {};

    if (locationHaveUpdated) {
      const isValidGeoLocation =
        await countryStateCityService.validateLocationData(
          country_id,
          city_id,
          state_id
        );

      if (isValidGeoLocation !== true) {
        return isValidGeoLocation;
      }

      const projectLocation = await countryStateCityService.getCountryStateCity(
        country_id,
        city_id,
        state_id
      );

      locationInfo = {
        ...projectLocation,
        address: payload.address,
        postal_code: payload.postal_code,
      };

      const updatedLocation = await locationRepository.findAndUpdate(
        project.location_id,
        locationInfo
      );

      if (!updatedLocation) {
        return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
      }
    }

    const updatedProject = await projectRepository.update(id, {
      ...customPayload,
      ...locationInfo, // Remove this when the location refactor official run
      project_type: projectType.name,
      project_type_id: projectType.id,
      building_type: buildingType.name,
      building_type_id: buildingType.id,
      team_profile_ids: payload.team_profile_ids
        ? uniq(payload.team_profile_ids)
        : undefined,
    });

    if (!updatedProject) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }
    const diff = objectDiff(project, payload);
    logService.create(ActivityTypes.update_project, {
      path,
      user_id: user.id,
      relation_id: user.relation_id,
      data: { project_id: project.id },
      ...diff,
    });
    return successResponse({
      data: updatedProject,
    });
  }

  public partialUpdate = async (
    id: string,
    payload: Partial<CreateProjectRequest>,
    user: UserAttributes,
    path: string
  ) => {
    const project = await projectRepository.find(id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }
    const updatedProject = await projectRepository.update(id, {
      ...payload,
      team_profile_ids: payload.team_profile_ids
        ? uniq(payload.team_profile_ids)
        : undefined,
    });

    if (!updatedProject) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }
    logService.create(ActivityTypes.assign_member_to_project, {
      path,
      user_id: user.id,
      relation_id: user.relation_id,
      data: { user_id: user.id, project_id: project.id },
    });
    return successResponse({
      data: updatedProject,
    });
  };

  public async delete(id: string, user: UserAttributes, path: string) {
    const project = await projectRepository.find(id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    if (
      user.type !== UserType.Designer ||
      project.design_id !== user.relation_id
    ) {
      return errorMessageResponse(MESSAGES.GENERAL.NOT_AUTHORIZED_TO_PERFORM);
    }

    const deletedProject = await projectRepository.delete(id);

    if (!deletedProject) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }
    logService.create(ActivityTypes.delete_project, {
      path,
      user_id: user.id,
      relation_id: user.relation_id,
      data: { project_id: project.id },
    });
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async getProjectSummary(currentUser: UserAttributes, userId?: string) {
    const projects = await projectRepository.getProjectSummary(
      currentUser.relation_id,
      userId
    );

    return {
      projects: projects.length,
      live: projects.filter((project) => project.status === ProjectStatus.Live)
        .length,
      on_hold: projects.filter(
        (project) => project.status === ProjectStatus["On Hold"]
      ).length,
      archived: projects.filter(
        (project) => project.status === ProjectStatus.Archived
      ).length,
    };
  }

  public async getProjectOverallSummary() {
    const summary = await projectRepository.getOverallSummary();
    const results: SummaryInfo[] = [
      {
        id: v4(),
        quantity: summary.projects.total,
        label: "PROJECTS",
        subs: [
          {
            id: v4(),
            quantity: summary.projects.live,
            label: "Live",
          },
          {
            id: v4(),
            quantity: summary.projects.onHold,
            label: "On Hold",
          },
          {
            id: v4(),
            quantity: summary.projects.archived,
            label: "Archived",
          },
        ],
      },
      {
        id: v4(),
        quantity: sumBy(summary.countries.summary, "count"),
        label: "COUNTRIES",
        subs: ALL_REGIONS.map((region) => ({
          id: v4(),
          quantity:
            summary.countries.summary.find((el) => el.region === region)
              ?.count || 0,
          label: region,
        })),
      },
      {
        id: v4(),
        quantity: summary.products.total,
        label: "PRODUCTS",
        subs: [
          {
            id: v4(),
            quantity: summary.products.consider,
            label: "Considered",
          },
          {
            id: v4(),
            quantity: summary.products.unlisted,
            label: "Unlisted",
          },
          {
            id: v4(),
            quantity: summary.products.specified,
            label: "Specified",
          },
          {
            id: v4(),
            quantity: summary.products.cancelled,
            label: "Cancelled",
          },
          {
            id: v4(),
            quantity: summary.products.deleted,
            label: "Deleted",
          },
        ],
      },
    ];

    return successResponse({ data: results, area: summary.area });
  }

  public async getProjectGroupByStatus(designId: string) {
    const design = await designerRepository.find(designId);

    if (!design) {
      return errorMessageResponse(MESSAGES.DESIGN_NOT_FOUND, 404);
    }

    const projects = await projectRepository.getAllBy({
      design_id: designId,
    });

    const result = mappingProjectGroupByStatus(projects);

    return successResponse({
      data: result,
    });
  }
}

export const projectService = new ProjectService();

export default ProjectService;
