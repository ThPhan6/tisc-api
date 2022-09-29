import DesignerService from "./designer.services";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { IUpdateDesignStatusRequest } from "./designer.type";
import { DESIGN_STATUS_OPTIONS } from "@/constants";

export default class DesignerController {
  private service: DesignerService;
  constructor() {
    this.service = new DesignerService();
  }
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort, order } = req.query;
    const response = await this.service.getList_(
      limit,
      offset,
      filter,
      sort,
      order
    );
    // return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getOne(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getStatuses = async (_req: Request, toolkit: ResponseToolkit) => {
    return toolkit.response(DESIGN_STATUS_OPTIONS).code(200);
  };
  public getAllDesignSummary = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    const response = await this.service.getAllDesignSummary();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public updateDesignStatus = async (
    req: Request & { payload: IUpdateDesignStatusRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await this.service.updateDesignStatus(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
