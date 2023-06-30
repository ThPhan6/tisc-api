import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from "@/helpers/response.helper";
import CollectionRepository from "@/repositories/collection.repository";
import ProductRepository from "@/repositories/product.repository";
import { marketAvailabilityRepository } from "@/repositories/market_availability.repository";
import { ICollectionRequest } from "./collection.type";
import { CollectionRelationType } from "@/types";
import { pagination } from "@/helpers/common.helper";
import { productService } from "../product/product.service";

class CollectionService {
  public async create(payload: ICollectionRequest) {
    const collection = await CollectionRepository.findBy({
      name: payload.name,
      relation_id: payload.relation_id,
      relation_type: payload.relation_type,
    });
    if (collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_EXISTED);
    }
    const createdCollection = await CollectionRepository.create({
      name: payload.name,
      relation_id: payload.relation_id,
      relation_type: payload.relation_type,
    });
    if (!createdCollection) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    //
    if (createdCollection.relation_type === CollectionRelationType.Brand) {
      /// create market availability
      await marketAvailabilityRepository.upsertMarketAvailability(
        createdCollection.id,
        payload.relation_id
      );
    }
    //
    return successResponse({ data: createdCollection });
  }

  public async getList(
    relation_id: string,
    type: CollectionRelationType,
    limit: number,
    offset: number,
    options?: {
      category_ids: string[];
    }
  ) {
    let hasColorCollection: boolean = false;
    if (options?.category_ids) {
      const isSupportedColorCollection = await
        productService.checkSupportedColorDetection(options.category_ids);
      if (isSupportedColorCollection) hasColorCollection = true;
    }
    const { collections, total } =
      await CollectionRepository.getListCollectionWithPaginate(
        limit,
        offset,
        relation_id,
        type,
        undefined,
        undefined,
        { has_color_collection: hasColorCollection }
      );
    return successResponse({
      data: {
        collections,
        pagination: pagination(limit, offset, total),
      },
    });
  }

  public async update(id: string, name: string) {
    const collection = await CollectionRepository.findAndUpdate(id, { name });
    if (!collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_NOT_FOUND, 404);
    }
    if (collection.relation_type === CollectionRelationType.Color) {
      return errorMessageResponse(MESSAGES.CANNOT_CHANGE_COLOR_COLLECTION, 400);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async delete(id: string) {
    const collection = await CollectionRepository.find(id);
    if (!collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_NOT_FOUND, 404);
    }
    if (collection.relation_type === CollectionRelationType.Color) {
      return errorMessageResponse(MESSAGES.CANNOT_CHANGE_COLOR_COLLECTION, 400);
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
    if (collection.relation_type === CollectionRelationType.Brand) {
      /// delete market availability
      await marketAvailabilityRepository.deleteBy({
        collection_id: collection.id,
      });
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export default new CollectionService();
