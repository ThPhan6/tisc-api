import ProjectProductModel, {
  ProjectProductAttributes,
} from "@/api/project_product/project_product.model";
import BaseRepository from "@/repositories/base.repository";
import { AssignProductToProjectRequest } from "./project_product.type";

class ProjectProductRepository extends BaseRepository<ProjectProductAttributes> {
  protected model: ProjectProductModel;

  protected DEFAULT_ATTRIBUTE: Partial<ProjectProductAttributes> = {
    id: "",
    project_id: "",
    product_id: "",
    status: 0,
    consider_status: 0,
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

  public async upsert(payload: AssignProductToProjectRequest) {
    return this.model.rawQuery(
      `UPSERT {product_id: '${payload.product_id}', project_id: '${payload.project_id}'}
      INSERT @payload
      UPDATE @payload
      IN project_products
      RETURN { doc: NEW }
    `,
      { payload }
    );
  }

  public async getListAssignedProject(project_id: string, product_id: string) {
    return this.findBy({ project_id, product_id });
  }
}

export const projectProductRepository = new ProjectProductRepository();

export default ProjectProductRepository;
