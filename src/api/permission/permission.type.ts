export interface IPermission {
  id: string;
  role_id: string;
  type: number;
  relation_id: string | null;
  logo: string | null;
  name: string;
  accessable: boolean | null;
  url: string | null;
  created_at: string | null;
  number: number;
  parent_number: number | null;
  subs?: any;
}

export interface IPermissionResponse {
  data: IPermission;
  statusCode: number;
}
export interface IPermissionsResponse {
  data: IPermission[];
  statusCode: number;
}
