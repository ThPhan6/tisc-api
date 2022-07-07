import Model from "./index";

export interface IPermissionAttributes {
  id: string;
  routes: { id: string; accessable: boolean }[];
  role_id: string;
  logo: string | null;
  name: string;
  accessable: boolean | null;
  number: number;
  parent_number: number | null;
  created_at: string | null;
  type: number;
  relation_id: string | null;
}
export const PERMISSION_NULL_ATTRIBUTES = {
  id: null,
  routes: [],
  role_id: null,
  logo: null,
  name: null,
  accessable: null,
  number: null,
  parent_number: null,
  created_at: null,
  type: null,
  relation_id: null,
};

export default class PermissionModel extends Model<IPermissionAttributes> {
  constructor() {
    super("permissions");
  }
}
