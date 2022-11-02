import { projectService } from "./project.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { IProjectRequest } from "./project.type";
import { PROJECT_STATUS_OPTIONS } from "@/constants";
import { UserAttributes } from "@/types";

export default class ProjectController {
  public create = async (
    req: Request & { payload: IProjectRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await projectService.create(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await projectService.getProject(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getAll = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await projectService.getAll(user.relation_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getProjectStatus = async (_req: Request, toolkit: ResponseToolkit) => {
    return toolkit.response(PROJECT_STATUS_OPTIONS).code(200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort, order } = req.query;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await projectService.getProjects(
      user,
      limit,
      offset,
      filter,
      sort,
      order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: IProjectRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const payload = req.payload;
    const response = await projectService.update(id, user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public partialUpdate = async (
    req: Request & { payload: Partial<IProjectRequest> },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await projectService.partialUpdate(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const { id } = req.params;
    const response = await projectService.delete(id, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getProjectSummary = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await projectService.getProjectSummary(user);
    return toolkit.response(response).code(200);
  };

  public getProjectGroupByStatus = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { design_id } = req.query;
    const response = await projectService.getProjectGroupByStatus(design_id);
    return toolkit.response(response).code(200);
  };
}
