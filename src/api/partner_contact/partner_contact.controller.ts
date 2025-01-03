import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import partnerContactService from "./partner_contact.service";
import { PartnerContactRequest } from "./partner_contact.type";

export default class PartnerContactController {
  public create = async (req: Request, toolkit: ResponseToolkit) => {
    const payload = req.payload as PartnerContactRequest;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await partnerContactService.create(
      user,
      payload,
      req.path
    );
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

  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.params.id;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await partnerContactService.get(userId, user);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const payload = req.payload as PartnerContactRequest;
    const response = await partnerContactService.update(
      user,
      payload,
      req.path
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const userId = req.params.id;
    const response = await partnerContactService.delete(userId, user, req.path);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public invite = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await partnerContactService.invite(id, user);
    return toolkit.response(response).code(response.statusCode);
  };
}
