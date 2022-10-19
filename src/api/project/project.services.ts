import { COMMON_TYPES, MESSAGES, SYSTEM_TYPE } from "@/constants";
import { pagination } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { designerRepository } from "@/repositories/designer.repository";
import { projectRepository } from "@/repositories/project.repository";
import { userRepository } from "@/repositories/user.repository";
import { countryStateCityService } from "@/service/country_state_city.service";
import { FindUserAndProjectResponse, ProjectStatus } from "@/types";
import { uniq } from "lodash";
import { mappingProjectGroupByStatus } from "./project.mapping";
import { IProjectRequest } from "./project.type";

class ProjectService {
  public async findUserAndProject(userId: string, projectId: string) {
    const res: FindUserAndProjectResponse = {
      message: errorMessageResponse(MESSAGES.SOMETHING_WRONG),
    };

    res.user = await userRepository.find(userId);
    if (!res.user) {
      res.message = errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
      return res;
    }

    res.project = await projectRepository.find(projectId);
    if (!res.project) {
      res.message = errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
      return res;
    }

    return res;
  }

  public async create(userId: string, payload: IProjectRequest) {
    const user = await userRepository.find(userId);

    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    if (user.type !== SYSTEM_TYPE.DESIGN) {
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
        payload.state_id,
        payload.city_id
      );

    if (isValidGeoLocation !== true) {
      return isValidGeoLocation;
    }

    let locationParts = [];

    const countryStateCity = await countryStateCityService.getCountryStateCity(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

    if (!countryStateCity) {
      return errorMessageResponse(MESSAGES.COUNTRY_STATE_CITY_NOT_FOUND);
    }

    if (countryStateCity.city_name && countryStateCity.city_name !== "") {
      locationParts.push(countryStateCity.city_name);
    }

    locationParts.push(countryStateCity.country_name);

    const createdProject = await projectRepository.create({
      code: payload.code,
      name: payload.name,
      location: locationParts.join(", "),
      country_id: countryStateCity.country_id,
      state_id: countryStateCity.state_id,
      city_id: countryStateCity.city_id,
      country_name: countryStateCity.country_name,
      state_name: countryStateCity.state_name,
      city_name: countryStateCity.city_name,
      address: payload.address,
      phone_code: countryStateCity.phone_code,
      postal_code: payload.postal_code,
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

    return successResponse({
      data: createdProject,
    });
  }

  public async getProject(id: string) {
    const project = await projectRepository.find(id);

    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    return successResponse({
      data: project,
    });
  }

  public async getProjects(
    userId: string,
    limit: number,
    offset: number,
    filter: any,
    sort: any
  ) {
    const user = await userRepository.find(userId);

    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const projects = await projectRepository.getListProject(
      user.relation_id,
      limit,
      offset,
      sort,
      {
        ...filter,
        status: filter?.status,
      }
    );

    const totalProject = await projectRepository.countProjectBy(
      user.relation_id
    );

    return successResponse({
      data: {
        projects: projects,
        pagination: pagination(limit, offset, totalProject),
      },
    });
  }

  public async getAll(relation_id: string) {
    const projects = await projectRepository.getAllProjectByWithSelect(
      {
        design_id: relation_id,
        status: ProjectStatus.Live,
      },
      ["id", "code", "name"],
      "created_at",
      "DESC"
    );

    return successResponse({
      data: projects,
    });
  }

  public async update(id: string, userId: string, payload: IProjectRequest) {
    const { user, project, message } = await this.findUserAndProject(
      userId,
      id
    );

    if (!project || !user) {
      return message;
    }

    if (
      user.type !== SYSTEM_TYPE.DESIGN ||
      project.design_id !== user.relation_id
    ) {
      return errorMessageResponse(MESSAGES.JUST_OWNER_CAN_UPDATE);
    }

    if (payload.team_profile_ids.length) {
      const userIds = uniq(payload.team_profile_ids);

      const assignedTeam = await projectRepository.update(id, {
        team_profile_ids: userIds,
      });
      return successResponse({
        data: assignedTeam,
      });
    }

    const projectExisted = await projectRepository.getProjectExist(
      id,
      payload.code,
      project.design_id
    );

    if (projectExisted) {
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
        payload.state_id,
        payload.city_id
      );

    if (isValidGeoLocation !== true) {
      return isValidGeoLocation;
    }

    let locationParts = [];
    let countryStateCity = await countryStateCityService.getCountryStateCity(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );
    if (!countryStateCity) {
      return errorMessageResponse(MESSAGES.COUNTRY_STATE_CITY_NOT_FOUND);
    }

    if (countryStateCity.city_name && countryStateCity.city_name !== "") {
      locationParts.push(countryStateCity.city_name);
    }

    locationParts.push(countryStateCity.country_name);

    //assign team

    const updatedProject = await projectRepository.update(id, {
      ...payload,
      location: locationParts.join(", "),
      country_id: countryStateCity.country_id,
      state_id: countryStateCity.state_id,
      city_id: countryStateCity.city_id,
      country_name: countryStateCity.country_name,
      state_name: countryStateCity.state_name,
      city_name: countryStateCity.city_name,
      phone_code: countryStateCity.phone_code,
      project_type: projectType.name,
      project_type_id: projectType.id,
      building_type: buildingType.name,
      building_type_id: buildingType.id,
    });

    if (!updatedProject) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    return successResponse({
      data: updatedProject,
    });
  }

  public async delete(id: string, userId: string) {
    const { user, project, message } = await this.findUserAndProject(
      userId,
      id
    );

    if (!project || !user) {
      return message;
    }

    if (
      user.type !== SYSTEM_TYPE.DESIGN ||
      project.design_id !== user.relation_id
    ) {
      return errorMessageResponse(MESSAGES.JUST_OWNER_CAN_DELETE);
    }

    const deletedProject = await projectRepository.delete(id);

    if (!deletedProject) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async getProjectSummary(userId: string) {
    const user = await userRepository.find(userId);

    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const projects = await projectRepository.getAllBy({
      design_id: user.relation_id,
    });

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

  public async getProjectGroupByStatus(designId: string) {
    const design = await designerRepository.find(designId);

    if (!design) {
      return errorMessageResponse(MESSAGES.DESIGN_NOT_FOUND, 404);
    }

    const user = await userRepository.findBy({ relation_id: design.id });

    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const projects = await projectRepository.getAllBy({
      design_id: user.relation_id,
    });

    const result = mappingProjectGroupByStatus(projects);

    return successResponse({
      data: result,
    });
  }
}

export const projectService = new ProjectService();

export default ProjectService;
