import BaseRepository from "../../repositories/base.repository";
import UserProductSpecificationModel, {
  UserProductSpecificationAttributes,
  UserProductSpecificationRequest,
} from "@/api/user_product_specification/user_product_specification.model";

class UserProductSpecificationRepository extends BaseRepository<UserProductSpecificationAttributes> {
  protected model: UserProductSpecificationModel;

  protected DEFAULT_ATTRIBUTE: Partial<UserProductSpecificationAttributes> = {
    brand_location_id: "",
    created_at: "",
    user_id: "",
    distributor_location_id: "",
    id: "",
    product_id: "",
    updated_at: "",
  };

  constructor() {
    super();
    this.model = new UserProductSpecificationModel();
  }

  public async upsert(
    product_id: string,
    user_id: string,
    payload: UserProductSpecificationRequest
  ) {
    return this.model.rawQuery(
      `UPSERT {product_id: '${product_id}', user_id: '${user_id}'}
      INSERT @payload
      UPDATE @payload
      IN user_product_specifications
      RETURN { doc: NEW }
    `,
      { payload: { product_id, user_id, ...payload } }
    );
  }
}

export const userProductSpecificationRepository =
  new UserProductSpecificationRepository();

export default new UserProductSpecificationRepository();
