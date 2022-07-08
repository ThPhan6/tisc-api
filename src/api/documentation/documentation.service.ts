import moment from "moment";
import { DOCUMENTATION_TYPES, MESSAGES } from "../../constant/common.constant";
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
        type: DOCUMENTATION_TYPES.GENERAL,
      });
      if (!createdDocumentation) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      await this.documentationModel.update(createdDocumentation.id, {
        updated_at: moment(),
      });
      const { is_deleted, ...rest } = createdDocumentation;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getList = (
    type: number,
    limit: number,
    offset: number,
    sort: any
  ): Promise<IDocumentationsResponse | any> => {
    return new Promise(async (resolve) => {
      const pagination: IPagination =
        await this.documentationModel.getPagination(limit, offset, { type });
      const documentations = await this.documentationModel.getAllBy({ type });
      if (type !== DOCUMENTATION_TYPES.GENERAL) {
        return resolve({
          data: {
            documentations: documentations.map((item) => {
              const { is_deleted, ...rest } = item;
              return rest;
            }),
            pagination,
          },
          statusCode: 200,
        });
      }
      const generalDocumentations =
        await this.documentationModel.getListWithoutFilter(
          type,
          limit,
          offset,
          sort
        );
      const result = generalDocumentations.map((documentation: any) => {
        return {
          id: documentation.id,
          title: documentation.title,
          updated_at: documentation.updated_at,
          author: {
            id: documentation.author.id,
            firstname: documentation.author.firstname,
            lastname: documentation.author.lastname,
          },
        };
      });
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
      const documentation = await this.documentationModel.find(id);
      if (!documentation) {
        return resolve({
          message: MESSAGES.NOT_FOUND_DOCUMENTATION,
          statusCode: 404,
        });
      }
      const { is_deleted, ...rest } = documentation;
      return resolve({
        data: rest,
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
      const updatedDocumentation =
        documentation.type === DOCUMENTATION_TYPES.GENERAL
          ? await this.documentationModel.update(id, {
              ...payload,
              updated_at: moment(),
            })
          : await this.documentationModel.update(id, {
              document: payload.document,
            });
      if (!updatedDocumentation) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...rest } = updatedDocumentation;
      return resolve({
        data: rest,
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
