import CollectionModel from "@/model/collection.models";
import {
  ICollectionAttributes,
  ListCollectionPaginate,
} from "@/types/collection.type";
import BaseRepository from "./base.repository";

class CollectionRepository extends BaseRepository<ICollectionAttributes> {
  protected model: CollectionModel;
  protected DEFAULT_ATTRIBUTE: Partial<ICollectionAttributes> = {
    brand_id: "",
    name: "",
  };
  constructor() {
    super();
    this.model = new CollectionModel();
  }

  public async getListCollectionWithPaginate(
    limit: number,
    offset: number,
    brandId: string,
    sort?: any
  ) {
    if (sort) {
      return (await this.model
        .select()
        .where("brand_id", "==", brandId)
        .order(sort[0], sort[1])
        .paginate(limit, offset)) as ListCollectionPaginate;
    }
    return (await this.model
      .select()
      .where("brand_id", "==", brandId)
      .paginate(limit, offset)) as ListCollectionPaginate;
  }

  public async getByBrand(brandId: string) {
    return (await this.model
      .select()
      .where("brand_id", "==", brandId)
      .get()) as ICollectionAttributes[];
  }
}

export default CollectionRepository;
