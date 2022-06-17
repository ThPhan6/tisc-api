import { Request, ResponseToolkit } from "@hapi/hapi";
import ProductDownloadService from "./product_download.service";
import { IProductDownloadRequest } from "./product_download.type";

export default class ProductDownloadController {
  private service: ProductDownloadService;
  constructor() {
    this.service = new ProductDownloadService();
  }

  public create = async (
    req: Request & { payload: IProductDownloadRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
