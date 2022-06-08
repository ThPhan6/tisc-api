import Model from "./index";

export interface IAttributeAttributes {
  id: string;
  type: number;
  name: string;
  subs: any;
  created_at: string;
  is_deleted: boolean;
}
export const ATTRIBUTE_NULL_ATTRIBUTES = {
  id: null,
  type: null,
  name: null,
  subs: null,
  created_at: null,
  is_deleted: false,
};

export default class AttributeModel extends Model<IAttributeAttributes> {
  constructor() {
    super("attributes");
  }
}
