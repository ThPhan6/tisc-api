import {
  IQuotationAttributes,
  QUOTATION_NULL_ATTRIBUTES,
} from "./../../model/quotation.model";
import { MESSAGES } from "../../constant/common.constant";
import { countWord } from "../../helper/common.helper";
import QuotationModel from "../../model/quotation.model";
import { IMessageResponse } from "./../../type/common.type";
import {
  IQuotationRequest,
  IQuotationResponse,
  IQuotationsResponse,
} from "./quotation.type";
export default class QuotationService {
  private quotationModel: QuotationModel;
  constructor() {
    this.quotationModel = new QuotationModel();
  }
  public create = async (
    payload: IQuotationRequest
  ): Promise<IMessageResponse | IQuotationResponse> => {
    return new Promise(async (resolve) => {
      if (countWord(payload.quotation) > 120) {
        return resolve({
          message: MESSAGES.QUOTATION_MAX_WORD,
          statusCode: 400,
        });
      }
      const createdQuotation = await this.quotationModel.create({
        ...QUOTATION_NULL_ATTRIBUTES,
        author: payload.author,
        identity: payload.identity,
        quotation: payload.quotation,
      });
      if (!createdQuotation) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...rest } = createdQuotation;
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
  ): Promise<IMessageResponse | IQuotationsResponse> => {
    return new Promise(async (resolve) => {
      const quotations = await this.quotationModel.list(
        limit,
        offset,
        filter,
        sort
      );
      if (!quotations) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      const result = quotations.map((item: IQuotationAttributes) => {
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
  ): Promise<IMessageResponse | IQuotationResponse> => {
    return new Promise(async (resolve) => {
      const quotation = await this.quotationModel.find(id);
      if (!quotation) {
        return resolve({
          message: MESSAGES.QUOTATION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const { is_deleted, ...rest } = quotation;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };
  public update = async (
    id: string,
    payload: IQuotationRequest
  ): Promise<IMessageResponse | IQuotationResponse> => {
    return new Promise(async (resolve) => {
      const quotation = await this.quotationModel.find(id);
      if (!quotation) {
        return resolve({
          message: MESSAGES.QUOTATION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const updatedQuotation = await this.quotationModel.update(id, payload);
      if (!updatedQuotation) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...rest } = updatedQuotation;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };
  public delete = async (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const foundQuotation = await this.quotationModel.find(id);
      if (!foundQuotation) {
        return resolve({
          message: MESSAGES.QUOTATION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const updatedQuotation = await this.quotationModel.update(id, {
        is_deleted: true,
      });
      if (!updatedQuotation) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_DELETE,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
}
