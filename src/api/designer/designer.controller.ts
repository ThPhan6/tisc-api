import { designerService } from "./designer.services";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { IUpdateDesignStatusRequest } from "./designer.type";
import { DESIGN_STATUS_OPTIONS } from "@/constants";

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
  public updateDesignStatus = async (
    req: Request & { payload: IUpdateDesignStatusRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await designerService.updateDesignStatus(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
