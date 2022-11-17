import { errorMessageResponse } from "@/helper/response.helper";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { locationService } from "./location.service";
import { LocationRequest, UserAttributes, UserType } from "@/types";

export default class LocationController {
  private async validateBusinessNumber(
    user: UserAttributes,
    businessNumber: string
  ) {
    if (UserType.Designer !== user.type && businessNumber === "") {
      return false;
    }
    return true;
  }

  public create = async (
    req: Request & { payload: LocationRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;

    const user = req.auth.credentials.user as UserAttributes;

    const businessNumber = this.validateBusinessNumber(
      user,
      payload.business_number as string
    );

    if (!businessNumber) {
      return toolkit
        .response(errorMessageResponse("Business number is required"))
        .code(400);
    }

    const response = await locationService.create(user, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: LocationRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;

    const payload = req.payload;

    const user = req.auth.credentials.user as UserAttributes;

    const businessNumber = this.validateBusinessNumber(
      user,
      payload.business_number as string
    );

    if (!businessNumber) {
      return toolkit
        .response(errorMessageResponse("Business number is required"))
        .code(400);
    }

    const response = await locationService.update(user, id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await locationService.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort, order } = req.query;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await locationService.getList(
      user,
      limit,
      offset,
      sort,
      order,
      filter
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getListWithGroup = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await locationService.getListWithGroup(user);
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
    const user = req.auth.credentials.user as UserAttributes;
    const response = await locationService.delete(user, id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
