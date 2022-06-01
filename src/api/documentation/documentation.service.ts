import moment from "moment";
import { MESSAGES } from "../../constant/common.constant";
import Documentation, {
  DOCUMENTATION_NULL_ATTRIBUTES,
} from "../../model/documentation.model";
import { IMessageResponse } from "../../type/common.type";
import {
  IDocumentationRequest,
  IDocumentationResponse,
  IDocumentationsResponse,
} from "./documentation.type";
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
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      const updated_at = moment().toISOString();
      const result = await this.documentation.create({
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        title: payload.title,
        document: payload.document,
        created_by: user_id,
        type: payload.type,
        updated_at,
        is_deleted: false,
      });
      if (!result) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
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
      const documentations = await this.documentation.list(
        limit,
        offset,
        filter,
        sort,
        join
      );
      if (!documentations) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      const result = documentations.map((documentation: any) => {
        const {
          _key,
          _id,
          _rev,
          id,
          role_id,
          location_id,
          email,
          phone,
          mobile,
          password,
          backup_email,
          personal_mobile,
          linkedin,
          is_verified,
          verification_token,
          reset_password_token,
          status,
          avatar,
          type,
          relation_id,
          ...rest
        } = documentation.created_by;
        return {
          ...documentation,
          created_by: documentation.created_by.id,
          author: rest,
        };
      });
      console.log(result, "[result]");
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
          message: MESSAGES.NOT_FOUND_DOCUMENTATION,
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
          message: MESSAGES.NOT_FOUND_DOCUMENTATION,
          statusCode: 404,
        });
      }
      const result = await this.documentation.update(id, payload);
      if (!result) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
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
          message: MESSAGES.NOT_FOUND_DOCUMENTATION,
          statusCode: 404,
        });
      }
      const result = await this.documentation.update(id, { isDeleted: true });
      if (!result) {
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

export default AgreementPoliciesTermsService;
