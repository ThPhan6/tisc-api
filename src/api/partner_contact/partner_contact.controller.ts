import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import partnerContactService from "./partner_contact.service";
import { PartnerContactRequest } from "./partner_contact.type";

export default class PartnerContactController {
  public create = async (req: Request, toolkit: ResponseToolkit) => {
    const payload = req.payload as PartnerContactRequest;
    const response = await partnerContactService.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, sort, order, filter } = req.query;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await partnerContactService.getList(
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
    const response = await partnerContactService.getOne(id, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const payload = req.payload as PartnerContactRequest;
    const response = await partnerContactService.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await partnerContactService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
