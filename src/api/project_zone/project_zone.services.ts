import { MEASUREMENT_UNIT } from "@/constant/common.constant";
import { MESSAGES, SYSTEM_TYPE } from "@/constants";
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
import ProjectZoneModel from "@/model/project_zone.model";
import SpecifiedProductModel from "@/model/specified_product.model";
import UserModel from "@/model/user.model";
import { projectZoneRepository } from "@/repositories/project_zone.repository";
import { userRepository } from "@/repositories/user.repository";
import { IMessageResponse } from "@/type/common.type";
import { UserAttributes } from "@/types";
import { v4 as uuidv4 } from "uuid";
import {
  mappingAddProjectZoneId,
  mappingResponseProjectZones,
  mappingResponseUnitRoomSize,
} from "./project_zone.mapping";
import {
  IProjectZoneResponse,
  IUpdateProjectZoneRequest,
} from "./project_zone.type";
export default class ProjectZoneService {
  private projectModel: ProjectModel;
  private userModel: UserModel;
  private projectZoneModel: ProjectZoneModel;
  private consideredProductModel: ConsideredProductModel;
  private specifiedProductModel: SpecifiedProductModel;
  constructor() {
    this.projectZoneModel = new ProjectZoneModel();
    this.projectModel = new ProjectModel();
    this.userModel = new UserModel();
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
      const projectZone = await this.projectZoneModel.find(projectZoneId);

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
        await this.projectZoneModel.getExistedProjectZone(
          projectZoneId,
          payload.name,
          projectZone.project_id
        );

      if (projectZoneExisted) {
        return errorMessageResponse(MESSAGES.PROJECT_ZONE_EXISTED);
      }
    }
    const foundProjectZone = await this.projectZoneModel.findBy({
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
    zoneOrder: "ASC" | "DESC",
    areaOrder: "ASC" | "DESC",
    roomNameOrder: "ASC" | "DESC",
    roomIdOrder: "ASC" | "DESC"
  ) {
    const foundUser = await this.userModel.find(userId);

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
    const foundUser = await this.userModel.find(userId);

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

  public async delete_(userId: string, projectZoneId: string) {
    const foundUser = await this.userModel.find(userId);

    if (!foundUser) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const projectZone = await this.projectZoneModel.find(projectZoneId);

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

  public delete = async (
    userId: string,
    projectZoneId: string
  ): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const foundUser = await this.userModel.find(userId);
      if (!foundUser) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const projectZone = await this.projectZoneModel.find(projectZoneId);
      if (!projectZone) {
        return resolve({
          message: MESSAGES.PROJECT_ZONE_NOT_FOUND,
          statusCode: 404,
        });
      }
      const foundProject = await this.projectModel.findBy({
        id: projectZone.project_id,
        design_id: foundUser.relation_id,
      });
      if (!foundProject) {
        return resolve({
          message: MESSAGES.PROJECT_NOT_FOUND,
          statusCode: 404,
        });
      }

      const foundConsideredProduct =
        await this.consideredProductModel.findConsideredProductByZone(
          projectZoneId
        );

      if (foundConsideredProduct.total > 0) {
        return resolve({
          message: MESSAGES.ZONE_WAS_CONSIDERED,
          statusCode: 400,
        });
      }
      const foundSpecifiedProduct =
        await this.specifiedProductModel.findSpecifiedProductByZone(
          projectZoneId
        );

      if (foundSpecifiedProduct.total > 0) {
        return resolve({
          message: MESSAGES.ZONE_WAS_SPECIFIED,
          statusCode: 400,
        });
      }

      if (
        foundProject.design_id !== foundUser.relation_id &&
        foundUser.type !== SYSTEM_TYPE.DESIGN
      ) {
        return resolve({
          message: MESSAGES.JUST_OWNER_CAN_DELETE,
          statusCode: 400,
        });
      }

      const updatedProjectZone = await this.projectZoneModel.update(
        projectZoneId,
        { is_deleted: true }
      );
      if (!updatedProjectZone) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_DELETE,
          statusCode: 200,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
  public update = async (
    userId: string,
    projectZoneId: string,
    payload: IUpdateProjectZoneRequest
  ): Promise<IMessageResponse | IProjectZoneResponse> => {
    return new Promise(async (resolve) => {
      const foundUser = await this.userModel.find(userId);
      if (!foundUser) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }

      const projectZone = await this.projectZoneModel.find(projectZoneId);
      if (!projectZone) {
        return resolve({
          message: MESSAGES.PROJECT_ZONE_NOT_FOUND,
          statusCode: 404,
        });
      }
      const foundProject = await this.projectModel.findBy({
        id: projectZone.project_id,
        design_id: foundUser.relation_id,
      });
      if (!foundProject) {
        return resolve({
          message: MESSAGES.PROJECT_NOT_FOUND,
          statusCode: 404,
        });
      }

      if (
        foundProject.design_id !== foundUser.relation_id &&
        foundUser.type !== SYSTEM_TYPE.DESIGN
      ) {
        return resolve({
          message: MESSAGES.JUST_OWNER_CAN_UPDATE,
          statusCode: 400,
        });
      }

      const foundProjectZone =
        await this.projectZoneModel.getExistedProjectZone(
          projectZoneId,
          payload.name,
          projectZone.project_id
        );

      if (foundProjectZone) {
        return resolve({
          message: MESSAGES.PROJECT_ZONE_EXISTED,
          statusCode: 400,
        });
      }
      if (
        isDuplicatedString(
          payload.areas.map((item) => {
            return item.name;
          })
        )
      ) {
        return resolve({
          message: MESSAGES.PROJECT_ZONE_AREA_DUPLICATED,
          statusCode: 400,
        });
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
        return resolve({
          message: MESSAGES.PROJECT_ZONE_ROOM_DUPLICATED,
          statusCode: 400,
        });
      }

      const areas = payload.areas.map((area) => {
        const rooms = area.rooms.map((room) => {
          if (!room.id) {
            return {
              ...room,
              id: uuidv4(),
            };
          }
          if (room.id) {
            return {
              ...room,
            };
          }
        });
        if (!area.id) {
          return {
            ...area,
            rooms,
            id: uuidv4(),
          };
        }
        if (area.id) {
          return {
            ...area,
            rooms,
          };
        }
      });
      const updatedProjectZone = await this.projectZoneModel.update(
        projectZoneId,
        {
          ...payload,
          areas,
        }
      );
      if (!updatedProjectZone) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_DELETE,
          statusCode: 200,
        });
      }
      const roomSizeUnit =
        foundProject.measurement_unit === MEASUREMENT_UNIT.IMPERIAL
          ? "sq.ft."
          : "sq.m.";
      const { is_deleted, ...rest } = updatedProjectZone;
      const returnedAreas = updatedProjectZone.areas.map((area) => {
        const rooms = area.rooms.map((room) => {
          return {
            ...room,
            room_size_unit: roomSizeUnit,
          };
        });
        return {
          ...area,
          rooms,
        };
      });
      return resolve({
        data: { ...rest, areas: returnedAreas },
        statusCode: 200,
      });
    });
  };
}
