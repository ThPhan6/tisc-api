import Model from "@/Database/Model";
import {RoleTypeValue} from '@/types';

export interface IPermissionAttributes {
  id: string;
  logo: string | null;
  name: string;
  parent_id: string | null;
  type: RoleTypeValue;
  routes: string[];
  created_at: string;
  updated_at: string | null;
}

export default class PermissionModel extends Model<IPermissionAttributes> {
  protected table = 'permissions';
  protected softDelete = true;
}
