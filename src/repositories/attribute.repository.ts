import { BASIS_TYPES, SHORT_TEXT_ID } from "@/constants";
import AttributeModel from "@/models/attribute.model";
import {
  AttributeProps,
  AttributeType,
  ListAttributeWithPagination,
  SortOrder,
} from "@/types";
import BaseRepository from "./base.repository";

class AttributeRepository extends BaseRepository<AttributeProps> {
  protected model: AttributeModel;
  protected DEFAULT_ATTRIBUTE: Partial<AttributeProps> = {
    id: "",
    type: 1,
    name: "",
    subs: [],
    created_at: "",
    brand_id: "",
  };
  constructor() {
    super();
    this.model = new AttributeModel();
  }
  public async getDuplicatedAttribute(id: string, name: string) {
    try {
      return (await this.model
        .where("id", "!=", id)
        .where("name", "==", name)
        .first()) as AttributeProps;
    } catch (error) {
      return false;
    }
  }

  public async getByType(type: AttributeType) {
    return (await this.model
      .where("type", "==", type)
      .where("selectable", "!=", false)
      .get()) as AttributeProps[];
  }

  public async getListWithPagination(
    limit: number,
    offset: number,
    type: number,
    groupOrder?: SortOrder,
    filter?: any
  ): Promise<ListAttributeWithPagination> {
    let result = this.model.where("type", "==", type);
    if (filter && filter.brand_id) {
      result = result.where("brand_id", "==", filter.brand_id);
    }
    return result
      .order(groupOrder ? "name" : "created_at", groupOrder || "DESC")
      .paginate(limit, offset);
  }

  private getAttributeDetailQuery = `
    LET subs = (
      FOR s IN a.subs
      SORT s.name ASC
      RETURN MERGE(s, {
        basis: FIRST(
            FOR b IN bases
            FOR bs IN b.subs
            FILTER bs.id == s.basis_id && b.deleted_at == null
            RETURN MERGE(bs, {
              type: b.type == @conversion ? 'Conversions' :
                b.type == @preset ? 'Presets' : 'Options'
            })
        ) || {
          id: s.basis_id,
          name: s.basis_id == "${SHORT_TEXT_ID}" ? 'Short Format' : 'Long Format',
          type: 'Text'
        }
      })
    )
    RETURN MERGE(KEEP(a, 'id', 'name'), {subs})
  `;

  public async getAllAttributesGroupByType(brandId?: string) {
    const query = `
      LET allAttributes = (
        FOR a in attributes
        FILTER a.deleted_at == null
        ${brandId ? `FILTER a.brand_id == @brandId` : ""}
        SORT a.name ASC RETURN a
      )
      LET general = (
        FOR a in allAttributes
        FILTER a.type == @general
        ${this.getAttributeDetailQuery}
      )
      LET feature = (
        FOR a in allAttributes
        FILTER a.type == @feature
        ${this.getAttributeDetailQuery}
      )
      LET specification = (
        FOR a in allAttributes
        FILTER a.type == @specification
        ${this.getAttributeDetailQuery}
      )
      RETURN { general, feature, specification }
    `;

    let bindData: any = {
      general: AttributeType.General,
      feature: AttributeType.Feature,
      specification: AttributeType.Specification,
      conversion: BASIS_TYPES.CONVERSION,
      preset: BASIS_TYPES.PRESET,
    };

    if (brandId) {
      bindData = {
        ...bindData,
        brandId: brandId,
      };
    }

    const results = await this.model.rawQueryV2(query, bindData);
    return results[0];
  }
}

export default new AttributeRepository();
