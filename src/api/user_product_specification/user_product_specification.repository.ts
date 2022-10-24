import BaseRepository from "../../repositories/base.repository";
import UserProductSpecificationModel, {
  UserProductSpecificationAttributes,
  UserProductSpecificationRequest,
} from "@/api/user_product_specification/user_product_specification.model";
import { v4 as uuidv4 } from "uuid";

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
    const now = new Date();
    return this.model.rawQueryV2(
      `UPSERT {product_id: '${product_id}', user_id: '${user_id}'}
      INSERT @payloadWithId
      UPDATE @payload
      IN user_product_specifications
      RETURN NEW
    `,
      {
        payloadWithId: {
          product_id,
          user_id,
          ...payload,
          id: uuidv4(),
          created_at: now,
          updated_at: now,
        },
        payload: { product_id, user_id, updated_at: now, ...payload },
      }
    );
  }
}

export const userProductSpecificationRepository =
  new UserProductSpecificationRepository();

export default new UserProductSpecificationRepository();
