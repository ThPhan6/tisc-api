import partnerService from "@/api/partner/partner.service";
import { UserAttributes } from "@/types";
import { PartnerAttributes } from "@/types/partner.type";
import { Request, ResponseToolkit } from "@hapi/hapi";

export default class PartnerController {
  public create = async (req: Request, toolkit: ResponseToolkit) => {
    const payload = req.payload;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await partnerService.create(
      user,
      payload as PartnerAttributes
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, sort, order, filter } = req.query;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await partnerService.getList(
      user,
      limit,
      offset,
      filter,
      sort,
      order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
