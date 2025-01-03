import { ProjectTrackingEntity, UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { CreateProjectRequestBody } from "../../models/project_request.model";

import { projectTrackingService } from "./project_tracking.service";

export default class ProjectTrackingController {
  public createProjectRequest = async (
    req: Request & { payload: CreateProjectRequestBody },
    toolkit: ResponseToolkit
  ) => {
    const currentUser = req.auth.credentials.user as UserAttributes;
    const response = await projectTrackingService.createProjectRequest(
      req.payload,
      currentUser.id,
      currentUser.relation_id,
      req.path
    );

    return toolkit.response(response).code(200);
  };

  public getListProjectTracking =
    (getWorkspace: boolean) =>
    async (req: Request, toolkit: ResponseToolkit) => {
      const { limit, offset, sort, order, project_status, priority } =
        req.query;
      const currentUser = req.auth.credentials.user as UserAttributes;
      const response = await projectTrackingService.getListProjectTracking(
        getWorkspace,
        currentUser,
        limit,
        offset,
        { project_status, priority },
        sort,
        order
      );
      return toolkit.response(response).code(response.statusCode ?? 200);
    };

  public updateProjectTracking = async (
    req: Request & { payload: Partial<ProjectTrackingEntity> },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await projectTrackingService.update(
      user,
      { ...(req.payload as ProjectTrackingEntity), id },
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

  public getProjectTrackingDetail = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const user = req.auth.credentials.user as UserAttributes;
    const { id } = req.params;

    const response = await projectTrackingService.getProjectTrackingDetail(
      user,
      id
    );

    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
