import { Request, ResponseToolkit } from "@hapi/hapi";
import { linkageService } from "./linkage.service";
import {
  Linkage,
  LinkageRequest,
  MultiConfigurationStepRequest,
  MultiStepRequest,
  StepRequest,
} from "./linkage.type";

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
  public upsertStep = async (
    req: Request & { payload: MultiStepRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await linkageService.upsertStep(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getSteps = async (req: Request, toolkit: ResponseToolkit) => {
    const { product_id, specification_id } = req.query;
    const response = await linkageService.getSteps(
      product_id,
      specification_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getLinkageRestOptions = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { option_ids, except_option_ids } = req.query;
    const response = await linkageService.getLinkageRestOptions(
      option_ids,
      except_option_ids
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public upsertConfigurationStep = async (
    req: Request & { payload: MultiConfigurationStepRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await linkageService.upsertConfigurationStep(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getConfigurationSteps = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { product_id, specification_id } = req.query;
    const response = await linkageService.getConfigurationSteps(
      product_id,
      specification_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}

export const linkageController = new LinkageController();
