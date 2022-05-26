import Model from "./index";

export interface IPermissionAttributes {
  id: string;
  role_id: string;
  type: number;
  relation_id?: string;
  logo?: string;
  name: string;
  accessable: boolean | null;
  url?: string;
  number: number;
  parent_number: number | null;
  created_at?: string;
}

export default class PermissionModel extends Model<IPermissionAttributes> {
  constructor() {
    super("permissions");
  }
}
