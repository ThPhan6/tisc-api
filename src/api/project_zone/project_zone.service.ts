import { MEASUREMENT_UNIT, MESSAGES } from "@/constants";
import {
  formatNumberDisplay,
  isDuplicatedString,
} from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { projectZoneRepository } from "@/repositories/project_zone.repository";
import { projectRepository } from "@/repositories/project.repository";
import {
  ProjectAttributes,
  SortOrder,
  UserAttributes,
  UserType,
} from "@/types";
import {
  mappingAddProjectZoneId,
  mappingProjectZoneAreas,
  mappingResponseProjectZones,
  mappingResponseUnitRoomSize,
} from "./project_zone.mapping";
import { IUpdateProjectZoneRequest } from "./project_zone.type";

class ProjectZoneService {
  private async validateProjectZone(
    payload: IUpdateProjectZoneRequest,
    user: UserAttributes,
    project: ProjectAttributes,
    projectZoneId?: string
  ) {
    if (projectZoneId) {
      const projectZone = await projectZoneRepository.find(projectZoneId);

      if (!projectZone) {
        return errorMessageResponse(MESSAGES.PROJECT_ZONE_NOT_FOUND, 404);
      }

      if (
        project.design_id !== user.relation_id &&
        user.type !== UserType.Designer
      ) {
        return errorMessageResponse(MESSAGES.GENERAL.NOT_AUTHORIZED_TO_PERFORM);
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

  public async create(
    user: UserAttributes,
    payload: IUpdateProjectZoneRequest
  ) {
    const project = await projectRepository.find(payload.project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    await this.validateProjectZone(payload, user, project);

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
      project,
      createdProjectZone
    );

    return successResponse({
      data: { ...createdProjectZone, areas: returnedAreas },
    });
  }

  public async getList(
    user: UserAttributes,
    projectId: string,
    zoneOrder: SortOrder | undefined,
    areaOrder: SortOrder,
    roomNameOrder: SortOrder,
    roomIdOrder: SortOrder
  ) {
    const project = await projectRepository.find(projectId);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    if (
      project.design_id !== user.relation_id &&
      user.type !== UserType.Designer
    ) {
      return errorMessageResponse(MESSAGES.GENERAL.NOT_AUTHORIZED_TO_ACCESS);
    }

    const projectZones = await projectZoneRepository.getListProjectZone(
      projectId,
      zoneOrder
    );

    const roomSizeUnit =
      project.measurement_unit === MEASUREMENT_UNIT.IMPERIAL
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
        project_zones: mappingProjectZones.data,
        summary,
      },
    });
  }

  public async getOne(user: UserAttributes, projectZoneId: string) {
    const projectZone = await projectZoneRepository.find(projectZoneId);
    if (!projectZone) {
      return errorMessageResponse(MESSAGES.PROJECT_ZONE_NOT_FOUND, 404);
    }

    const project = await projectRepository.find(projectZone.project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    if (
      project.design_id !== user.relation_id &&
      user.type !== UserType.Designer
    ) {
      return errorMessageResponse(MESSAGES.GENERAL.NOT_AUTHORIZED_TO_ACCESS);
    }

    const result = mappingResponseUnitRoomSize(project, projectZone);

    return successResponse({
      data: result,
    });
  }

  public async delete(user: UserAttributes, projectZoneId: string) {
    const projectZone = await projectZoneRepository.find(projectZoneId);

    if (!projectZone) {
      return errorMessageResponse(MESSAGES.PROJECT_ZONE_NOT_FOUND, 404);
    }

    const project = await projectRepository.find(projectZone.project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    if (
      project.design_id !== user.relation_id &&
      user.type !== UserType.Designer
    ) {
      return errorMessageResponse(MESSAGES.GENERAL.NOT_AUTHORIZED_TO_PERFORM);
    }

    const deletedProjectZone = await projectZoneRepository.delete(
      projectZoneId
    );

    if (!deletedProjectZone) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async update(
    user: UserAttributes,
    projectZoneId: string,
    payload: IUpdateProjectZoneRequest
  ) {
    const projectZone = await projectZoneRepository.find(projectZoneId);

    if (!projectZone) {
      return errorMessageResponse(MESSAGES.PROJECT_ZONE_NOT_FOUND, 404);
    }

    const project = await projectRepository.find(projectZone.project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    await this.validateProjectZone(payload, user, project, projectZoneId);

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

    const returnedAreas = mappingResponseUnitRoomSize(project, projectZone);

    return successResponse({
      data: { ...updatedProjectZone, areas: returnedAreas },
    });
  }
}

export const projectZoneService = new ProjectZoneService();
export default ProjectZoneService;
