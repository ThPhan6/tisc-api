import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { ProjectProductAttributes } from "./project_product.model";
import { projectProductService } from "./project_product.service";
import {
  AssignProductToProjectRequest,
  UpdateProjectProductPayload,
} from "./project_product.type";

export default class ProjectProductController {
  public assignProductToProject = async (
    req: Request & { payload: AssignProductToProjectRequest },
    toolkit: ResponseToolkit
  ) => {
    const currentUser = req.auth.credentials.user as UserAttributes;
    const upsertResponse = await projectProductService.assignProductToProduct(
      req.payload,
      currentUser.id
    );

    return toolkit
      .response(upsertResponse)
      .code(upsertResponse.statusCode ?? 200);
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
    const currentUserId = req.auth.credentials.user_id as string;

    const zoneResponse = await projectProductService.getConsideredProducts(
      currentUserId,
      project_id,
      zone_order,
      area_order,
      room_order,
      brand_order
    );

    return toolkit.response(zoneResponse).code(zoneResponse.statusCode ?? 200);
  };

  public updateConsiderProduct = async (
    req: Request & {
      payload: Partial<ProjectProductAttributes>;
    },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;

    const response = await projectProductService.updateConsiderProduct(
      id,
      payload,
      user
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public specifyProduct = async (
    req: Request & {
      payload: UpdateProjectProductPayload;
    },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const { finish_schedules, ...others } = req.payload as any;

    const response = await projectProductService.updateConsiderProduct(
      id,
      others,
      user,
      finish_schedules,
      true
    );

    return toolkit.response(response).code(response.statusCode ?? 200);
  }

  public updateSpecifyProductStatus = async (
    req: Request & {
      payload: Partial<ProjectProductAttributes>;
    },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;

    const response = await projectProductService.updateConsiderProduct(
      id,
      req.payload,
      user,
    );

    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public deleteConsiderProduct = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await projectProductService.deleteConsiderProduct(
      id,
      user.id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getSpecifiedProductsByBrand = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { project_id } = req.params;
    const { brand_order } = req.query;
    const response = await projectProductService.getSpecifiedProductsByBrand(
      project_id,
      brand_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getSpecifiedProductsByMaterial = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { project_id } = req.params;
    const { brand_order, material_order } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await projectProductService.getSpecifiedProductsByMaterial(
      userId,
      project_id,
      brand_order,
      material_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getSpecifiedProductsByZone = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { project_id } = req.params;
    const { zone_order, area_order, room_order, brand_order } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await projectProductService.getSpecifiedProductsByZone(
      userId,
      project_id,
      zone_order,
      area_order,
      room_order,
      brand_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getFinishScheduleByRoom = async (
    req: Request & {
      query: { roomIds: string[] };
      params: { project_product_id: string };
    },
    toolkit: ResponseToolkit
  ) => {
    const { project_product_id } = req.params;
    const { roomIds } = req.query;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await projectProductService.getFinishScheduleByRoom(
      project_product_id,
      roomIds,
      user
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
