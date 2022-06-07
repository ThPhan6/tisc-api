import Model from "./index";

export interface ICollectionAttributes {
  id: string;
  name: string;
  created_at: string;
  is_deleted: boolean;
}

export const COLLECTION_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  created_at: null,
  is_deleted: false,
};

export default class CollectionModel extends Model<ICollectionAttributes> {
  constructor() {
    super("collections");
  }
}
