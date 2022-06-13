import DesignerService from "./designer.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { DESIGN_STATUS_OPTIONS } from "../../constant/common.constant";

export default class DesignerController {
  private service: DesignerService;
  constructor() {
    this.service = new DesignerService();
  }
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort_name, sort_order } = req.query;
    const response = await this.service.getList(
      limit,
      offset,
      filter,
      sort_name,
      sort_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getOne(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getStatuses = async (req: Request, toolkit: ResponseToolkit) => {
    return toolkit.response(DESIGN_STATUS_OPTIONS).code(200);
  };
}
