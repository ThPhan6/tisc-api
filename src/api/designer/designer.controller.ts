import { DESIGN_STATUS_OPTIONS } from "@/constants";
import { DesignerAttributes, UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { designerService } from "./designer.services";

export default class DesignerController {
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort, order } = req.query;
    const response = await designerService.getList(
      limit,
      offset,
      filter,
      sort,
      order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await designerService.getOne(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getStatuses = async (_req: Request, toolkit: ResponseToolkit) => {
    return toolkit.response(DESIGN_STATUS_OPTIONS).code(200);
  };
  public getAllDesignSummary = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    const response = await designerService.getAllDesignSummary();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public updateDesign = async (
    req: Request & {
      payload: Partial<DesignerAttributes>;
    },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const payload = req.payload;
    const response = await designerService.updateDesign(id, payload, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
