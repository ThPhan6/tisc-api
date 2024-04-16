import Model from "@/Database/Model";

export interface AdditionalSubGroupAttribute {
  id: string;
  name: string;
  type: AdditionalSubGroupType;
  relation_id: string;
}
export enum AdditionalSubGroupType {
  Preset,
  GeneralAttribute,
  FeatureAttribute,
  Specification,
}
export default class AdditionalSubGroupModel extends Model<AdditionalSubGroupAttribute> {
  protected table = "additional_sub_groups";
  protected softDelete = true;
}
