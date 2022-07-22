import Model from "./index";

export interface IDepartmentAttributes {
  id: string;
  name: string;
  created_at: string;
  is_deleted: boolean;
  type: number;
  relation_id: string | null;
}

export const DEPARTMENT_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  created_at: null,
  is_deleted: false,
  type: null,
  relation_id: null,
};

export default class DepartmentModel extends Model<IDepartmentAttributes> {
  constructor() {
    super("departments");
  }
}
