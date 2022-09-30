import { MESSAGES } from "@/constants";
import UserProductSpecificationModel, {
  UserProductSpecificationRequest,
} from "@/api/user_product_specification/user_product_specification.model";

class UserProductSpecificationService {
  public selectSpecification = async (
    userId: string,
    productId: string,
    payload: UserProductSpecificationRequest
  ) => {
    return {
      message: MESSAGES.SUCCESS,
      statusCode: 200,
    };
  };
}

export const userProductSpecService = new UserProductSpecificationService();

export default UserProductSpecificationService;
