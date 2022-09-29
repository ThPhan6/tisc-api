import { MESSAGES } from "@/constants";
import ProjectModel from "@/model/project.model";
import productRepository from "@/repositories/product.repository";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { projectProductRepository } from "./project_product.repository";
import { AssignProductToProjectRequest } from "./project_product.type";

export default class ProjectProductController {
  private projectModel: ProjectModel;

  constructor() {
    this.projectModel = new ProjectModel();
  }

  public assignProductToProject = async (
    req: Request & { payload: AssignProductToProjectRequest },
    { response }: ResponseToolkit
  ) => {
    const payload = req.payload;

    if (!payload.is_entire && !payload.project_zone_ids.length) {
      return response({
        message: MESSAGES.PROJECT_ZONE_MISSING,
        statusCode: 400,
      }).code(400);
    }
    const product = await productRepository.find(payload.product_id);
    if (!product) {
      return response({
        message: MESSAGES.PRODUCT_NOT_FOUND,
        statusCode: 400,
      }).code(400);
    }
    const project = await this.projectModel.find(payload.project_id);
    if (!project) {
      return response({
        message: MESSAGES.PROJECT_NOT_FOUND,
        statusCode: 400,
      }).code(400);
    }

    const upsertResponse = await projectProductRepository.upsert(payload);

    return response(upsertResponse).code(200);
  };

  public getProjectAssignZoneByProduct = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { product_id, project_id } = req.params;
    const response = await projectProductRepository.getListAssignedProject(
      project_id,
      product_id
    );
    return toolkit.response(response).code(200);
  };
}
