import Model from "./index";

export interface IPermissionRouteAttributes {
  id: string;
  route: string;
}
export const PERMISSION_ROUTE_NULL_ATTRIBUTES = {
  id: null,
  route: null,
};

export default class PermissionModel extends Model<IPermissionRouteAttributes> {
  constructor() {
    super("permission_routes");
  }
}
