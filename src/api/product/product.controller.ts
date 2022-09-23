import ProductService from "./product.services";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  IProductAssignToProject,
  IProductRequest,
  IUpdateProductRequest,
  ShareProductBodyRequest,
} from "./product.type";

export default class ProductController {
  constructor() {}
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { category_id, collection_id, brand_id } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await ProductService.getList(
      userId,
      brand_id,
      category_id,
      collection_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListDesignerBrandProducts = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { category_id, brand_id, name, sort, order } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await ProductService.getListDesignerBrandProducts(
      userId,
      brand_id,
      category_id,
      name,
      sort,
      order
    );
    return toolkit.response(response).code(response?.statusCode ?? 200);
  };
  public getBrandProductSummary = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { brand_id } = req.params;
    const response = await ProductService.getBrandProductSummary(brand_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await ProductService.get(id, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public duplicate = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await ProductService.duplicate(id, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public create = async (
    req: Request & { payload: IProductRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await ProductService.create(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IUpdateProductRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const { id } = req.params;
    const response = await ProductService.update(id, payload, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await ProductService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public likeOrUnlike = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await ProductService.likeOrUnlike(id, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getListRestCollectionProduct = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await ProductService.getListRestCollectionProduct(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getProductOptions = async (req: Request, toolkit: ResponseToolkit) => {
    const { id, attribute_id } = req.params;
    const response = await ProductService.getProductOptions(id, attribute_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public assign = async (
    req: Request & { payload: IProductAssignToProject },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await ProductService.assign(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public shareByEmail = async (
    req: Request & { payload: ShareProductBodyRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await ProductService.shareByEmail(payload, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getSharingGroups = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await ProductService.getSharingGroups(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getSharingPurposes = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await ProductService.getSharingPurposes(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
