import { MEASUREMENT_UNIT, MESSAGES, SYSTEM_TYPE } from "@/constants";
import {
  formatNumberDisplay,
  isDuplicatedString,
} from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import ConsideredProductModel from "@/model/considered_product.model";
import ProjectModel, { IProjectAttributes } from "@/model/project.model";
import SpecifiedProductModel from "@/model/specified_product.model";
import { projectZoneRepository } from "@/repositories/project_zone.repository";
import { userRepository } from "@/repositories/user.repository";
import { SortOrder, UserAttributes } from "@/types";
import {
  mappingAddProjectZoneId,
  mappingProjectZoneAreas,
  mappingResponseProjectZones,
  mappingResponseUnitRoomSize,
} from "./project_zone.mapping";
import { IUpdateProjectZoneRequest } from "./project_zone.type";
export default class ProjectZoneService {
  private projectModel: ProjectModel;
  private consideredProductModel: ConsideredProductModel;
  private specifiedProductModel: SpecifiedProductModel;
  constructor() {
    this.projectModel = new ProjectModel();
    this.consideredProductModel = new ConsideredProductModel();
    this.specifiedProductModel = new SpecifiedProductModel();
  }

  private async validateProjectZone(
    payload: IUpdateProjectZoneRequest,
    user: UserAttributes,
    project: IProjectAttributes,
    projectZoneId?: string
  ) {
    if (projectZoneId) {
      const projectZone = await projectZoneRepository.find(projectZoneId);

      if (!projectZone) {
        return errorMessageResponse(MESSAGES.PROJECT_ZONE_NOT_FOUND, 404);
      }

      if (
        project.design_id !== user.relation_id &&
        user.type !== SYSTEM_TYPE.DESIGN
      ) {
        return errorMessageResponse(MESSAGES.JUST_OWNER_CAN_UPDATE);
      }

      const projectZoneExisted =
        await projectZoneRepository.getExistedProjectZone(
          projectZoneId,
          payload.name,
          projectZone.project_id
        );

      if (projectZoneExisted) {
        return errorMessageResponse(MESSAGES.PROJECT_ZONE_EXISTED);
      }
    }
    const foundProjectZone = await projectZoneRepository.findBy({
      project_id: payload.project_id,
      name: payload.name,
    });

    if (foundProjectZone) {
      return errorMessageResponse(MESSAGES.PROJECT_ZONE_EXISTED);
    }
    if (
      isDuplicatedString(
        payload.areas.map((item) => {
          return item.name;
        })
      )
    ) {
      return errorMessageResponse(MESSAGES.PROJECT_ZONE_AREA_DUPLICATED);
    }

    let isAreaDuplicate = false;
    payload.areas.forEach((area) => {
      if (
        isDuplicatedString(
          area.rooms.map((item) => {
            return item.room_name;
          })
        ) ||
        isDuplicatedString(
          area.rooms.map((item) => {
            return item.room_id;
          })
        )
      ) {
        isAreaDuplicate = true;
      }
    });
    if (isAreaDuplicate) {
      return errorMessageResponse(MESSAGES.PROJECT_ZONE_ROOM_DUPLICATED);
    }
  }

  public async create(userId: string, payload: IUpdateProjectZoneRequest) {
    const foundUser = await userRepository.find(userId);

    if (!foundUser) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const foundProject = await this.projectModel.findBy({
      id: payload.project_id,
      design_id: foundUser.relation_id,
    });
    if (!foundProject) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    await this.validateProjectZone(payload, foundUser, foundProject);

    const areas = mappingAddProjectZoneId(payload);

    const createdProjectZone = await projectZoneRepository.create({
      project_id: payload.project_id,
      name: payload.name,
      areas,
    });
    if (!createdProjectZone) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    const returnedAreas = mappingResponseUnitRoomSize(
      foundProject,
      createdProjectZone
    );

    return successResponse({
      data: { ...createdProjectZone, areas: returnedAreas },
    });
  }

  public async getList(
    userId: string,
    projectId: string,
    zoneOrder: SortOrder,
    areaOrder: SortOrder,
    roomNameOrder: SortOrder,
    roomIdOrder: SortOrder
  ) {
    const foundUser = await userRepository.find(userId);

    if (!foundUser) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const foundProject = await this.projectModel.findBy({
      id: projectId,
      design_id: foundUser.relation_id,
    });

    if (!foundProject) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    if (
      foundProject.design_id !== foundUser.relation_id &&
      foundUser.type !== SYSTEM_TYPE.DESIGN
    ) {
      return errorMessageResponse(MESSAGES.JUST_OWNER_CAN_GET);
    }

    const projectZones = await projectZoneRepository.getListProjectZone(
      projectId,
      zoneOrder
    );

    const roomSizeUnit =
      foundProject.measurement_unit === MEASUREMENT_UNIT.IMPERIAL
        ? "sq.ft."
        : "sq.m.";

    const mappingProjectZones = mappingResponseProjectZones(
      roomSizeUnit,
      projectZones,
      areaOrder,
      roomNameOrder,
      roomIdOrder
    );

    const summary = [
      {
        name: "Zones:",
        value: projectZones.length,
      },
      {
        name: "Areas:",
        value: mappingProjectZones.count_area,
      },
      {
        name: "Rooms:",
        value: mappingProjectZones.count_room,
      },
      {
        name: "TOTAL AREA:",
        value: `${formatNumberDisplay(
          mappingProjectZones.total_area
        )} ${roomSizeUnit}`,
      },
    ];

    return successResponse({
      data: {
        project_zones: projectZones,
        summary,
      },
    });
  }

  public async getOne(userId: string, projectZoneId: string) {
    const foundUser = await userRepository.find(userId);

    if (!foundUser) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const projectZone = await projectZoneRepository.find(projectZoneId);

    if (!projectZone) {
      return errorMessageResponse(MESSAGES.PROJECT_ZONE_NOT_FOUND, 404);
    }

    const foundProject = await this.projectModel.findBy({
      id: projectZone.project_id,
      design_id: foundUser.relation_id,
    });

    if (!foundProject) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    if (
      foundProject.design_id !== foundUser.relation_id &&
      foundUser.type !== SYSTEM_TYPE.DESIGN
    ) {
      return errorMessageResponse(MESSAGES.JUST_OWNER_CAN_GET);
    }

    const result = mappingResponseUnitRoomSize(foundProject, projectZone);

    return successResponse({
      data: result,
    });
  }

  public async delete(userId: string, projectZoneId: string) {
    const foundUser = await userRepository.find(userId);

    if (!foundUser) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const projectZone = await projectZoneRepository.find(projectZoneId);

    if (!projectZone) {
      return errorMessageResponse(MESSAGES.PROJECT_ZONE_NOT_FOUND, 404);
    }

    const foundProject = await this.projectModel.findBy({
      id: projectZone.project_id,
      design_id: foundUser.relation_id,
    });

    if (!foundProject) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    const foundConsideredProduct =
      await this.consideredProductModel.findConsideredProductByZone(
        projectZoneId
      );

    if (foundConsideredProduct.total > 0) {
      return errorMessageResponse(MESSAGES.ZONE_WAS_CONSIDERED);
    }

    const foundSpecifiedProduct =
      await this.specifiedProductModel.findSpecifiedProductByZone(
        projectZoneId
      );

    if (foundSpecifiedProduct.total > 0) {
      return errorMessageResponse(MESSAGES.ZONE_WAS_SPECIFIED);
    }

    if (
      foundProject.design_id !== foundUser.relation_id &&
      foundUser.type !== SYSTEM_TYPE.DESIGN
    ) {
      return errorMessageResponse(MESSAGES.JUST_OWNER_CAN_DELETE);
    }

    const deletedProjectZone = await projectZoneRepository.delete(
      projectZoneId
    );

    if (!deletedProjectZone) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async update_(
    userId: string,
    projectZoneId: string,
    payload: IUpdateProjectZoneRequest
  ) {
    const foundUser = await userRepository.find(userId);

    if (!foundUser) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const projectZone = await projectZoneRepository.find(projectZoneId);

    if (!projectZone) {
      return errorMessageResponse(MESSAGES.PROJECT_ZONE_NOT_FOUND, 404);
    }

    const foundProject = await this.projectModel.findBy({
      id: projectZone.project_id,
      design_id: foundUser.relation_id,
    });

    if (!foundProject) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    await this.validateProjectZone(
      payload,
      foundUser,
      foundProject,
      projectZoneId
    );

    const areas = mappingProjectZoneAreas(payload.areas);

    const updatedProjectZone = await projectZoneRepository.update(
      projectZoneId,
      {
        ...payload,
        areas,
      }
    );

    if (!updatedProjectZone) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }

    const returnedAreas = mappingResponseUnitRoomSize(
      foundProject,
      projectZone
    );

    return successResponse({
      data: { ...updatedProjectZone, areas: returnedAreas },
    });
  }
}
