import {
  MEASUREMENT_UNIT,
  MESSAGES,
  SYSTEM_TYPE,
} from "../../constant/common.constant";
import ProjectModel from "../../model/project.model";
import UserModel from "../../model/user.model";
import { IMessageResponse } from "../../type/common.type";
import {
  IProjectZoneRequest,
  IProjectZoneResponse,
  IProjectZonesResponse,
  IUpdateProjectZoneRequest,
} from "./project_zone.type";
import ProjectZoneModel, {
  PROJECT_ZONE_NULL_ATTRIBUTES,
} from "../../model/project_zone.model";
import {
  isDuplicatedString,
  sortObjectArray,
} from "../../helper/common.helper";
import { v4 as uuidv4 } from "uuid";
export default class ProjectZoneService {
  private projectModel: ProjectModel;
  private userModel: UserModel;
  private projectZoneModel: ProjectZoneModel;
  constructor() {
    this.projectZoneModel = new ProjectZoneModel();
    this.projectModel = new ProjectModel();
    this.userModel = new UserModel();
  }
  public create = async (
    userId: string,
    payload: IProjectZoneRequest
  ): Promise<IMessageResponse | IProjectZoneResponse> => {
    return new Promise(async (resolve) => {
      const foundUser = await this.userModel.find(userId);
      if (!foundUser) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const foundProject = await this.projectModel.findBy({
        id: payload.project_id,
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
          message: MESSAGES.JUST_OWNER_CAN_CREATE,
          statusCode: 400,
        });
      }

      const foundProjectZone = await this.projectZoneModel.findBy({
        project_id: payload.project_id,
        name: payload.name,
      });

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
          return {
            id: uuidv4(),
            room_name: room.room_name,
            room_id: room.room_id,
            room_size: room.room_size,
            quantity: room.quantity,
            sub_total: room.quantity * room.room_size,
          };
        });
        return {
          id: uuidv4(),
          name: area.name,
          rooms,
        };
      });

      const createdProjectZone = await this.projectZoneModel.create({
        ...PROJECT_ZONE_NULL_ATTRIBUTES,
        project_id: payload.project_id,
        name: payload.name,
        areas,
      });
      if (!createdProjectZone) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const roomSizeUnit =
        foundProject.measurement_unit === MEASUREMENT_UNIT.IMPERIAL
          ? "sq.ft."
          : "sq.m.";
      const { is_deleted, ...rest } = createdProjectZone;
      const returnedAreas = createdProjectZone.areas.map((area) => {
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

  public getList = async (
    userId: string,
    projectId: string,
    zone_order: "ASC" | "DESC",
    area_order: "ASC" | "DESC",
    room_name_order: "ASC" | "DESC",
    room_id_order: "ASC" | "DESC"
  ): Promise<IMessageResponse | IProjectZonesResponse> => {
    return new Promise(async (resolve) => {
      const foundUser = await this.userModel.find(userId);
      if (!foundUser) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      const foundProject = await this.projectModel.findBy({
        id: projectId,
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
          message: MESSAGES.JUST_OWNER_CAN_GET,
          statusCode: 400,
        });
      }

      const projectZones = await this.projectZoneModel.getAllBy(
        {
          project_id: projectId,
        },
        undefined,
        "name",
        zone_order
      );

      let countArea = 0;
      let countRoom = 0;
      let totalArea = 0;
      const roomSizeUnit =
        foundProject.measurement_unit === MEASUREMENT_UNIT.IMPERIAL
          ? "sq.ft."
          : "sq.m.";

      const result = projectZones.map((projectZone) => {
        const { is_deleted, ...rest } = projectZone;
        const sortedAreas = sortObjectArray(
          projectZone.areas,
          "name",
          area_order
        );
        const returnedAreas = sortedAreas.map((area) => {
          countRoom += area.rooms.length;
          const rooms = area.rooms.map((room: any) => {
            totalArea += room.quantity * room.room_size;
            return {
              ...room,
              room_size_unit: roomSizeUnit,
            };
          });

          return {
            ...area,
            count: area.rooms.length,
            rooms: sortObjectArray(
              rooms,
              room_name_order ? "room_name" : "room_id",
              room_name_order ? room_name_order : room_id_order
            ),
          };
        });
        countArea += projectZone.areas.length;
        return {
          ...rest,
          count: projectZone.areas.length,
          areas: returnedAreas,
        };
      });

      const summary = [
        {
          name: "Zones:",
          value: projectZones.length,
        },
        {
          name: "Areas:",
          value: countArea,
        },
        {
          name: "Rooms:",
          value: countRoom,
        },
        {
          name: "TOTAL AREA:",
          value: `${totalArea} ${roomSizeUnit}`,
        },
      ];

      return resolve({
        data: {
          project_zones: result,
          summary,
        },
        statusCode: 200,
      });
    });
  };

  public getOne = async (
    userId: string,
    projectZoneId: string
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
          message: MESSAGES.JUST_OWNER_CAN_GET,
          statusCode: 400,
        });
      }

      const roomSizeUnit =
        foundProject.measurement_unit === MEASUREMENT_UNIT.IMPERIAL
          ? "sq.ft."
          : "sq.m.";
      const { is_deleted, ...rest } = projectZone;
      const returnedAreas = projectZone.areas.map((area) => {
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
        data: {
          ...rest,
          areas: returnedAreas,
        },
        statusCode: 200,
      });
    });
  };
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
          message: MESSAGES.JUST_OWNER_CAN_DELETE,
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
