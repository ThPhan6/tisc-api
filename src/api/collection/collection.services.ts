import { MESSAGES } from "@/constant/common.constant";
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from "@/helper/response.helper";
import CollectionRepository from "@/repositories/collection.repository";
import ProductRepository from "@/repositories/product.repository";
import MarketAvailabilityServices from "../market_availability/market_availability.services";
import { ICollectionRequest } from "./collection.type";
class CollectionService {
  constructor() {}

  public async create(payload: ICollectionRequest) {
    const collection = await CollectionRepository.findBy({
      name: payload.name,
      brand_id: payload.brand_id,
    });
    if (collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_EXISTED);
    }
    const createdCollection = await CollectionRepository.create({
      name: payload.name,
      brand_id: payload.brand_id,
    });
    if (!createdCollection) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    const authorizedBrandCountries =
      await MarketAvailabilityServices.getBrandRegionCountries(
        payload.brand_id
      );
    await MarketAvailabilityServices.create({
      collection_id: createdCollection.id,
      country_ids: authorizedBrandCountries.map((item) =>
        item.id.toLowerCase()
      ),
    });
    return successResponse({ data: createdCollection });
  }

  public async getList(brand_id: string, limit: number, offset: number) {
    const collections =
      await CollectionRepository.getListCollectionWithPaginate(
        limit,
        offset,
        brand_id
      );
    return successResponse({
      data: {
        collections: collections.data,
        pagination: collections.pagination,
      },
    });
  }

  public async delete(id: string) {
    const collection = await CollectionRepository.find(id);
    if (!collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_NOT_FOUND, 404);
    }
    const product = await ProductRepository.findBy({
      collection_id: id,
    });
    if (product) {
      return errorMessageResponse(
        MESSAGES.CANNOT_DELETE_COLLECTION_HAS_PRODUCT
      );
    }
    const deletedCollection = await CollectionRepository.delete(id);
    if (!deletedCollection) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export default new CollectionService();
