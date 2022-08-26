import Model from "./index";
import { removeUnnecessaryArangoFields } from "../query_builder";

export interface IMaterialCodeAttributes {
  id: string;
  name: string;
  subs: {
    id: string;
    name: string;
    codes: {
      id: string;
      code: string;
      description: string;
    }[];
  }[];
  created_at: string;
  is_deleted: boolean;
  design_id: string;
}

export const MATERIAL_CODE_NULL_ATTRIBUTES = {
  id: null,
  name: null,
  subs: [],
  created_at: null,
  is_deleted: false,
  design_id: null,
};
export default class MaterialCodeTipModel extends Model<IMaterialCodeAttributes> {
  constructor() {
    super("material_codes");
  }

  public getAllMaterialCodeByDesignId = async (
    designId: string
  ): Promise<IMaterialCodeAttributes[]> => {
    try {
      return this.getBuilder()
        .builder.whereNot("is_deleted", true)
        .whereOr("design_id", [designId, ""])
        .select();
    } catch (error) {
      return Promise.resolve([]);
    }
  }

  public getSubMaterialCodeById = async (
    codeId: string
  ): Promise<{id: string; code: string; description: string} | null> => {
    const rawQuery = `
      FOR data IN material_codes
        FOR sub IN data.subs
            FOR code IN sub.codes
                FILTER code.id == @codeId
      RETURN code
    `;
    const params = {codeId};
    let result: any = await this.getBuilder().raw(rawQuery, params);
    if (result._result && result._result[0]) {
      return removeUnnecessaryArangoFields(result._result[0]);
    }
    return null;
  }
}
