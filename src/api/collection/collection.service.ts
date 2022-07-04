import { MESSAGES } from "../../constant/common.constant";
import CollectionModel, {
  COLLECTION_NULL_ATTRIBUTES,
  ICollectionAttributes,
} from "../../model/collection.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  ICollectionRequest,
  ICollectionResponse,
  ICollectionsResponse,
} from "./collection.type";

export default class CollectionService {
  private collectionModel: CollectionModel;
  constructor() {
    this.collectionModel = new CollectionModel();
  }
  public create = (
    payload: ICollectionRequest
  ): Promise<IMessageResponse | ICollectionResponse> => {
    return new Promise(async (resolve) => {
      const collection = await this.collectionModel.findBy({
        name: payload.name,
      });
      if (collection) {
        return resolve({
          message: MESSAGES.COLLECTION_EXISTED,
          statusCode: 400,
        });
      }
      const createdCollection = await this.collectionModel.create({
        ...COLLECTION_NULL_ATTRIBUTES,
        name: payload.name,
        brand_id: payload.brand_id,
      });
      if (!createdCollection) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { is_deleted, ...result } = createdCollection;
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public getList = (
    brand_id: string,
    limit: number,
    offset: number
  ): Promise<IMessageResponse | ICollectionsResponse> => {
    return new Promise(async (resolve) => {
      const collections: ICollectionAttributes[] =
        await this.collectionModel.list(limit, offset, { brand_id });
      const pagination: IPagination = await this.collectionModel.getPagination(
        limit,
        offset,
        { brand_id }
      );

      if (!collections) {
        return resolve({
          data: {
            collections: [],
            pagination,
          },
          statusCode: 200,
        });
      }
      const result = collections.map((collection: ICollectionAttributes) => {
        const { is_deleted, ...item } = collection;
        return item;
      });

      return resolve({
        data: {
          collections: result,
          pagination,
        },
        statusCode: 200,
      });
    });
  };
}
