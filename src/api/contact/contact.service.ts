import {
  IContactRequest,
  IContactResponse,
  IContactsResponse,
} from "./contact.type";
import { IMessageResponse } from "../../type/common.type";
import ContactModel from "../../model/contact.model";
export default class ContactService {
  private contactModel: ContactModel;
  constructor() {
    this.contactModel = new ContactModel();
  }

  public create = (
    payload: IContactRequest
  ): Promise<IContactResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const result = await this.contactModel.create({
        name: payload.name,
        email: payload.email,
        inquity: payload.inquity || null,
      });
      if (!result) {
        return resolve({
          message: "Something wrong, please try again!",
          statusCode: 400,
        });
      }
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };

  public getList = (
    limit: number,
    offset: number,
    filter: any,
    sort: any
  ): Promise<IContactsResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const result = await this.contactModel.list(limit, offset, filter, sort);
      if (!result) {
        return resolve({
          message: "Something wrong, please try again!",
          statusCode: 400,
        });
      }
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public getById = (
    id: string
  ): Promise<IContactResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const result = await this.contactModel.find(id);
      if (!result) {
        return resolve({
          message: "Not found contact, please try again!",
          statusCode: 404,
        });
      }
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
}
