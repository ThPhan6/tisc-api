import ProjectProductModel, {
  ProjectProductAttributes,
} from "@/api/project_product/project_product.model";
import BaseRepository from "@/repositories/base.repository";
import {
  AssignProductToProjectRequest,
  ProductConsiderStatus,
  ProjectProductStatus,
} from "./project_product.type";
import { v4 as uuidv4 } from "uuid";
import { CONSIDERED_PRODUCT_STATUS } from "@/constant/common.constant";

class ProjectProductRepository extends BaseRepository<ProjectProductAttributes> {
  protected model: ProjectProductModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectProductAttributes> = {
    id: "",
    project_id: "",
    product_id: "",
    status: 0,
    consider_status: CONSIDERED_PRODUCT_STATUS.CONSIDERED,
    specified_status: 0,

    brand_location_id: "",
    distributor_location_id: "",

    material_code_id: "",
    material_code: "",
    suffix_code: "",
    description: "",
    quantity: 0,
    order_method: 0,
    requirement_type_ids: [],
    instruction_type_ids: [],
    finish_schedule_ids: [],
    unit_type_id: "",
    special_instruction: "",

    allocation: [],
    entire_allocation: true,

    created_at: "",
    created_by: "",
    updated_at: "",
  };

  constructor() {
    super();
    this.model = new ProjectProductModel();
  }

  public async upsert(payload: AssignProductToProjectRequest, user_id: string) {
    const now = new Date();
    return this.model.rawQueryV2(
      `UPSERT {product_id: "${payload.product_id}", project_id: "${payload.project_id}"}
      INSERT @payloadWithId
      UPDATE @payload
      IN project_products
      RETURN { doc: NEW }
    `,
      {
        payloadWithId: {
          ...payload,
          id: uuidv4(),
          consider_status: ProductConsiderStatus.Considered,
          status: ProjectProductStatus.consider,
          created_by: user_id,
          created_at: now,
          updated_at: now,
        },
        payload: { ...payload, updated_at: now },
      }
    );
  }

  public async getListAssignedProject(project_id: string, product_id: string) {
    return this.findBy({ project_id, product_id });
  }

  public getByProjectId = async (
    project_id: string,
    status: ProjectProductStatus
  ) => {
    return this.model
      .getQuery()
      .where("project_id", "==", project_id)
      .where("status", "==", status)
      .join("products", "products.id", "==", "project_products.product_id")
      .join("brands", "brands.id", "==", "products.brand_id")
      .join("collections", "collections.id", "==", "products.collection_id")
      .join("users", "users.id", "==", "project_products.created_by")
      .get(true);
  };
}

export const projectProductRepository = new ProjectProductRepository();

export default ProjectProductRepository;
