import AttributeService from "./attribute.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { IAttributeRequest, IUpdateAttributeRequest } from "./attribute.type";

export default class AttributeController {
  private service: AttributeService;
  constructor() {
    this.service = new AttributeService();
  }
  public create = async (
    req: Request & { payload: IAttributeRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const {
      limit,
      offset,
      filter,
      group_order,
      attribute_order,
      content_type_order,
    } = req.query;
    const response = await this.service.getList(
      limit,
      offset,
      filter,
      group_order,
      attribute_order,
      content_type_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public update = async (
    req: Request & { payload: IUpdateAttributeRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await this.service.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListContentType = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const response = await this.service.getListContentType();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
