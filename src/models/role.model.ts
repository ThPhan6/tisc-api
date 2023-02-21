import Model from "@/Database/Model";

export interface RoleAttributes {
  id: string;
  name: string;
}

export default class RoleModel extends Model<RoleAttributes> {
  protected table = 'roles';
  protected softDelete = true;
}
