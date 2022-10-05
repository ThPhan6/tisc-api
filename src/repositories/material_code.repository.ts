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
      .orWhere("design_id", "==", "")
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

  public async getMaterialCodeWithCountByDesignId(designId: string) {
    const params = {
      designId,
    };
    const rawQuery = `
    FILTER material_codes.design_id == @designId
    FOR sub IN material_codes.subs
    LET subMaterialCode = []
    RETURN {
      id: material_codes.id,
      name: material_codes.name,
      count: count(material_codes.subs),
      subs: push(subMaterialCode,{
        id: sub.id,
        name: sub.name,
        count: count(sub.codes),
        codes: sub.codes,
      }),
    }
    `;
    return (
      ((await this.model.rawQuery(
        rawQuery,
        params
      )) as IMaterialCodeAttributes[]) ?? []
    );
  }

  public async getCodesByUser(userId: string) {
    const params = {
      userId,
    };
    const rawQuery = `
    LET userRalationIds = (
      FOR u IN users
      FILTER u.id == @userId
      RETURN u.relation_id
    )
    FILTER material_codes.design_id IN userRalationIds
    FOR sub IN material_codes.subs
    RETURN sub.codes
     `;
    const result =
      ((await this.model.rawQuery(rawQuery, params)) as ICodeAttribute[]) ?? [];
    return result.flat(Infinity);
  }
}

export default MaterialCodeRepository;
