import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { customProductService } from "../custom_product/custom_product.service";
import { productService } from "./product.service";
import {
  IProductRequest,
  IUpdateProductRequest,
  ShareProductBodyRequest,
} from "./product.type";

export default class ProductController {
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { category_id, collection_id, brand_id } = req.query;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await productService.getBrandProductList(
      user,
      brand_id,
      category_id,
      collection_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  /// only for brand products
  public getBrandProductList = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { category_id, collection_id, brand_id } = req.query;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await productService.getBrandProductList(
      user,
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
    const { category_id, brand_id, name, sort, order, limit, offset } =
      req.query;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await productService.getListDesignerBrandProducts(
      user,
      brand_id,
      category_id,
      name,
      sort,
      order,
      limit,
      offset
    );
    return toolkit.response(response).code(response?.statusCode ?? 200);
  };
  public getBrandProductSummary = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { brand_id } = req.params;
    const { is_get_total_product } = req.query;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await productService.getBrandProductSummary(user, {
      brand_id,
      is_get_total_product,
    });
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await productService.get(id, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public duplicate = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await productService.duplicate(id, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public create = async (
    req: Request & { payload: IProductRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await productService.create(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IUpdateProductRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const { id } = req.params;
    const response = await productService.update(id, payload, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await productService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public likeOrUnlike = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await productService.likeOrUnlike(id, user);
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

  public shareByEmail = async (
    req: Request & { payload: ShareProductBodyRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = payload.custom_product
      ? await customProductService.shareByEmail(payload, user)
      : await productService.shareByEmail(payload, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
