import Model from "./index";

export interface IPermissionAttributes {
  id: string;
  routes: string[]
  role_id: string;
  type: number;
  relation_id: string | null;
  logo: string | null;
  name: string;
  accessable: boolean | null;
  url: string | null;
  number: number;
  parent_number: number | null;
  created_at: string | null;
}
export const PERMISSION_NULL_ATTRIBUTES = {
  id: null,
  routes: [],
  role_id: null,
  type: null,
  relation_id: null,
  logo: null,
  name: null,
  accessable: null,
  url: null,
  number: null,
  parent_number: null,
  created_at: null,
};

export default class PermissionModel extends Model<IPermissionAttributes> {
  constructor() {
    super("permissions");
  }
}
