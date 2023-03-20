import { CompanyPermissionAttributes } from "@/models/company_permission.model";
import { IPermissionAttributes } from "@/models/permission.model";

export interface CompanyPermissionWithInfo
  extends CompanyPermissionAttributes,
    Pick<IPermissionAttributes, "logo" | "name" | "parent_id"> {}

export interface RolePermission {
  accessable: boolean;
  id: string;
  name: string;
}

export interface CompanyPermissionList
  extends Pick<IPermissionAttributes, "logo" | "name" | "parent_id"> {
  id: string;
  items: RolePermission[];
  subs: CompanyPermissionList[];
}
