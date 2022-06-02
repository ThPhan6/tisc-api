export interface IPermission {
  logo: string | null;
  name: string;
  items: {
    id: string;
    name: string;
    accessable: boolean | null;
  }[];
  number: number;
  parent_number: number | null;
  subs?: any[];
}

export interface IPermissionResponse {
  data: IPermission;
  statusCode: number;
}
export interface IPermissionsResponse {
  data: IPermission[];
  statusCode: number;
}

export interface IMenu {
  logo: string | null;
  name: string;
  url: string | null;
  number: number;
  parent_number: number | null;
  subs?: any[];
}

export interface IMenuResponse {
  data: IMenu;
  statusCode: number;
}
export interface IMenusResponse {
  data: IMenu[];
  statusCode: number;
}
