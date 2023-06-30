import CollectionModel from "@/models/collection.model";
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
    order: SortOrder = "DESC",
    options?: {
      has_color_collection: boolean;
    }
  ): Promise<{ collections: any; total: number }> {
    const str = `
      LET total = FIRST(
        FOR collections IN collections
        FILTER collections.deleted_at == null
        FILTER ${
          options?.has_color_collection === true
            ? "collections.relation_type == @color_collection_type or"
            : ""
        } (collections.relation_type == @relation_type and collections.relation_id == @relation_id)
        COLLECT WITH COUNT INTO length RETURN length
      )
      LET collections = (
        FOR collections IN collections
        FILTER collections.deleted_at == null
        FILTER ${
          options?.has_color_collection === true
            ? "collections.relation_type == @color_collection_type or"
            : ""
        } (collections.relation_type == @relation_type and collections.relation_id == @relation_id)
        SORT collections.@sort @order LIMIT @offset, @limit
        RETURN UNSET(collections, ["_id","_key","_rev","deleted_at","deleted_by","is_deleted"])
      )
      RETURN {
        collections,
        total
      }`;
    let bindingObj: any = {};
    if (options?.has_color_collection === true) {
      bindingObj = {
        color_collection_type: CollectionRelationType.Color,
        relation_type,
        relation_id,
        sort,
        order,
        offset,
        limit,
      };
    } else {
      bindingObj = {
        relation_type,
        relation_id,
        sort,
        order,
        offset,
        limit,
      };
    }

    const result = await this.model.rawQueryV2(str, bindingObj);
    return result[0];
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
export const collectionRepository = new CollectionRepository();
