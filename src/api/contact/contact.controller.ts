import { IContactRequest } from "./contact.type";
import { Request, ResponseToolkit } from "@hapi/hapi";
import ContactService from "./contact.service";
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
}
