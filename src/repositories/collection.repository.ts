import CollectionModel from "@/model/collection.models";
import {
  ICollectionAttributes,
  ListCollectionPaginate,
} from "@/types/collection.type";
import BaseRepository from "./base.repository";

class CollectionRepository extends BaseRepository<ICollectionAttributes> {
  protected model: CollectionModel;
  protected DEFAULT_ATTRIBUTE: Partial<ICollectionAttributes> = {
    id: "",
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
    brand_id: string
  ) {
    return (await this.model
      .select()
      .where("brand_id", "==", brand_id)
      .paginate(limit, offset)) as ListCollectionPaginate;
  }
}

export default CollectionRepository;
