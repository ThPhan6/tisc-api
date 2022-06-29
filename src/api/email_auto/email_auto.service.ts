import { MESSAGES } from "./../../constant/common.constant";
import EmailAutoModel, {
  IEmailAutoAttributes,
} from "../../model/email_autoresponder.model";
import { IMessageResponse } from "./../../type/common.type";
import {
  IEmailAutoResponse,
  IEmailsAutoResponse,
  IUpdateEmailAutoRequest,
} from "./email_auto.type";
export default class EmailAutoService {
  private emailAutoModel: EmailAutoModel;
  constructor() {
    this.emailAutoModel = new EmailAutoModel();
  }
  public update = async (
    id: string,
    payload: IUpdateEmailAutoRequest
  ): Promise<IMessageResponse | IEmailAutoResponse> => {
    return new Promise(async (resolve) => {
      const foundEmailAuto = await this.emailAutoModel.find(id);
      if (!foundEmailAuto) {
        return resolve({
          message: MESSAGES.EMAIL_AUTO_NOT_FOUND,
          statusCode: 404,
        });
      }
      const updatedEmailAuto = await this.emailAutoModel.update(id, payload);
      if (!updatedEmailAuto) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...rest } = updatedEmailAuto;

      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getList = async (
    limit: number,
    offset: number,
    filter: any,
    sort: any
  ): Promise<IMessageResponse | IEmailsAutoResponse> => {
    return new Promise(async (resolve) => {
      const emailsAuto = await this.emailAutoModel.list(
        limit,
        offset,
        filter,
        sort
      );
      if (!emailsAuto) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      const result = emailsAuto.map((item: IEmailAutoAttributes) => {
        const { is_deleted, ...rest } = item;
        return rest;
      });
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };

  public getOne = async (
    id: string
  ): Promise<IMessageResponse | IEmailAutoResponse> => {
    return new Promise(async (resolve) => {
      const emailAuto = await this.emailAutoModel.find(id);
      if (!emailAuto) {
        return resolve({
          message: MESSAGES.EMAIL_AUTO_NOT_FOUND,
          statusCode: 404,
        });
      }
      const { is_deleted, ...rest } = emailAuto;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };
}
