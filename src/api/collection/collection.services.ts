import { MESSAGES } from "@/constant/common.constant";
// import { ProductRepository } from "@/repositories/product.repository";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import ProductModel from "@/model/product.model";
import CollectionRepository from "@/repositories/collection.repository";
import MarketAvailabilityService from "../market_availability/market_availability.service";
import { successMessageResponse } from "./../../helper/response.helper";
import { ICollectionRequest } from "./collection.type";

export default class CollectionService {
  private marketAvailabilityService: MarketAvailabilityService;
  private productModel: ProductModel;
  private collectionRepository: CollectionRepository;
  // private productRepository: ProductRepository;
  constructor() {
    this.marketAvailabilityService = new MarketAvailabilityService();
    this.productModel = new ProductModel();
    this.collectionRepository = new CollectionRepository();
    // this.productRepository = new ProductRepository();
  }

  public async create(payload: ICollectionRequest) {
    const collection = await this.collectionRepository.findBy({
      name: payload.name,
      brand_id: payload.brand_id,
    });
    if (collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_EXISTED);
    }
    const createdCollection = await this.collectionRepository.create({
      name: payload.name,
      brand_id: payload.brand_id,
    });
    if (!createdCollection) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
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
    return successResponse({ data: createdCollection });
  }

  public async getList(brand_id: string, limit: number, offset: number) {
    const collections =
      await this.collectionRepository.getListCollectionWithPaginate(
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
    const collection = await this.collectionRepository.find(id);
    if (!collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_NOT_FOUND, 404);
    }
    // note: change productModel to productRepository
    const product = await this.productModel.findBy({
      collection_id: id,
    });
    if (product) {
      return errorMessageResponse(
        MESSAGES.CANNOT_DELETE_COLLECTION_HAS_PRODUCT
      );
    }
    const deletedCollection = await this.collectionRepository.delete(id);
    if (!deletedCollection) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  }
}
