import { IContactRequest } from "./contact.type";
import { Request, ResponseToolkit } from "@hapi/hapi";
import ContactService from "./contact.services";
export default class ContactController {
  private service: ContactService;
  constructor() {
    this.service = new ContactService();
  }
  public create = async (
    req: Request & { payload: IContactRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { filter, limit, offset, sort } = req.query;
    const response = await this.service.getList(limit, offset, filter, sort);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getById = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getById(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
