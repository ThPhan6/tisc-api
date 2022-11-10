import AttributeModel from "@/model/attribute.model";
import {
  SortOrder,
  AttributeType,
  AttributeProps,
  ListAttributeWithPagination,
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
    groupOrder?: SortOrder
  ): Promise<ListAttributeWithPagination> {
    return this.model
      .where("type", "==", type)
      .order(groupOrder ? "name" : "created_at", groupOrder || "DESC")
      .paginate(limit, offset);
  }
}

export default new AttributeRepository();
