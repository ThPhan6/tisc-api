import { ProjectTrackingEntity, UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";

import { projectTrackingService } from "./project_tracking.service";
import { ProjectTrackingCreateRequest } from "./project_tracking.types";

export default class ProjectTrackingController {
  public create = async (
    req: Request & { payload: ProjectTrackingCreateRequest },
    toolkit: ResponseToolkit
  ) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await projectTrackingService.create(
      user,
      req.payload,
      req.path
    );

    return toolkit.response(response).code(200);
  };

  public getListProjectTracking =
    (getWorkspace: boolean) =>
    async (req: Request, toolkit: ResponseToolkit) => {
      const {
        limit,
        offset,
        sort,
        order,
        project_status,
        priority,
        project_stage,
        type,
      } = req.query;
      const currentUser = req.auth.credentials.user as UserAttributes;
      const response = await projectTrackingService.getListProjectTracking(
        getWorkspace,
        currentUser,
        limit,
        offset,
        { project_status, priority, project_stage, type },
        sort,
        order
      );
      return toolkit.response(response).code(response.statusCode ?? 200);
    };

  public update = async (
    req: Request & { payload: Partial<ProjectTrackingCreateRequest> },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await projectTrackingService.update(
      user,
      { ...(req.payload as Partial<ProjectTrackingCreateRequest>), id },
      req.path
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getProjectTrackingSummary =
    (workspace: boolean) => async (req: Request, toolkit: ResponseToolkit) => {
      const user = req.auth.credentials.user as UserAttributes;
      const response = await projectTrackingService.getProjectTrackingSummary(
        user,
        workspace
      );

      return toolkit.response(response).code(response.statusCode ?? 200);
    };

  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const { id } = req.params;
    const { type } = req.query;

    const response = await projectTrackingService.get(user, id, type);

    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const { id } = req.params;
    const response = await projectTrackingService.delete(user, id, req.path);

    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
