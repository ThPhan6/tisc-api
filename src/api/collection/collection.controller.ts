import CollectionService from "./collection.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { ICollectionRequest } from "./collection.type";

export default class CollectionController {
  private service: CollectionService;
  constructor() {
    this.service = new CollectionService();
  }
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset } = req.query;
    const response = await this.service.getList(limit, offset);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public create = async (
    req: Request & { payload: ICollectionRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
