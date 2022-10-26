import { projectZoneService } from "./project_zone.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  IProjectZoneRequest,
  IUpdateProjectZoneRequest,
} from "./project_zone.type";
import {UserAttributes} from '@/types';

export default class ProjectZoneController {

  public create = async (
    req: Request & { payload: IProjectZoneRequest },
    toolkit: ResponseToolkit
  ) => {
    const user = req.auth.credentials.user as UserAttributes;
    const payload = req.payload;
    const response = await projectZoneService.create(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const {
      project_id,
      zone_order,
      area_order,
      room_name_order,
      room_id_order,
    } = req.query;
    const response = await projectZoneService.getList(
      user,
      project_id,
      zone_order,
      area_order,
      room_name_order,
      room_id_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const { id } = req.params;
    const response = await projectZoneService.getOne(user, id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const { id } = req.params;
    const response = await projectZoneService.delete(user, id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IUpdateProjectZoneRequest },
    toolkit: ResponseToolkit
  ) => {
    const user = req.auth.credentials.user as UserAttributes;
    const { id } = req.params;
    const payload = req.payload;
    const response = await projectZoneService.update(user, id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
