import BasisOptionMainModel, {
  BasisOptionMainAttribute,
} from "@/models/basis_option_main.model";
import BaseRepository from "./base.repository";

class BasisOptionMainRepository extends BaseRepository<BasisOptionMainAttribute> {
  protected model: BasisOptionMainModel;

  constructor() {
    super();
    this.model = new BasisOptionMainModel();
  }
}

export default new BasisOptionMainRepository();
export const basisOptionMainRepository = new BasisOptionMainRepository();
