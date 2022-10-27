import AttributeModel from "@/model/attribute.model";
import {
  AttributeType,
  AttributeProps,
  ListAttributeWithPagination,
} from "@/types/attribute.type";
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
      .get()) as AttributeProps[];
  }

  public async getListWithPagination(
    limit: number,
    offset: number,
    type: number,
    group_order: "ASC" | "DESC"
  ) {
    return (await this.model
      .where("type", "==", type)
      .order("name", group_order)
      .paginate(limit, offset)) as ListAttributeWithPagination;
  }
}

export default new AttributeRepository();
