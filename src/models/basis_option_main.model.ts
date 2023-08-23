import Model from "@/Database/Model";

export interface BasisOptionMainAttribute {
  id: string,
  name: string,
  basis_option_group_id: string
}
export default class BasisOptionMainModel extends Model<BasisOptionMainAttribute> {
  protected table = "basis_option_mains";
  protected softDelete = true;
}
