import { BasisPresetType } from "@/api/basis/basis.type";
import { BASIS_TYPES } from "@/constants/basis.constant";
import BasisModel from "@/models/basis.model";
import { SortOrder, IBasisAttributes, ListBasisWithPagination } from "@/types";
import BaseRepository from "./base.repository";

class BasisRepository extends BaseRepository<IBasisAttributes> {
  protected model: BasisModel;
  protected DEFAULT_ATTRIBUTE: Partial<IBasisAttributes> = {
    type: 1,
    name: "",
    subs: [],
    created_at: "",
  };
  constructor() {
    super();
    this.model = new BasisModel();
  }

  public async getExistedBasis(id: string, name: string, type: number) {
    return (await this.model
      .where("id", "!=", id)
      .where("type", "==", type)
      .where("name", "==", name)
      .first()) as IBasisAttributes;
  }

  public async getAllBasisByType(type: number) {
    return (await this.model
      .select()
      .where("type", "==", type)
      .get()) as IBasisAttributes[];
  }

  public async getListBasisWithPagination(
    limit: number,
    offset: number,
    type: BASIS_TYPES,
    groupOrder?: SortOrder,
    isGeneral?: boolean
  ): Promise<ListBasisWithPagination> {
    let result = this.model.where("type", "==", type);
    if (type === BASIS_TYPES.PRESET) {
      if (!isGeneral) {
        result.where("additional_type", "==", BasisPresetType.feature);
      } else {
        result.where("additional_type", "!=", BasisPresetType.feature);
      }
    }
    return result
      .order(groupOrder ? "name" : "created_at", groupOrder || "DESC")
      .paginate(limit, offset);
  }

  public async getAllBasesGroupByType() {
    const query = `
      LET allBases = (
        FOR b in bases
        FILTER b.deleted_at == null
        SORT b.name ASC RETURN b
      )
      LET conversions = (
        FOR b in allBases
        FILTER b.type == @conversion
        RETURN MERGE(KEEP(b, 'id', 'name'), {
          count: LENGTH(b.subs),
          subs: (
            FOR s IN b.subs
            SORT s.name_1 ASC
            RETURN KEEP(s, 'id', 'name_1', 'name_2')
          )
        })
      )
      LET presets = (
        FOR b in allBases
        FILTER b.type == @preset
        RETURN MERGE(KEEP(b, 'id', 'name'), {
          count: LENGTH(b.subs),
          subs: (
            FOR s IN b.subs
            SORT s.name ASC
            RETURN {id: s.id, name: s.name, count: LENGTH(s.subs)}
          )
        })
      )
      LET options = (
        FOR b in allBases
        FILTER b.type == @option
        RETURN MERGE(KEEP(b, 'id', 'name'), {
          count: LENGTH(b.subs),
          subs: (
            FOR s IN b.subs
            SORT s.name ASC
            RETURN {id: s.id, name: s.name, main_id: s.main_id, count: LENGTH(s.subs)}
          )
        })
      )
      RETURN { conversions, presets, options }
    `;

    const results = await this.model.rawQueryV2(query, {
      conversion: BASIS_TYPES.CONVERSION,
      preset: BASIS_TYPES.PRESET,
      option: BASIS_TYPES.OPTION,
    });
    return results[0];
  }
}
export default new BasisRepository();
