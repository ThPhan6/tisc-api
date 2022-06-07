import { Request, ResponseToolkit } from "@hapi/hapi";
import ProductSettingService from "./product_setting.service";
import { IProductSettingRequest } from "./product_setting.type";
export default class ProductSettingController {
  private service: ProductSettingService;
  constructor() {
    this.service = new ProductSettingService();
  }

  public createCategory = async (
    req: Request & { payload: IProductSettingRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.createCateogry(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getListCategory = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort } = req.query;
    const response = await this.service.getCategories(
      limit,
      offset,
      filter,
      sort
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getProductSettingById = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await this.service.getProductSettingById(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public updateProductSetting = async (
    req: Request & { payload: IProductSettingRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await this.service.updateProductSetting(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
