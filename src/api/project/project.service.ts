import {
  MESSAGES,
  PROJECT_STATUS,
  PROJECT_STATUS_OPTIONS,
  SYSTEM_TYPE,
} from "@/constant/common.constant";
import ProjectModel, { PROJECT_NULL_ATTRIBUTES } from "@/model/project.model";
import {
  IAllProjectResponse,
  IProjectGroupByStatusResponse,
  IProjectRequest,
  IProjectResponse,
  IProjectsResponse,
  IProjectSummaryResponse,
} from "./project.type";
import ProjectTypeModel, {
  PROJECT_TYPE_NULL_ATTRIBUTES,
} from "@/model/project_type.model";
import BuildingTypeModel from "@/model/building_type.model";
import UserModel from "@/model/user.model";
import { IFunctionalTypesResponse } from "../location/location.type";
import CountryStateCityService from "@/service/country_state_city.service";
import { IMessageResponse } from "@/type/common.type";
import DesignerModel from "@/model/designer.model";

export default class ProjectService {
  private projectModel: ProjectModel;
  private projectTypeModel: ProjectTypeModel;
  private buildingTypeModel: BuildingTypeModel;
  private userModel: UserModel;
  private countryStateCityService: CountryStateCityService;
  private designModel: DesignerModel;
  constructor() {
    this.projectModel = new ProjectModel();
    this.projectTypeModel = new ProjectTypeModel();
    this.buildingTypeModel = new BuildingTypeModel();
    this.userModel = new UserModel();
    this.countryStateCityService = new CountryStateCityService();
    this.designModel = new DesignerModel();
  }
  public getProjectTypes = (
    user_id: string
  ): Promise<IFunctionalTypesResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const rawProjectTypes = await this.projectTypeModel.getAllBy(
        { type: 0 },
        ["id", "name"],
        "created_at",
        "ASC"
      );
      const projectTypes = await this.projectTypeModel.getAllBy(
        { type: user.type, relation_id: user.relation_id },
        ["id", "name"],
        "created_at",
        "ASC"
      );
      return resolve({
        data: rawProjectTypes.concat(projectTypes),
        statusCode: 200,
      });
    });
  };
  public getBuildingTypes = (
    user_id: string
  ): Promise<IFunctionalTypesResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const rawBuildingTypes = await this.buildingTypeModel.getAllBy(
        { type: 0 },
        ["id", "name"],
        "created_at",
        "ASC"
      );
      const buildingTypes = await this.buildingTypeModel.getAllBy(
        { type: user.type, relation_id: user.relation_id },
        ["id", "name"],
        "created_at",
        "ASC"
      );
      return resolve({
        data: rawBuildingTypes.concat(buildingTypes),
        statusCode: 200,
      });
    });
  };
  public create = (
    user_id: string,
    payload: IProjectRequest
  ): Promise<IProjectResponse | IMessageResponse> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (user.type !== SYSTEM_TYPE.DESIGN) {
        return resolve({
          message: MESSAGES.JUST_DESIGNER_CAN_CREATE,
          statusCode: 400,
        });
      }

      const project = await this.projectModel.findBy({
        code: payload.code,
        design_id: user.relation_id,
      });
      if (project) {
        return resolve({
          message: MESSAGES.PROJECT_EXISTED,
          statusCode: 400,
        });
      }
      let projectType: any = await this.projectTypeModel.findByNameOrId(
        payload.project_type_id,
        user.relation_id || ""
      );
      if (!projectType) {
        projectType = await this.projectTypeModel.create({
          ...PROJECT_TYPE_NULL_ATTRIBUTES,
          name: payload.project_type_id,
          type: user.type,
          relation_id: user.relation_id || "",
        });
      }
      let buildingType: any = await this.buildingTypeModel.findByNameOrId(
        payload.building_type_id,
        user.relation_id || ""
      );
      if (!buildingType) {
        buildingType = await this.buildingTypeModel.create({
          ...PROJECT_TYPE_NULL_ATTRIBUTES,
          name: payload.building_type_id,
          type: user.type,
          relation_id: user.relation_id || "",
        });
      }

      let locationParts = [];
      const country = await this.countryStateCityService.getCountryDetail(
        payload.country_id
      );
      if (!country.id) {
        return resolve({
          message: MESSAGES.COUNTRY_NOT_FOUND,
          statusCode: 404,
        });
      }
      const states = await this.countryStateCityService.getStatesByCountry(
        payload.country_id
      );
      if (states.length >= 1) {
        if (!payload.state_id || payload.state_id === "") {
          return resolve({
            message: MESSAGES.STATE_REQUIRED,
            statusCode: 400,
          });
        }
        const foundState = states.find((item) => item.id === payload.state_id);
        if (!foundState) {
          return resolve({
            message: MESSAGES.STATE_NOT_IN_COUNTRY,
            statusCode: 400,
          });
        }
        const state = await this.countryStateCityService.getStateDetail(
          payload.state_id
        );
        if (!state.id) {
          return resolve({
            message: MESSAGES.STATE_NOT_FOUND,
            statusCode: 404,
          });
        }
        const cities =
          await this.countryStateCityService.getCitiesByStateAndCountry(
            payload.country_id,
            payload.state_id
          );
        if (cities.length >= 1) {
          if (!payload.city_id || payload.city_id === "") {
            return resolve({
              message: MESSAGES.CITY_REQUIRED,
              statusCode: 400,
            });
          }
          const foundCity = cities.find((item) => item.id === payload.city_id);
          if (!foundCity) {
            return resolve({
              message: MESSAGES.CITY_NOT_IN_STATE,
              statusCode: 400,
            });
          }
        }
      }
      const countryStateCity =
        await this.countryStateCityService.getCountryStateCity(
          payload.country_id,
          payload.city_id,
          payload.state_id
        );
      if (!countryStateCity) {
        return resolve({
          message: MESSAGES.COUNTRY_STATE_CITY_NOT_FOUND,
          statusCode: 400,
        });
      }
      if (countryStateCity.city_name && countryStateCity.city_name !== "") {
        locationParts.push(countryStateCity.city_name);
      }
      locationParts.push(countryStateCity.country_name);
      const createdProject = await this.projectModel.create({
        ...PROJECT_NULL_ATTRIBUTES,
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
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      return resolve(await this.get(createdProject.id));
    });

  public get = (id: string): Promise<IProjectResponse | IMessageResponse> =>
    new Promise(async (resolve) => {
      const project = await this.projectModel.find(id);
      if (!project) {
        return resolve({
          message: MESSAGES.PROJECT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const { is_deleted, design_id, ...rest } = project;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  public getList = (
    user_id: string,
    limit: number,
    offset: number,
    filter: any,
    sort: any
  ): Promise<IProjectsResponse | IMessageResponse> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const projects = await this.projectModel.listV2(
        limit,
        offset,
        { ...filter, design_id: user.relation_id },
        sort
      );
      const result = await Promise.all(
        projects.map(async (project) => {
          const users = await this.userModel.getMany(project.team_profile_ids, [
            "id",
            "firstname",
            "avatar",
          ]);
          return {
            id: project.id,
            code: project.code,
            name: project.name,
            location: project.location,
            project_type: project.project_type,
            building_type: project.building_type,
            design_due: project.design_due,
            status: project.status,
            teams: users,
          };
        })
      );
      const pagination = await this.projectModel.getPagination(limit, offset, {
        ...filter,
        design_id: user.relation_id,
      });
      return resolve({
        data: {
          projects: result,
          pagination,
        },
        statusCode: 200,
      });
    });
  public getAll = (
    user_id: string
  ): Promise<IAllProjectResponse | IMessageResponse> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const projects = await this.projectModel.getAllBy(
        {
          design_id: user.relation_id,
          status: PROJECT_STATUS.LIVE,
        },
        ["id", "code", "name"],
        "created_at",
        "DESC"
      );

      return resolve({
        data: projects,
        statusCode: 200,
      });
    });

  public update = async (
    id: string,
    user_id: string,
    payload: IProjectRequest
  ): Promise<IMessageResponse | IProjectResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const foundProject = await this.projectModel.find(id);
      if (!foundProject) {
        return resolve({
          message: MESSAGES.PROJECT_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (
        user.type !== SYSTEM_TYPE.DESIGN ||
        foundProject.design_id !== user.relation_id
      ) {
        return resolve({
          message: MESSAGES.JUST_OWNER_CAN_UPDATE,
          statusCode: 400,
        });
      }

      const project = await this.projectModel.getExistedProject(
        id,
        payload.code,
        foundProject.design_id
      );

      if (project) {
        return resolve({
          message: MESSAGES.PROJECT_EXISTED,
          statusCode: 400,
        });
      }

      let projectType;
      if (
        payload.project_type_id !== foundProject.project_type_id &&
        payload.project_type_id !== foundProject.project_type
      ) {
        projectType = await this.projectTypeModel.findByNameOrId(
          payload.project_type_id,
          user.relation_id || ""
        );
        if (!projectType) {
          projectType = await this.projectTypeModel.create({
            ...PROJECT_TYPE_NULL_ATTRIBUTES,
            name: payload.project_type_id,
            type: user.type,
            relation_id: user.relation_id || "",
          });
        }
      }
      let buildingType;

      if (
        payload.building_type_id !== foundProject.building_type_id &&
        payload.building_type_id !== foundProject.building_type
      ) {
        buildingType = await this.buildingTypeModel.findByNameOrId(
          payload.building_type_id,
          user.relation_id || ""
        );
        if (!buildingType) {
          buildingType = await this.buildingTypeModel.create({
            ...PROJECT_TYPE_NULL_ATTRIBUTES,
            name: payload.building_type_id,
            type: user.type,
            relation_id: user.relation_id || "",
          });
        }
      }
      let locationParts = [];
      let countryStateCity: any;
      if (
        payload.country_id !== foundProject.country_id ||
        payload.state_id !== foundProject.state_id ||
        payload.city_id !== foundProject.city_id
      ) {
        if (
          foundProject.country_id.toString() !== payload.country_id.toString()
        ) {
          const country = await this.countryStateCityService.getCountryDetail(
            payload.country_id
          );
          if (!country.id) {
            return resolve({
              message: MESSAGES.COUNTRY_NOT_FOUND,
              statusCode: 404,
            });
          }
        }
        if (foundProject.state_id.toString() !== payload.state_id.toString()) {
          const states = await this.countryStateCityService.getStatesByCountry(
            payload.country_id
          );
          if (states.length >= 1) {
            if (!payload.state_id || payload.state_id === "") {
              return resolve({
                message: MESSAGES.STATE_REQUIRED,
                statusCode: 400,
              });
            }
            const foundState = states.find(
              (item) => item.id === payload.state_id
            );
            if (!foundState) {
              return resolve({
                message: MESSAGES.STATE_NOT_IN_COUNTRY,
                statusCode: 400,
              });
            }
            const state = await this.countryStateCityService.getStateDetail(
              payload.state_id
            );
            if (!state.id) {
              return resolve({
                message: MESSAGES.STATE_NOT_FOUND,
                statusCode: 404,
              });
            }
            const cities =
              await this.countryStateCityService.getCitiesByStateAndCountry(
                payload.country_id,
                payload.state_id
              );
            if (cities.length >= 1) {
              if (!payload.city_id || payload.city_id === "") {
                return resolve({
                  message: MESSAGES.CITY_REQUIRED,
                  statusCode: 400,
                });
              }
              const foundCity = cities.find(
                (item) => item.id === payload.city_id
              );
              if (!foundCity) {
                return resolve({
                  message: MESSAGES.CITY_NOT_IN_STATE,
                  statusCode: 400,
                });
              }
            }
          }
        }
        countryStateCity =
          await this.countryStateCityService.getCountryStateCity(
            payload.country_id,
            payload.city_id,
            payload.state_id
          );
        if (!countryStateCity) {
          return resolve({
            message: MESSAGES.COUNTRY_STATE_CITY_NOT_FOUND,
            statusCode: 400,
          });
        }
        if (countryStateCity.city_name && countryStateCity.city_name !== "") {
          locationParts.push(countryStateCity.city_name);
        }
        locationParts.push(countryStateCity.country_name);
      }
      const updatedProject = await this.projectModel.update(id, {
        ...payload,
        location: locationParts.length
          ? locationParts.join(", ")
          : foundProject.location,
        country_id: countryStateCity
          ? countryStateCity.country_id
          : foundProject.country_id,
        state_id: countryStateCity
          ? countryStateCity.state_id
          : foundProject.state_id,
        city_id: countryStateCity
          ? countryStateCity.city_id
          : foundProject.city_id,
        country_name: countryStateCity
          ? countryStateCity.country_name
          : foundProject.country_name,
        state_name: countryStateCity
          ? countryStateCity.state_name
          : foundProject.state_name,
        city_name: countryStateCity
          ? countryStateCity.city_name
          : foundProject.city_name,
        phone_code: countryStateCity
          ? countryStateCity.phone_code
          : foundProject.phone_code,
        project_type: projectType
          ? projectType.name
          : foundProject.project_type,
        project_type_id: projectType
          ? projectType.id
          : foundProject.project_type_id,
        building_type: buildingType
          ? buildingType.name
          : foundProject.building_type,
        building_type_id: buildingType
          ? buildingType.id
          : foundProject.building_type,
      });
      if (!updatedProject) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      return resolve(await this.get(id));
    });
  };

  public delete = async (
    id: string,
    user_id: string
  ): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const foundProject = await this.projectModel.find(id);
      if (!foundProject) {
        return resolve({
          message: MESSAGES.PROJECT_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (
        user.type !== SYSTEM_TYPE.DESIGN ||
        foundProject.design_id !== user.relation_id
      ) {
        return resolve({
          message: MESSAGES.JUST_OWNER_CAN_DELETE,
          statusCode: 400,
        });
      }

      const updatedProject = await this.projectModel.update(id, {
        is_deleted: true,
      });
      if (!updatedProject) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_DELETE,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };

  public getProjectSummary = async (
    user_id: string
  ): Promise<IMessageResponse | IProjectSummaryResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const projects = await this.projectModel.getBy({
        design_id: user.relation_id,
      });

      return resolve({
        projects: projects.length,
        live: projects.filter(
          (project) => project.status === PROJECT_STATUS.LIVE
        ).length,
        on_hold: projects.filter(
          (project) => project.status === PROJECT_STATUS.ON_HOLD
        ).length,
        archived: projects.filter(
          (project) => project.status === PROJECT_STATUS.ARCHIVE
        ).length,
      });
    });
  };

  public getProjectGroupByStatus = async (
    design_id: string
  ): Promise<IMessageResponse | IProjectGroupByStatusResponse> => {
    return new Promise(async (resolve) => {
      const design = await this.designModel.find(design_id);
      if (!design) {
        return resolve({
          message: MESSAGES.DESIGN_NOT_FOUND,
          statusCode: 404,
        });
      }
      const user = await this.userModel.findBy({ relation_id: design.id });
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const projects = await this.projectModel.getAllBy({
        design_id: user.relation_id,
      });

      const result = PROJECT_STATUS_OPTIONS.map((projectStatus) => {
        const groupProjects = projects.filter(
          (project) => project.status === projectStatus.value
        );
        const removedFieldsOfProject = groupProjects.map((groupProject) => {
          return {
            code: groupProject.code,
            name: groupProject.name,
            location: groupProject.location,
            building_type: groupProject.building_type,
            type: groupProject.project_type,
            measurement_unit: groupProject.measurement_unit,
            design_due: groupProject.design_due,
            construction_start: groupProject.construction_start,
          };
        });
        return {
          status_name: projectStatus.key,
          count: groupProjects.length,
          projects: removedFieldsOfProject,
        };
      });

      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
}
