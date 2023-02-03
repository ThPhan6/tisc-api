import { encrypt, stringToBase64 } from "./cryptojs.helper";
import { UserAttributes, IProductAttributes, UserType } from "@/types";
import { RoleType } from "@/constants";
import { ENVIRONMENT } from "@/config";

export const getProductSharedUrl = (
  user: UserAttributes,
  receiver: UserAttributes | undefined,
  product: IProductAttributes
) => {
  const signature = stringToBase64(
    encrypt({
      collection_id: product.collection_id,
      user_id: user.id,
    })
  );
  let sharedUrl = `${ENVIRONMENT.FE_URL}/shared-product/${product.id}?signature=${signature}`;

  if (!receiver) {
    return sharedUrl;
  }
  //
  const roleType = RoleType[receiver.role_id];
  // TISC is public product page
  // if (roleType === UserType.TISC) {
  //   return `${ENVIRONMENT.FE_URL}/tisc/products/configuration/${product.id}`;
  // }
  if (roleType === UserType.Brand) {
    if ( // if product is not of user brand or shared to another user brand return public product page
      user.relation_id !== receiver.relation_id ||
      product.brand_id !== receiver.relation_id
    ) {
      return sharedUrl;
    }
    return `${ENVIRONMENT.FE_URL}/brand/product/${product.id}`;
  }
  if (roleType === UserType.Designer) {
    return `${ENVIRONMENT.FE_URL}/design-firms/products/brand-products/${product.id}`;
  }
  //
  return sharedUrl;
};
export const getCustomProductSharedUrl = (
  user: UserAttributes,
  product: {
    id: string;
  }
) => {
  const signature = stringToBase64(
    encrypt({
      custom_product_id: product.id,
      user_id: user.id,
    })
  );
  return `${ENVIRONMENT.FE_URL}/shared-custom-product/${product.id}?signature=${signature}`;
};
