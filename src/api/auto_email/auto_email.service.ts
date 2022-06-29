import { MESSAGES } from "../../constant/common.constant";
import AutoEmailModel, {
  IAutoEmailAttributes,
} from "../../model/auto_email.model";
import { IMessageResponse } from "../../type/common.type";
import {
  IAutoEmailResponse,
  IAutoEmailsResponse,
  IUpdateAutoEmailRequest,
} from "./auto_email.type";
export default class AutoEmailService {
  private autoEmailModel: AutoEmailModel;
  constructor() {
    this.autoEmailModel = new AutoEmailModel();
  }
  public update = async (
    id: string,
    payload: IUpdateAutoEmailRequest
  ): Promise<IMessageResponse | IAutoEmailResponse> => {
    return new Promise(async (resolve) => {
      const foundAutoEmail = await this.autoEmailModel.find(id);
      if (!foundAutoEmail) {
        return resolve({
          message: MESSAGES.AUTO_EMAIL_NOT_FOUND,
          statusCode: 404,
        });
      }
      const updatedAutoEmail = await this.autoEmailModel.update(id, payload);
      if (!updatedAutoEmail) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...rest } = updatedAutoEmail;

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
  ): Promise<IMessageResponse | IAutoEmailsResponse> => {
    return new Promise(async (resolve) => {
      const autoEmails = await this.autoEmailModel.list(
        limit,
        offset,
        filter,
        sort
      );
      if (!autoEmails) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      const result = autoEmails.map((item: IAutoEmailAttributes) => {
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
  ): Promise<IMessageResponse | IAutoEmailResponse> => {
    return new Promise(async (resolve) => {
      const autoEmail = await this.autoEmailModel.find(id);
      if (!autoEmail) {
        return resolve({
          message: MESSAGES.AUTO_EMAIL_NOT_FOUND,
          statusCode: 404,
        });
      }
      const { is_deleted, ...rest } = autoEmail;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };
}
