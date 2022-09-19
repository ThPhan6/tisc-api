import {
  IMaterialCodeAttributes,
  ICodeAttribute,
} from "@/types/material_code.type";
import BaseRepository from "./base.repository";
import MaterialCodeModel from "@/model/material_code.models";

class MaterialCodeRepository extends BaseRepository<IMaterialCodeAttributes> {
  protected model: MaterialCodeModel;
  protected DEFAULT_ATTRIBUTE: Partial<IMaterialCodeAttributes> = {
    name: "",
    subs: [],
    created_at: "",
    design_id: "",
  };
  constructor() {
    super();
    this.model = new MaterialCodeModel();
  }

  public async getAllMaterialCodeByDesignId(designId: string) {
    return (await this.model
      .select()
      .where("design_id", "==", designId)
      .where("design_id", "==", "")
      .get()) as IMaterialCodeAttributes[];
  }

  public async getSubMaterialCodeById(codeId: string) {
    const params = {
      codeId,
    };
    const rawQuery = `
    FOR data IN material_codes
    FOR sub IN data.subs
    FOR code IN sub.codes
    FILTER code.id == @codeId
    RETURN code`;

    const result = await this.model.rawQuery(rawQuery, params);
    return result?._result[0] ?? null;
  }

  public async getMaterialCodeGroup() {}
}

export default MaterialCodeRepository;
