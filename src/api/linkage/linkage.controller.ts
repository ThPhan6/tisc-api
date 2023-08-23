import { Request, ResponseToolkit } from "@hapi/hapi";
import { linkageService } from "./linkage.service";
import { Linkage, LinkageRequest } from "./linkage.type";

class LinkageController {
  public upsertLinkages = async (
    req: Request & { payload: LinkageRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await linkageService.upsertLinkages(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getLinkages = async (req: Request, toolkit: ResponseToolkit) => {
    const { option_id } = req.params;
    const response = await linkageService.getLinkages(option_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public pairOrUnpair = async (
    req: Request & { payload: Linkage },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = payload.is_pair
      ? await linkageService.pair(payload.pair)
      : await linkageService.unpair(payload.pair);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}

export const linkageController = new LinkageController();
