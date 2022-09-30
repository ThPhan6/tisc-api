import { Request, ResponseToolkit } from "@hapi/hapi";
import ProjectZoneService from "./project_zone.services";
import {
  IProjectZoneRequest,
  IUpdateProjectZoneRequest,
} from "./project_zone.type";

export default class ProjectZoneController {
  private service: ProjectZoneService;
  constructor() {
    this.service = new ProjectZoneService();
  }
  public create = async (
    req: Request & { payload: IProjectZoneRequest },
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const payload = req.payload;
    const response = await this.service.create(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const {
      project_id,
      zone_order,
      area_order,
      room_name_order,
      room_id_order,
    } = req.query;
    const response = await this.service.getList(
      userId,
      project_id,
      zone_order,
      area_order,
      room_name_order,
      room_id_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const { id } = req.params;
    const response = await this.service.getOne(userId, id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const { id } = req.params;
    const response = await this.service.delete(userId, id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IUpdateProjectZoneRequest },
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const { id } = req.params;
    const payload = req.payload;
    const response = await this.service.update_(userId, id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
