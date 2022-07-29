import { PROJECT_ZONE_NULL_ATTRIBUTES } from "./../../model/project_zone.model";
import { MESSAGES, SYSTEM_TYPE } from "./../../constant/common.constant";
import ProjectModel from "../../model/project.model";
import UserModel from "../../model/user.model";
import { IMessageResponse } from "./../../type/common.type";
import { IProjectZoneRequest, IProjectZoneResponse } from "./project_zone.type";
import ProjectZoneModel from "../../model/project_zone.model";
import { isDuplicatedString } from "../../helper/common.helper";
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
          payload.area.map((item) => {
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
      payload.area.forEach((area) => {
        if (
          isDuplicatedString(
            area.room.map((item) => {
              return item.room_name;
            })
          ) ||
          isDuplicatedString(
            area.room.map((item) => {
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

      const areas = payload.area.map((area) => {
        const rooms = area.room.map((room) => {
          return {
            room_name: room.room_name,
            room_id: room.room_id,
            room_size: room.room_size + " " + room.room_size_unit,
            quantity: room.quantity,
            sub_total:
              room.quantity * room.room_size + " " + room.room_size_unit,
          };
        });
        return {
          name: area.name,
          room: rooms,
        };
      });

      const createdProjectZone = await this.projectZoneModel.create({
        ...PROJECT_ZONE_NULL_ATTRIBUTES,
        project_id: payload.project_id,
        name: payload.name,
        area: areas,
      });
      if (!createdProjectZone) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...rest } = createdProjectZone;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };
}
