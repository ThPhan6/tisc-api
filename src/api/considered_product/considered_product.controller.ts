import ConsideredProductService from "./considered_product.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { CONSIDERED_PRODUCT_STATUS_OPTIONS } from "../../constant/common.constant";

export default class ConsideredProductController {
  private service: ConsideredProductService;
  constructor() {
    this.service = new ConsideredProductService();
  }
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { project_id } = req.params;
    const { zone_order, area_order, room_order, brand_order } = req.query;
    const response = await this.service.getList(
      project_id,
      zone_order,
      area_order,
      room_order,
      brand_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListAssignedProject = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { product_id, project_id } = req.params;
    const response = await this.service.getListAssignedProject(
      project_id,
      product_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getConsideredProductStatusOptions = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    return toolkit.response(CONSIDERED_PRODUCT_STATUS_OPTIONS).code(200);
  };
}
