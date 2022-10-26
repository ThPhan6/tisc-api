import {
  TOPIC_OPTIONS,
  TARGETED_FOR_OPTIONS,
} from "@/constant/common.constant";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { IUpdateAutoEmailRequest } from "./auto_email.type";
import {autoEmailService} from "./auto_email.service";

export default class AutoEmailController {

  public getListTopic = async (_req: Request, toolkit: ResponseToolkit) => {
    return toolkit.response(TOPIC_OPTIONS).code(200);
  };
  public getListTargetedFor = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    return toolkit.response(TARGETED_FOR_OPTIONS).code(200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, filter, sort } = req.query;
    const response = await autoEmailService.getList(limit, offset, filter, sort);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await autoEmailService.getOne(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IUpdateAutoEmailRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await autoEmailService.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
