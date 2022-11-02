import CollectionModel from "@/model/collection.model";
import { SortOrder } from "@/types";
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
    sort: string = "created_at",
    order: SortOrder = "DESC"
  ): Promise<ListCollectionPaginate> {
    return this.model
      .select()
      .where("brand_id", "==", brandId)
      .order(sort === "collection_name" ? "name" : sort, order)
      .paginate(limit, offset);
  }

  public async getByBrand(brandId: string) {
    return (await this.model
      .select()
      .where("brand_id", "==", brandId)
      .get()) as ICollectionAttributes[];
  }
}

export default new CollectionRepository();
