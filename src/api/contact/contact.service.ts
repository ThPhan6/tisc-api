import { IContactRequest } from "./contact.type";
import { IMessageResponse } from "../../type/common.type";
import ContactModel from "../../model/contact.model";
export default class ContactService {
  private contactModel: ContactModel;
  constructor() {
    this.contactModel = new ContactModel();
  }

  public create = (payload: IContactRequest): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      await this.contactModel.create({
        name: payload.name,
        email: payload.email,
        inquity: payload.inquity,
      });
      return resolve({
        message: "SUCCESS",
        statusCode: 200,
      });
    });
  };
}
