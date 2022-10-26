import { productService } from "./../product/product.service";
import {favouriteService} from "./favourite.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  RetrieveRequestBody,
  FavouriteListRequestQuery,
} from "./favourite.type";
import {UserAttributes} from '@/types';

export default class FavouriteController {

  public skip = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await favouriteService.skip(user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public retrieve = async (
    req: Request & { payload: RetrieveRequestBody },
    toolkit: ResponseToolkit
  ) => {
    const { personal_email, mobile, phone_code } = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await favouriteService.retrieve(
      personal_email,
      mobile,
      phone_code,
      user
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getFavoriteProductSummary = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await productService.getFavoriteProductSummary(user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getProductList = async (
    req: Request & { query: FavouriteListRequestQuery },
    toolkit: ResponseToolkit
  ) => {
    const { brand_id, category_id, order } = req.query;
    //
    let filterBrandId = brand_id;
    if (filterBrandId === "all") {
      filterBrandId = undefined;
    }
    //
    let filterCategoryId = category_id;
    if (filterCategoryId === "all") {
      filterCategoryId = undefined;
    }
    const user = req.auth.credentials.user as UserAttributes;
    const response = await productService.getFavouriteList(
      user,
      order,
      filterBrandId,
      filterCategoryId
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
