import FavouriteService from "./favourite.service";
import ProductService from "../product/product.services";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {
  RetrieveRequestBody,
  FavouriteListRequestQuery,
} from "./favourite.type";

export default class FavouriteController {
  private favoriteService: FavouriteService;
  constructor() {
    this.favoriteService = new FavouriteService();
  }

  public skip = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await this.favoriteService.skip(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public retrieve = async (
    req: Request & { payload: RetrieveRequestBody },
    toolkit: ResponseToolkit
  ) => {
    const { personal_email, mobile, phone_code } = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.favoriteService.retrieve(
      personal_email,
      mobile,
      phone_code,
      userId
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getFavoriteProductSummary = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await ProductService.getFavoriteProductSummary(userId);
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
    const userId = req.auth.credentials.user_id as string;
    const response = await ProductService.getFavouriteList(
      userId,
      order,
      filterBrandId,
      filterCategoryId
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
