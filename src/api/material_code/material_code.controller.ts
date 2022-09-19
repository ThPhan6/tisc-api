import MaterialCodeService from "./material_code.services";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { IMaterialCodeRequest } from "./material_code.type";

export default class MaterialCodeController {
  private service: MaterialCodeService;
  constructor() {
    this.service = new MaterialCodeService();
  }
  public create = async (
    req: Request & { payload: IMaterialCodeRequest },
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const payload = req.payload;
    const response = await this.service.create(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getMaterialCodeGroup = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { design_id } = req.params;
    const response = await this.service.getMaterialCodeGroup(design_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListCodeMaterialCode = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const design_id = req.auth.credentials.user_id as string;
    const response = await this.service.getListCodeMaterialCode(design_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
