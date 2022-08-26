import Model from "./index";

export interface ICollectionAttributes {
  id: string;
  brand_id: string;
  name: string;
  created_at: string;
  is_deleted: boolean;
}

export const COLLECTION_NULL_ATTRIBUTES = {
  id: null,
  brand_id: null,
  name: null,
  created_at: null,
  is_deleted: false,
};

export default class CollectionModel extends Model<ICollectionAttributes> {
  constructor() {
    super("collections");
  }

  public getByIds = async (
    ids: string[]
  ): Promise<Pick<ICollectionAttributes, 'id' | 'name'>[]> => {
    try {
      const result = await this.getBuilder()
        .builder.whereIn("id", ids)
        .select(['id', 'name']);
      return result;
    } catch (error) {
      return [];
    }
  };
}
