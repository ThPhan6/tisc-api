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
import MarketAvailabilityService from "../../api/market_availability/market_availability.service";

export default class CollectionService {
  private collectionModel: CollectionModel;
  private marketAvailabilityService: MarketAvailabilityService;
  constructor() {
    this.collectionModel = new CollectionModel();
    this.marketAvailabilityService = new MarketAvailabilityService();
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
      const authorizedBrandCountries =
        await this.marketAvailabilityService.getBrandRegionCountries(
          payload.brand_id
        );
      await this.marketAvailabilityService.create({
        collection_id: createdCollection.id,
        country_ids: authorizedBrandCountries.map((item) =>
          item.id.toLowerCase()
        ),
      });
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
  ): Promise<ICollectionsResponse> => {
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
  public delete = (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const collection = await this.collectionModel.find(id);
      if (!collection) {
        return resolve({
          message: MESSAGES.COLLECTION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const result = await this.collectionModel.update(id, {
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
