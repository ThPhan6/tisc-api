import { documentationService } from "./documentation.service";
import { IDocumentationRequest, IHowto } from "./documentation.type";
import { Request, ResponseToolkit } from "@hapi/hapi";

export default class DocumentationController {
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, sort } = req.query;
    const response = await documentationService.getList(limit, offset, sort);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getById = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await documentationService.getById(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public create = async (
    req: Request & { payload: IDocumentationRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await documentationService.create(payload, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: IDocumentationRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await documentationService.update(id, payload, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public updateHowtos = async (
    req: Request & { payload: { data: IHowto[] } },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await documentationService.updateHowto(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getAllHowto = async (_req: Request, toolkit: ResponseToolkit) => {
    const response = await documentationService.getAllHowto();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getHowto = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await documentationService.getHowto(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await documentationService.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListPolicyForLandingPage = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    const response = await documentationService.getListPolicyForLandingPage();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
