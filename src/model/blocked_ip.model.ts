import Model from "@/Database/Model";

export interface IBlockedIpAttributes {
  id: string;
  user_ip: string;
  blocked_type: number;
  count: number;
  created_at: string;
  updated_at: string | null;
}

export default class BlockedIpModel extends Model<IBlockedIpAttributes> {
  protected table = "blocked_ips";
  protected softDelete = false;
}
