import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { SummaryInfo, UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { v4 } from "uuid";
import { CreateProjectRequestBody } from "./project_request.model";
import { ProjectTrackingAttributes } from "./project_tracking.model";
import { projectTrackingRepository } from "./project_tracking.repository";
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

  public getListProjectTracking = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { limit, offset, sort, order, project_status, priority } = req.query;
    const currentUser = req.auth.credentials.user as UserAttributes;
    const response = await projectTrackingService.getListProjectTracking(
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
    req: Request & { payload: Partial<ProjectTrackingAttributes> },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await projectTrackingRepository.update(id, req.payload);

    if (response === false) {
      const errorResponse = errorMessageResponse(
        "Update project tracking failed."
      );
      return toolkit.response(errorResponse).code(errorResponse.statusCode);
    }

    return toolkit.response(response).code(200);
  };

  public getProjectTracking = async (
    req: Request & { payload: Partial<ProjectTrackingAttributes> },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await projectTrackingRepository.update(id, req.payload);

    if (response === false) {
      const errorResponse = errorMessageResponse(
        "Update project tracking failed."
      );
      return toolkit.response(errorResponse).code(errorResponse.statusCode);
    }

    return toolkit.response(response).code(200);
  };

  public getProjectTrackingSummary = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const currentUser = req.auth.credentials.user as UserAttributes;
    const response = await projectTrackingRepository.getSummary(
      currentUser.relation_id
    );
    const summary = response[0];

    if (!summary) {
      return toolkit
        .response(errorMessageResponse(MESSAGES.SOMETHING_WRONG))
        .code(404);
    }

    const mappingSummary: SummaryInfo[] = [
      {
        id: v4(),
        label: "PROJECTS",
        quantity: summary.project.total,
        subs: [
          {
            id: v4(),
            label: "Live",
            quantity: summary.project.live,
          },
          {
            id: v4(),
            label: "On Hold",
            quantity: summary.project.onHold,
          },
          {
            id: v4(),
            label: "Archived",
            quantity: summary.project.archived,
          },
        ],
      },
      {
        id: v4(),
        label: "REQUESTS",
        quantity: summary.request.total,
        subs: [
          {
            id: v4(),
            label: "Pending",
            quantity: summary.request.pending,
          },
          {
            id: v4(),
            label: "Responded",
            quantity: summary.request.responded,
          },
        ],
      },
      {
        id: v4(),
        label: "NOTIFICATIONS",
        quantity: summary.notification.total,
        subs: [
          {
            id: v4(),
            label: "Keep-in-view",
            quantity: summary.notification.keepInView,
          },
          {
            id: v4(),
            label: "Followed-up",
            quantity: summary.notification.followedUp,
          },
        ],
      },
    ];
    return toolkit.response(
      successResponse({
        data: mappingSummary,
      })
    );
  };

  public getProjectTrackingDetail = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const currentUser = req.auth.credentials.user as UserAttributes;
    const { id } = req.params;

    const response = await projectTrackingRepository.getOne(
      id,
      currentUser.id,
      currentUser.relation_id
    );

    if (!response.length) {
      return toolkit
        .response(
          errorMessageResponse(MESSAGES.PROJECT_TRACKING_NOT_FOUND, 404)
        )
        .code(404);
    }

    const updateTrackingResponse =
      await projectTrackingRepository.updateUniqueAttribute(
        "project_trackings",
        "read_by",
        id,
        currentUser.id
      );

    return toolkit.response(
      successResponse({
        data: response[0],
      })
    );
  };
}
