import { Request, ResponseToolkit } from "@hapi/hapi";
import { IAttributeRequest, IUpdateAttributeRequest } from "./attribute.type";
import AttributeServices from "./attribute.services";
export default class AttributeController {
  constructor() {}
  public create = async (
    req: Request & { payload: IAttributeRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await AttributeServices.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public get = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await AttributeServices.get(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const {
      type,
      limit,
      offset,
      filter,
      group_order,
      attribute_order,
      content_type_order,
    } = req.query;
    const response = await AttributeServices.getList(
      type,
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
    const response = await AttributeServices.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await AttributeServices.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListContentType = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    const response = await AttributeServices.getListContentType();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getAllAttribute = async (_req: Request, toolkit: ResponseToolkit) => {
    const response = await AttributeServices.getAllAttribute();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
