import CollectionService from "./collection.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { ICollectionRequest } from "./collection.type";

export default class CollectionController {
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, relation_id, relation_type, category_ids } =
      req.query;
    const response = await CollectionService.getList(
      relation_id,
      relation_type,
      limit,
      offset,
      { category_ids: category_ids?.split(",") }
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public create = async (
    req: Request & { payload: ICollectionRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await CollectionService.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: { name: string } },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const { name } = req.payload;
    const response = await CollectionService.update(id, name);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await CollectionService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
