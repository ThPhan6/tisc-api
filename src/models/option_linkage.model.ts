import Model from "@/Database/Model";

export interface OptionLinkageAttribute {
  id: string;
  options: string;
  is_pair: boolean;
  created_at: string;
  created_by: string;
  updated_at: string | null;
}
export default class OptionLinkageModel extends Model<OptionLinkageAttribute> {
  protected table = "option_linkages";
  protected softDelete = true;
}
