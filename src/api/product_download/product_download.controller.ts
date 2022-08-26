import { Request, ResponseToolkit } from "@hapi/hapi";
import Service from "./product_download.service";
import { IProductDownloadRequest, IUpdateProductDownloadRequest } from "./type";

export default class ProductDownloadController {
  private service: Service;
  constructor() {
    this.service = new Service();
  }

  public create = async (
    req: Request & { payload: IProductDownloadRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { product_id } = req.params;
    const response = await this.service.get(product_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IUpdateProductDownloadRequest },
    toolkit: ResponseToolkit
  ) => {
    const { product_id } = req.params;
    const payload = req.payload;
    const response = await this.service.update(product_id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { product_id } = req.params;
    const response = await this.service.delete(product_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
