import { MESSAGES } from "@/constants";
import { successMessageResponse } from "@/helpers/response.helper";
import { optionLinkageRepository } from "@/repositories/option_linkage.repository";
import { toConnections } from "./linkage.mappinng";
import { LinkageRequest } from "./linkage.type";

class LinkageService {
  constructor() {}
  private async checkExistKeyPair(pair: string) {
    const items = pair.split(",");
    const check = await optionLinkageRepository.findPair(items);
    return check;
  }
  public async upsertLinkages(payload: LinkageRequest) {
    await Promise.all(
      payload.data.map(async (linkage) => {
        const checkedPair = await this.checkExistKeyPair(linkage.pair);
        if (checkedPair) {
          return optionLinkageRepository.update(checkedPair.id, linkage);
        }
        return optionLinkageRepository.create(linkage);
      })
    );
    return successMessageResponse(MESSAGES.SUCCESS);
  }
  public async getLinkages(option_id: string) {
    const find = await optionLinkageRepository.findPairsByOption(option_id);
    return {
      data: await toConnections(find, option_id),
      statusCode: 200,
    };
  }
  public async pair(pair: string) {
    const items = pair.split(",");
    const find = await optionLinkageRepository.findPair(items);
    if (find) await optionLinkageRepository.update(find.id, { is_pair: true });
    return successMessageResponse(MESSAGES.SUCCESS);
  }
  public async unpair(pair: string) {
    const items = pair.split(",");
    const find = await optionLinkageRepository.findPair(items);
    if (find) await optionLinkageRepository.update(find.id, { is_pair: false });
    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export const linkageService = new LinkageService();
