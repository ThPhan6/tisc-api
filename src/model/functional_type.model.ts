import Model from "./index";

export interface IFunctionalTypeAttributes {
  id: string;
  name: string;
  created_at: string;
  is_deleted: boolean;
}

export const FUNCTIONAL_TYPE_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  created_at: null,
  is_deleted: false,
};

export default class FunctionalTypeModel extends Model<IFunctionalTypeAttributes> {
  constructor() {
    super("functional_types");
  }
}
