import { Request, ResponseToolkit } from "@hapi/hapi";
import { materialCodeService } from "./material_code.services";
import { IMaterialCodeRequest } from "./material_code.type";

export default class MaterialCodeController {
  public create = async (
    req: Request & { payload: IMaterialCodeRequest },
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const payload = req.payload;
    const response = await materialCodeService.create(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await materialCodeService.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getMaterialCodes = async (req: Request, toolkit: ResponseToolkit) => {
    const {
      design_id,
      main_material_code_order,
      sub_material_code_order,
      material_code_order,
    } = req.query;
    console.log(design_id, "[design_id]");
    const response = await materialCodeService.getMaterialCodes(
      main_material_code_order,
      sub_material_code_order,
      material_code_order,
      design_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListCodeMaterialCode = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await materialCodeService.getListCodeMaterialCode(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: IMaterialCodeRequest },
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const { id } = req.params;
    const payload = req.payload;
    const response = await materialCodeService.update(id, userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const { id } = req.params;
    const response = await materialCodeService.delete(id, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
