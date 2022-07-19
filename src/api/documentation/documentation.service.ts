import moment from "moment";
import { DOCUMENTATION_TYPES, MESSAGES } from "../../constant/common.constant";
import DocumentationModel, {
  DOCUMENTATION_NULL_ATTRIBUTES,
} from "../../model/documentation.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  IAllHowtoResponse,
  IDocumentationRequest,
  IDocumentationResponse,
  IDocumentationsResponse,
  IHowto,
  IHowtosResponse,
} from "./documentation.type";
import UserModel from "../../model/user.model";
class DocumentationService {
  private documentationModel: DocumentationModel;
  private userModel: UserModel;
  constructor() {
    this.documentationModel = new DocumentationModel();
    this.userModel = new UserModel();
  }

  public create = (
    payload: IDocumentationRequest,
    user_id: string
  ): Promise<IDocumentationResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
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
    limit: number,
    offset: number,
    sort: any
  ): Promise<IDocumentationsResponse | any> => {
    return new Promise(async (resolve) => {
      const pagination: IPagination =
        await this.documentationModel.getPagination(limit, offset, {
          type: DOCUMENTATION_TYPES.GENERAL,
        });

      const generalDocumentations =
        await this.documentationModel.getListWithoutFilter(
          DOCUMENTATION_TYPES.GENERAL,
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
  public getAllHowto = (): Promise<IAllHowtoResponse> => {
    return new Promise(async (resolve) => {
      const tiscHowtos = await this.documentationModel.getAllBy(
        {
          type: DOCUMENTATION_TYPES.TISC_HOW_TO,
        },
        ["id", "title", "logo", "document", "created_at"],
        "created_at",
        "ASC"
      );
      const brandHowtos = await this.documentationModel.getAllBy(
        {
          type: DOCUMENTATION_TYPES.BRAND_HOW_TO,
        },
        ["id", "title", "logo", "document", "created_at"],
        "created_at",
        "ASC"
      );
      const designHowtos = await this.documentationModel.getAllBy(
        {
          type: DOCUMENTATION_TYPES.DESIGN_HOW_TO,
        },
        ["id", "title", "logo", "document", "created_at"],
        "created_at",
        "ASC"
      );
      return resolve({
        data: {
          tisc: tiscHowtos,
          brand: brandHowtos,
          design: designHowtos,
        },
        statusCode: 200,
      });
    });
  };
  public getHowto = (user_id: string): Promise<IHowtosResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const result = await this.documentationModel.getAllBy(
        {
          type: user.type + 1,
        },
        ["id", "title", "logo", "document", "created_at"],
        "created_at",
        "ASC"
      );

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
  public updateHowto = (payload: {
    data: IHowto[];
  }): Promise<IHowtosResponse> =>
    new Promise(async (resolve) => {
      const updatedHowtos = await Promise.all(
        payload.data.map(async (howto) => {
          return await this.documentationModel.update(howto.id, {
            title: howto.title,
            document: howto.document,
          });
        })
      );
      const firstHowto = await this.documentationModel.find(
        payload.data[0]?.id
      );
      if (!firstHowto) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const howtos = await this.documentationModel.getAllBy(
        { type: firstHowto.type },
        ["id", "title", "document", "created_at"],
        "created_at",
        "DESC"
      );
      return resolve({
        data: howtos,
        statusCode: 200,
      });
    });
  public delete = (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const documentation = await this.documentationModel.find(id);
      if (!documentation) {
        return resolve({
          message: MESSAGES.NOT_FOUND_DOCUMENTATION,
          statusCode: 404,
        });
      }
      if (documentation.type !== DOCUMENTATION_TYPES.GENERAL) {
        return resolve({
          message: "Cannot delete how to documentation",
          statusCode: 400,
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
