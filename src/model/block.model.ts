import Model from "@/Database/Model";

export interface IBlockAttributes {
  id: string;
  ip: string;
  form_type: number;
  count: number;
  blocked_at: string | null;
  created_at: string;
  updated_at: string | null;
}

export default class BlockModel extends Model<IBlockAttributes> {
  protected table = "blocks";
  protected softDelete = false;
}
