import { Request, ResponseToolkit } from "@hapi/hapi";
import { materialCodeService } from "./material_code.service";
import { IMaterialCodeRequest } from "./material_code.type";
import {UserAttributes} from '@/types';

export default class MaterialCodeController {

  public create = async (
    req: Request & { payload: IMaterialCodeRequest },
    toolkit: ResponseToolkit
  ) => {
    const user = req.auth.credentials.user as UserAttributes;
    const payload = req.payload;
    const response = await materialCodeService.create(user, payload);
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
    const user = req.auth.credentials.user as UserAttributes;
    const response = await materialCodeService.getListCodeMaterialCode(user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: IMaterialCodeRequest },
    toolkit: ResponseToolkit
  ) => {
    const user = req.auth.credentials.user as UserAttributes;
    const { id } = req.params;
    const payload = req.payload;
    const response = await materialCodeService.update(id, user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await materialCodeService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
