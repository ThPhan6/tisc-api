import { SortOrder } from "@/types/common.type";
import {
  IMaterialCodeAttributes,
  ICodeAttribute,
} from "@/types/material_code.type";
import BaseRepository from "./base.repository";
import MaterialCodeModel from "@/model/material_code.model";
import { head } from "lodash";

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
    FILTER material_codes.deleted_at == null
      FOR sub IN material_codes.subs
        FOR code IN sub.codes
          FILTER code.id == @codeId
    RETURN code`;

    const result = (await this.model.rawQuery(
      rawQuery,
      params
    )) as IMaterialCodeAttributes["subs"][0]["codes"];
    return head(result);
  }

  public async getListMaterialCode(
    mainMaterialCodeOrder: SortOrder,
    designId?: string
  ) {
    let query = "";
    if (designId) {
      query += `FILTER material_codes.design_id == '${designId}'`;
    }

    query += `
    FILTER material_codes.deleted_at == null
    SORT material_codes.name ${mainMaterialCodeOrder}
    LET subs = (
      FOR sub IN material_codes.subs
      RETURN {
        id: sub.id,
        name: sub.name,
        count: count(sub.codes),
        codes: sub.codes
      }
    )
    return {
      id: material_codes.id,
      name: material_codes.name,
      count: count(material_codes.subs),
      subs : subs
    }
    `;
    return (
      ((await this.model.rawQuery(query, {})) as IMaterialCodeAttributes[]) ??
      []
    );
  }

  public async getMaterialCodeWithCountByDesignId(designId: string) {
    const params = {
      designId,
    };
    const rawQuery = `
    FILTER material_codes.design_id == @designId
    FILTER material_codes.deleted_at == null
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
    FILTER material_codes.deleted_at == null
    LET userRelationIds = (
      FOR u IN users
      FILTER u.id == @userId
      FILTER u.deleted_at == null
      RETURN u.relation_id
    )
    FILTER material_codes.design_id IN userRelationIds
    FOR sub IN material_codes.subs
    RETURN sub.codes
     `;
    const result =
      ((await this.model.rawQuery(rawQuery, params)) as ICodeAttribute[]) ?? [];
    return result.flat(Infinity);
  }

  public async getExistedMaterialCode(
    id: string,
    designId: string,
    name: string
  ) {
    return this.model
      .where("id", "!=", id)
      .where("design_id", "==", designId)
      .where("name", "==", name)
      .first();
  }

  public findByCodeIdAndDesignId = async (
    codeId: string,
    relationId: string
  ) => {
    const params = { codeId, relationId };
    const rawQuery = `
    FILTER material_codes.deleted_at == null
    FILTER material_codes.relationId == @relationId
    FOR sub IN material_codes.subs
      FOR code IN sub.codes
        FILTER code.id == @codeId
    RETURN code`;

    const result = (await this.model.rawQuery(
      rawQuery,
      params
    )) as IMaterialCodeAttributes["subs"][0]["codes"];
    return head(result);
  };
}

export const materialCodeRepository = new MaterialCodeRepository();

export default MaterialCodeRepository;
