import { projectService } from "./project.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { CreateProjectRequest } from "./project.type";
import { MESSAGES, PROJECT_STATUS_OPTIONS } from "@/constants";
import { UserAttributes } from "@/types";
import { projectRepository } from "@/repositories/project.repository";
import {
  errorMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { pagination } from "@/helpers/common.helper";

export default class ProjectController {
  public create = async (
    req: Request & { payload: CreateProjectRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await projectService.create(user, payload, req.path);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await projectService.getProject(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getAll = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await projectService.getAll(user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getProjectStatus = async (_req: Request, toolkit: ResponseToolkit) => {
    return toolkit.response(PROJECT_STATUS_OPTIONS).code(200);
  };
  public getList =
    (getWorkspace: boolean) =>
    async (req: Request, toolkit: ResponseToolkit) => {
      const { limit, offset, filter, sort, order } = req.query;
      const user = req.auth.credentials.user as UserAttributes;
      const response = await projectService.getProjects(
        getWorkspace,
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
    req: Request & { payload: CreateProjectRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const payload = req.payload;
    const response = await projectService.update(id, user, payload, req.path);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public partialUpdate = async (
    req: Request & { payload: Partial<CreateProjectRequest> },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await projectService.partialUpdate(
      id,
      payload,
      user,
      req.path
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const { id } = req.params;
    const response = await projectService.delete(id, user, req.path);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getProjectSummary =
    (workspace: boolean) => async (req: Request, toolkit: ResponseToolkit) => {
      const user = req.auth.credentials.user as UserAttributes;
      const response = await projectService.getProjectSummary(
        user,
        workspace ? user.id : undefined
      );
      return toolkit.response(response).code(200);
    };

  public getProjectOverallSummary = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    const response = await projectService.getProjectOverallSummary();
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

  public getProjectListing = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, sort, order } = req.query;

    const result = await projectRepository.getProjectListing(
      limit,
      offset,
      sort,
      order
    );

    return toolkit
      .response(
        successResponse({
          data: {
            projects: result[0].projects,
            pagination: pagination(limit, offset, result[0].total),
          },
        })
      )
      .code(200);
  };

  public getProjectListingDetail = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const result = await projectRepository.getProjectListingDetail(
      req.params.id
    );
    if (!result[0]) {
      return toolkit
        .response(errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND))
        .code(404);
    }
    return toolkit
      .response(
        successResponse({
          data: result[0],
        })
      )
      .code(200);
  };
}
