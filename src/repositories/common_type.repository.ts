import CommonTypeModel from "@/models/common_type.model";
import BaseRepository from "./base.repository";
import { CommonTypeAttributes, CommonTypeValue, SortOrder } from "@/types";
import { COMMON_TYPES } from "@/constants";

class CommonTypeRepository extends BaseRepository<CommonTypeAttributes> {
  protected model: CommonTypeModel;
  protected DEFAULT_ATTRIBUTE: Partial<CommonTypeAttributes> = {
    name: "",
    type: COMMON_TYPES.SHARING_GROUP,
    relation_id: null,
  };
  constructor() {
    super();
    this.model = new CommonTypeModel();
  }

  public async findOrCreate(
    keyword: string,
    relationId: string | null,
    type: CommonTypeValue
  ) {
    let commonType = await this.findByNameOrId(keyword, relationId, type);
    if (!commonType) {
      commonType = await this.create({
        name: keyword,
        type,
        relation_id: relationId,
      });
    }
    return commonType as CommonTypeAttributes;
  }

  public async findByNameOrId(
    keyword: string,
    relationId: string | null,
    type: CommonTypeValue
  ) {
    return (await this.model
      .where("type", "==", type)
      .where("id", "==", keyword)
      .orWhere("name", "==", keyword)
      .where("relation_id", "==", relationId)
      .orWhere("relation_id", "==", null)
      .orWhere("relation_id", "==", "")
      .first()) as CommonTypeAttributes | undefined;
  }

  public async getAllByRelationAndType(
    relationId: string | null,
    type: CommonTypeValue,
    sort_order?: SortOrder
  ) {
    return (await this.model
      .select("id", "name")
      .where("type", "==", type)
      .where("relation_id", "==", relationId)
      .orWhere("relation_id", "==", null)
      .orWhere("relation_id", "==", "")
      .order("name", sort_order)
      .get()) as Pick<CommonTypeAttributes, "id" | "name">[];
  }

  public getByListIds = async (ids: string[]) => {
    return (await this.model
      .select("id", "name")
      .where("id", "in", ids)
      .get()) as Pick<CommonTypeAttributes, "id" | "name">[];
  };

  public async getByMultipleTypes(
    relationId: string | null,
    types: CommonTypeValue[],
    sort_order: SortOrder = "ASC"
  ) {
    return (await this.model
      .select("id", "name", "type")
      .whereIn("type", types)
      .where("relation_id", "==", relationId)
      .orWhere("relation_id", "==", null)
      .orWhere("relation_id", "==", "")
      .order("name", sort_order)
      .get()) as Pick<CommonTypeAttributes, "id" | "name" | "type">[];
  }
}

export const commonTypeRepository = new CommonTypeRepository();

export default CommonTypeRepository;
