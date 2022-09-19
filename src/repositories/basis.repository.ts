import BasisModel from "@/model/basis.models";
import { IBasisAttributes } from "@/types/basis.type";
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
}
export default BasisRepository;
