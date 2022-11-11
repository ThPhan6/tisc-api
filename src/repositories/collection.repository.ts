import CollectionModel from "@/model/collection.model";
import {
  SortOrder,
  ICollectionAttributes,
  ListCollectionPaginate,
} from "@/types";
import BaseRepository from "./base.repository";
import { CollectionRelationType } from "@/types";

class CollectionRepository extends BaseRepository<ICollectionAttributes> {
  protected model: CollectionModel;
  protected DEFAULT_ATTRIBUTE: Partial<ICollectionAttributes> = {
    name: "",
    relation_id: "",
    relation_type: CollectionRelationType.Brand,
  };
  constructor() {
    super();
    this.model = new CollectionModel();
  }

  public async getListCollectionWithPaginate(
    limit: number,
    offset: number,
    relation_id: string,
    relation_type: CollectionRelationType,
    sort: string = "created_at",
    order: SortOrder = "DESC"
  ): Promise<ListCollectionPaginate> {
    return this.model
      .select()
      .where("relation_id", "==", relation_id)
      .where("relation_type", "==", relation_type)
      .order(sort === "collection_name" ? "name" : sort, order)
      .paginate(limit, offset);
  }

  public async getByRelation(
    relation_id: string,
    relation_type: CollectionRelationType
  ) {
    return (await this.model
      .select()
      .where("relation_id", "==", relation_id)
      .where("relation_type", "==", relation_type)
      .get()) as ICollectionAttributes[];
  }
}

export default new CollectionRepository();
