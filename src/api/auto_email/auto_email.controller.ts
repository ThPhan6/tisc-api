import {
  TOPIC_OPTIONS,
  TARGETED_FOR_OPTIONS,
} from "../../constant/common.constant";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { IUpdateAutoEmailRequest } from "./auto_email.type";
import AutoEmailService from "./auto_email.service";

export default class AutoEmailController {
  private service: AutoEmailService;
  constructor() {
    this.service = new AutoEmailService();
  }
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
    const response = await this.service.getList(limit, offset, filter, sort);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getOne = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getOne(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IUpdateAutoEmailRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await this.service.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
