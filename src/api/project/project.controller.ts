import { Request, ResponseToolkit } from "@hapi/hapi";
import ProjectService from "./project.services";
import { IProjectRequest } from "./project.type";
import { PROJECT_STATUS_OPTIONS } from "@/constants";

export default class ProjectController {
  private service: ProjectService;
  constructor() {
    this.service = new ProjectService();
  }

  public create = async (
    req: Request & { payload: IProjectRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.create(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getAll = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getAll(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getProjectStatus = async (_req: Request, toolkit: ResponseToolkit) => {
    return toolkit.response(PROJECT_STATUS_OPTIONS).code(200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getList(
      userId,
      limit,
      offset,
      filter,
      sort
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: IProjectRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const payload = req.payload;
    const response = await this.service.update(id, userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const { id } = req.params;
    const response = await this.service.delete(id, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getProjectSummary = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getProjectSummary(userId);
    return toolkit.response(response).code(200);
  };

  public getProjectGroupByStatus = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { design_id } = req.query;
    const response = await this.service.getProjectGroupByStatus(design_id);
    return toolkit.response(response).code(200);
  };
}
