import { Request, ResponseToolkit } from "@hapi/hapi";
import { projectProductService } from "./project_product.service";
import { AssignProductToProjectRequest } from "./project_product.type";

export default class ProjectProductController {
  public assignProductToProject = async (
    req: Request & { payload: AssignProductToProjectRequest },
    toolkit: ResponseToolkit
  ) => {
    const currentUserId = req.auth.credentials.user_id as string;
    const upsertResponse = await projectProductService.assignProductToProduct(
      req.payload,
      currentUserId
    );

    return toolkit.response(upsertResponse).code(200);
  };

  public getProjectAssignZoneByProduct = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { product_id, project_id } = req.params;

    const zoneResponse =
      await projectProductService.getProjectAssignZoneByProduct(
        project_id,
        product_id
      );

    return toolkit.response(zoneResponse).code(zoneResponse.statusCode ?? 200);
  };

  public getConsideredProducts = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { project_id } = req.params;
    const { zone_order, area_order, room_order, brand_order } = req.query;

    const zoneResponse = await projectProductService.getConsideredProducts(
      project_id,
      zone_order,
      area_order,
      room_order,
      brand_order
    );

    return toolkit.response(zoneResponse).code(zoneResponse.statusCode ?? 200);
  };
}
