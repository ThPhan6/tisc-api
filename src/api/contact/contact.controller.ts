import { IContactRequest } from "./contact.type";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {contactService} from "./contact.service";

export default class ContactController {

  public create = async (
    req: Request & { payload: IContactRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await contactService.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { filter, limit, offset, sort } = req.query;
    const response = await contactService.getList(limit, offset, filter, sort);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getById = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await contactService.getById(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
