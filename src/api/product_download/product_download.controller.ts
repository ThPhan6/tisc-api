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
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const response = await this.service.getList();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getById = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getById(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IProductDownloadRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await this.service.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (
    req: Request & { payload: IProductDownloadRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await this.service.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getDownloadsByProductId = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await this.service.getDownloadsByProductId(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
