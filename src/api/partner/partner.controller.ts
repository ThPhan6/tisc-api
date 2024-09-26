import partnerService from "@/api/partner/partner.service";
import { PartnerRequest } from "@/api/partner/partner.type";
import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";

export default class PartnerController {
  public create = async (req: Request, toolkit: ResponseToolkit) => {
    const payload = req.payload as PartnerRequest;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await partnerService.create(user, payload);
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

  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await partnerService.getOne(id, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getCompanySummary = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await partnerService.getCompanySummary(user.relation_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const payload = req.payload as PartnerRequest;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await partnerService.update(id, payload, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await partnerService.delete(id, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
