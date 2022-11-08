import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from "@/helper/response.helper";
import CollectionRepository from "@/repositories/collection.repository";
import ProductRepository from "@/repositories/product.repository";
import { marketAvailabilityService } from "../market_availability/market_availability.service";
import { ICollectionRequest } from "./collection.type";
import {CollectionRelationType} from '@/types';

class CollectionService {

  public async create(payload: ICollectionRequest) {
    const collection = await CollectionRepository.findBy({
      name: payload.name,
      relation_id: payload.relation_id,
      relation_type: payload.relation_type
    });
    if (collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_EXISTED);
    }
    const createdCollection = await CollectionRepository.create({
      name: payload.name,
      relation_id: payload.relation_id,
      relation_type: payload.relation_type
    });
    if (!createdCollection) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    const authorizedBrandCountries =
      await marketAvailabilityService.getBrandRegionCountries(payload.relation_id);
    await marketAvailabilityService.create({
      collection_id: createdCollection.id,
      country_ids: authorizedBrandCountries.map((item) =>
        item.id.toLowerCase()
      ),
    });
    return successResponse({ data: createdCollection });
  }

  public async getList(
    relation_id: string,
    type: CollectionRelationType,
    limit: number,
    offset: number
  ) {
    const collections =
      await CollectionRepository.getListCollectionWithPaginate(
        limit,
        offset,
        relation_id,
        type
      );
    return successResponse({
      data: {
        collections: collections.data,
        pagination: collections.pagination,
      },
    });
  }

  public async update(id: string, name: string) {
    const collection = await CollectionRepository.findAndUpdate(id, { name });
    if (!collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_NOT_FOUND, 404);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
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
