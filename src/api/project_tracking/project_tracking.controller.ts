import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { CreateProjectRequestBody } from "./project_request.model";
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
      currentUser.relation_id
    );

    return toolkit.response(response).code(200);
  };
}
