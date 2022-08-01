import Model from "./index";

export interface IMaterialCodeAttributes {
  id: string;
  name: string;
  subs: {
    id: string;
    name: string;
    codes: {
      id: string;
      code: string;
      description: string;
    }[];
  }[];
  created_at: string;
  is_deleted: boolean;
  design_id: string;
}

export const MATERIAL_CODE_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  subs: [],
  created_at: null,
  is_deleted: false,
  design_id: null,
};
export default class MaterialCodeTipModel extends Model<IMaterialCodeAttributes> {
  constructor() {
    super("material_codes");
  }
}
