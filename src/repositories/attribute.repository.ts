import AttributeModel from "@/model/attribute.model";
import {
  IAttributeAttributes,
  ListAttributeWithPagination,
} from "@/types/attribute.type";
import BaseRepository from "./base.repository";

class AttributeRepository extends BaseRepository<IAttributeAttributes> {
  protected model: AttributeModel;
  protected DEFAULT_ATTRIBUTE: Partial<IAttributeAttributes> = {
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
        .first()) as IAttributeAttributes;
    } catch (error) {
      return false;
    }
  }

  public async getByType(type: number) {
    return (await this.model
      .where("type", "==", type)
      .get()) as IAttributeAttributes[];
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
