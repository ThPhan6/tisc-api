import { Request, ResponseToolkit } from "@hapi/hapi";
import ProjectZoneService from "./project_zone.service";
import { IProjectZoneRequest } from "./project_zone.type";

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
}
