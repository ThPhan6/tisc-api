import Model from "./index";

export interface IPermissionDetailAttributes {
  id: string;
  permission_id: string;
  route: string;
  created_at: string;
}

export default class PermissionDetailModel extends Model<IPermissionDetailAttributes> {
  constructor() {
    super("permission_details");
  }

  public getPermissionDetailByRoute = async (
    permissionIds: string[],
    route: string
  ) => {
    try {
      const result: any = await this.builder
        .whereIn("permission_id", permissionIds)
        .where("route", route)
        .first();
      return result;
    } catch (error) {
      // console.log(error);
      return false;
    }
  };
}
