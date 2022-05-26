import moment from "moment";
import { IMessageResponse } from "../../type/common.type";
import {
  IDocumentationRequest,
  IDocumentationResponse,
  IDocumentationsResponse,
} from "./documentation.type";
import Documentation from "../../model/documentation.model";

class AgreementPoliciesTermsService {
  private documentation: Documentation;
  constructor() {
    this.documentation = new Documentation();
  }

  public create = (
    payload: IDocumentationRequest,
    user_id: string
  ): Promise<IDocumentationResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      if (!user_id) {
        return resolve({
          message: "Something wrong, please try again!",
          statusCode: 400,
        });
      }
      const updated_at = moment().toISOString();
      const result = await this.documentation.create({
        title: payload.title,
        document: payload.document,
        created_by: user_id,
        logo: null,
        type: null,
        updated_at,
      });
      if (!result) {
        return resolve({
          message: "Something wrong when create, please try again!",
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
  ): Promise<IDocumentationsResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const join = {
        key: "created_by",
        collection: "users",
      };
      const result = await this.documentation.list(
        limit,
        offset,
        filter,
        sort,
        join
      );
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
  ): Promise<IDocumentationResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const result = await this.documentation.find(id);
      if (!result) {
        return resolve({
          message: "Not found documentation, please try again!",
          statusCode: 404,
        });
      }
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public update = (
    id: string,
    payload: IDocumentationRequest
  ): Promise<IDocumentationResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const documentation = await this.documentation.find(id);
      if (!documentation) {
        return resolve({
          message: "Not found documentation, please try again!",
          statusCode: 404,
        });
      }
      const result = await this.documentation.update(id, payload);
      if (!result) {
        return resolve({
          message: "Something wrong when update, please try again!",
          statusCode: 400,
        });
      }
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public delete = (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const documentation = await this.documentation.find(id);
      if (!documentation) {
        return resolve({
          message: "Not found documentation, please try again!",
          statusCode: 404,
        });
      }
      const result = await this.documentation.delete(id);
      if (!result) {
        return resolve({
          message: "Something wrong when delete, please try again!",
          statusCode: 400,
        });
      }
      return resolve({
        message: "Success",
        statusCode: 200,
      });
    });
  };
}

export default AgreementPoliciesTermsService;
