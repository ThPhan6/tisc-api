import { IDocumentationRequest, IHowto } from "./documentation.type";
import { Request, ResponseToolkit } from "@hapi/hapi";
import DocumentationService from "./documentation.service";
export default class DocumentationController {
  private service: DocumentationService;
  constructor() {
    this.service = new DocumentationService();
  }
  public getList = async (req: Request, toolkit: ResponseToolkit) => {
    const { limit, offset, sort } = req.query;
    const response = await this.service.getList(limit, offset, sort);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getById = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.getById(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public create = async (
    req: Request & { payload: IDocumentationRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.create(payload, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public update = async (
    req: Request & { payload: IDocumentationRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.update(id, payload, userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public updateHowtos = async (
    req: Request & { payload: { data: IHowto[] } },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await this.service.updateHowto(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getAllHowto = async (_req: Request, toolkit: ResponseToolkit) => {
    const response = await this.service.getAllHowto();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getHowto = async (req: Request, toolkit: ResponseToolkit) => {
    const userId = req.auth.credentials.user_id as string;
    const response = await this.service.getHowto(userId);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public delete = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await this.service.delete(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
