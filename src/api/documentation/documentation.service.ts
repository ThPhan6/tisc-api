import moment from "moment";
import { MESSAGES } from "../../constant/common.constant";
import DocumentationModel, {
  DOCUMENTATION_NULL_ATTRIBUTES,
} from "../../model/documentation.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  IDocumentationRequest,
  IDocumentationResponse,
  IDocumentationsResponse,
} from "./documentation.type";
class DocumentationService {
  private documentationModel: DocumentationModel;
  constructor() {
    this.documentationModel = new DocumentationModel();
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
      const createdDocumentation = await this.documentationModel.create({
        ...DOCUMENTATION_NULL_ATTRIBUTES,
        title: payload.title,
        document: payload.document,
        created_by: user_id,
        type: payload.type,
      });
      if (!createdDocumentation) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...rest } = createdDocumentation;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getList = (
    limit: number,
    offset: number,
    sort: string[]
  ): Promise<IDocumentationsResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const documentations = await this.documentationModel.getListWithoutFilter(
        sort,
        limit,
        offset
      );
      if (!documentations) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      const result = documentations.map((documentation: any) => {
        return {
          created_at: documentation.created_at,
          created_by: documentation.created_by,
          document: documentation.document,
          id: documentation.id,
          logo: documentation.logo,
          title: documentation.title,
          type: documentation.type,
          updated_at: documentation.updated_at,
          author: {
            id: documentation.author.id,
            firstname: documentation.author.firstname,
            lastname: documentation.author.lastname,
          },
        };
      });
      const pagination: IPagination =
        await this.documentationModel.getPagination(limit, offset);

      return resolve({
        data: {
          documentations: result,
          pagination,
        },
        statusCode: 200,
      });
    });
  };
  public getById = (
    id: string
  ): Promise<IDocumentationResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const result = await this.documentationModel.find(id);
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
      const documentation = await this.documentationModel.find(id);
      if (!documentation) {
        return resolve({
          message: MESSAGES.NOT_FOUND_DOCUMENTATION,
          statusCode: 404,
        });
      }
      const result = await this.documentationModel.update(id, payload);
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
      const documentation = await this.documentationModel.find(id);
      if (!documentation) {
        return resolve({
          message: MESSAGES.NOT_FOUND_DOCUMENTATION,
          statusCode: 404,
        });
      }
      const result = await this.documentationModel.update(id, {
        is_deleted: true,
      });
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

export default DocumentationService;
