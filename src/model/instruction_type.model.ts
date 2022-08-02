import Model from "./index";

export interface IInstructionTypeAttributes {
  id: string;
  name: string;
  created_at: string;
  is_deleted: boolean;
  design_id: string;
}

export const INSTRUCTION_TYPE_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  created_at: null,
  is_deleted: false,
  design_id: null,
};

export default class InstructionTypeModel extends Model<IInstructionTypeAttributes> {
  constructor() {
    super("instruction_types");
  }
  public findByNameOrId = async (id: string): Promise<any> => {
    try {
      const result = await this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereOrRevert(["id", "name"], id)
        .first();
      return result;
    } catch (error) {
      return false;
    }
  };
}
