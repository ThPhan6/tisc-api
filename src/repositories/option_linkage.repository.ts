import OptionLinkageModel, {
  OptionLinkageAttribute,
} from "@/models/option_linkage.model";
import { head } from "lodash";
import BaseRepository from "./base.repository";

class OptionLinkageRepository extends BaseRepository<OptionLinkageAttribute> {
  protected model: OptionLinkageModel;

  constructor() {
    super();
    this.model = new OptionLinkageModel();
  }
  public async findPair(items: string[]) {
    const filters = items
      .map((item) => `filter ol.options like "%${item}%"`)
      .join("\n");
    const raw = `for ol in option_linkages
    ${filters}
    return ol`;
    const res = (await this.model.rawQueryV2(
      raw,
      {}
    )) as OptionLinkageAttribute[];
    return head(res);
  }
  public async findPairsByOption(option_id: string) {
    const raw = `for ol in option_linkages
    filter ol.options like "%${option_id}%"
    return UNSET(ol, ['_id', '_key', '_rev'])`;
    const res = (await this.model.rawQueryV2(
      raw,
      {}
    )) as OptionLinkageAttribute[];
    return res;
  }
}

export default new OptionLinkageRepository();
export const optionLinkageRepository = new OptionLinkageRepository();
