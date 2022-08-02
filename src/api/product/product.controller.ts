import ProductService from "./product.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  IProductAssignToProject,
  IProductRequest,
  IUpdateProductRequest,
} from "./product.type";

export default class ProductController {
  private service: ProductService;
  constructor() {
    this.service = new ProductService();
  }
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { category_id, collection_id, brand_id } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getList(
      brand_id,
      category_id,
      collection_id,
      userId
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListDesignerBrandProducts = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { category_id, brand_id, name, sort, order } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getListDesignerBrandProducts(
      userId,
      brand_id,
      category_id,
      name,
      sort,
      order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getBrandProductSummary = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { brand_id } = req.params;
    const response = await this.service.getBrandProductSummary(brand_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.get(id, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public duplicate = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.duplicate(id, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public create = async (
    req: Request & { payload: IProductRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.create(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IUpdateProductRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const { id } = req.params;
    const response = await this.service.update(id, payload, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public likeOrUnlike = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.likeOrUnlike(id, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getListRestCollectionProduct = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await this.service.getListRestCollectionProduct(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getProductOptions = async (req: Request, toolkit: ResponseToolkit) => {
    const { id, attribute_id } = req.params;
    const response = await this.service.getProductOptions(id, attribute_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public assign = async (
    req: Request & { payload: IProductAssignToProject },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.assign(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
