import { Request, ResponseToolkit } from "@hapi/hapi";
import { productService } from "./product.services";
import {
  IProductAssignToProject,
  IProductRequest,
  IUpdateProductRequest,
  ShareProductBodyRequest,
} from "./product.type";

export default class ProductController {
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { category_id, collection_id, brand_id } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await productService.getList(
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
    const response = await productService.getListDesignerBrandProducts(
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
    const response = await productService.getBrandProductSummary(brand_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await productService.get(id, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public duplicate = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await productService.duplicate(id, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public create = async (
    req: Request & { payload: IProductRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await productService.create(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IUpdateProductRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const { id } = req.params;
    const response = await productService.update(id, payload, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await productService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public likeOrUnlike = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await productService.likeOrUnlike(id, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getListRestCollectionProduct = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await productService.getListRestCollectionProduct(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getProductOptions = async (req: Request, toolkit: ResponseToolkit) => {
    const { id, attribute_id } = req.params;
    const response = await productService.getProductOptions(id, attribute_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public assign = async (
    req: Request & { payload: IProductAssignToProject },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await productService.assign(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public shareByEmail = async (
    req: Request & { payload: ShareProductBodyRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await productService.shareByEmail(payload, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getSharingGroups = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await productService.getSharingGroups(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getSharingPurposes = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await productService.getSharingPurposes(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
