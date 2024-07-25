import AdditionalSubGroupModel, {
  AdditionalSubGroupAttribute,
} from "@/models/additional_sub_group.model";
import BaseRepository from "./base.repository";

class AdditionalSubGroupRepository extends BaseRepository<AdditionalSubGroupAttribute> {
  protected model: AdditionalSubGroupModel;

  constructor() {
    super();
    this.model = new AdditionalSubGroupModel();
  }
}

export default new AdditionalSubGroupRepository();
export const additionalSubGroupRepository = new AdditionalSubGroupRepository();
