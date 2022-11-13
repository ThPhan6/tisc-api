import Model from "@/Database/Model";
import {UserRole} from '@/types';

export interface CompanyPermissionAttributes {
  id: string;
  role_id: UserRole;
  relation_id: string | null;
  permission_id: string;
  accessable: boolean;
  created_at: string;
  updated_at: string | null;
}

export default class CompanyPermissionModel extends Model<CompanyPermissionAttributes> {
  protected table = 'company_permissions';
  protected softDelete = true;
}
