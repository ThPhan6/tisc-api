import LabelService from "./label.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { ILabelRequest, UpdateLabelRequest } from "./label.type";

export default class LabelController {
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const brandId = req.params.brand_id;
    const response = await LabelService.getList(brandId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public create = async (
    req: Request & { payload: ILabelRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await LabelService.create(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: UpdateLabelRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await LabelService.update(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await LabelService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public moveSubLabelToLabel = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { main_label_id, sub_label_id } = req.params;

    const response = await LabelService.moveSubLabelToLabel(
      main_label_id,
      sub_label_id
    );

    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
