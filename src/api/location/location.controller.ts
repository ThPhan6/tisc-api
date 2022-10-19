import { errorMessageResponse } from "@/helper/response.helper";
import { SYSTEM_TYPE } from "@/constants";
import { userRepository } from "@/repositories/user.repository";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { locationService } from "./location.service";
import { ILocationRequest } from "./location.type";

export default class LocationController {
  private async validateBusinessNumber(userId: string, businessNumber: string) {
    const user = await userRepository.find(userId);
    if (user && SYSTEM_TYPE.DESIGN !== user.type && businessNumber === "") {
      return false;
    }
    return true;
  }

  public create = async (
    req: Request & { payload: ILocationRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;

    const userId = req.auth.credentials.user_id as string;

    const businessNumber = this.validateBusinessNumber(
      userId,
      payload.business_number as string
    );

    if (!businessNumber) {
      return toolkit
        .response(errorMessageResponse("Business number is required"))
        .code(400);
    }

    const response = await locationService.create(userId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: ILocationRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;

    const payload = req.payload;

    const userId = req.auth.credentials.user_id as string;

    const businessNumber = this.validateBusinessNumber(
      userId,
      payload.business_number as string
    );

    if (!businessNumber) {
      return toolkit
        .response(errorMessageResponse("Business number is required"))
        .code(400);
    }

    const response = await locationService.update(userId, id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await locationService.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort, order } = req.query;
    const userId = req.auth.credentials.user_id as string;
    const response = await locationService.getList(
      userId,
      limit,
      offset,
      sort,
      order,
      filter
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getListWithGroup = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await locationService.getListWithGroup(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getMarketLocationGroupByCountry = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { product_id } = req.params;
    const response = await locationService.getMarketLocationGroupByCountry(
      product_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getCompanyLocationGroupByCountry = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { brand_id, design_id } = req.params;
    const response = await locationService.getCompanyLocationGroupByCountry(
      brand_id || design_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await locationService.delete(userId, id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
