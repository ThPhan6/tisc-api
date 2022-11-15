import { isEmpty,reduce, differenceWith } from "lodash";
import {
  ProductSpecificationSelection
} from '@/api/user_product_specification/user_product_specification.model';
import {SelectionAttributeGroupWithOptionalId} from '@/api/product/product.type';

export const validateBrandProductSpecification = (
  payloadAttributeGroups: ProductSpecificationSelection['attribute_groups'],
  productSpecificationAttribute: SelectionAttributeGroupWithOptionalId[]
) => {
  ///
  let isValidSpecification = true;
  ///
  payloadAttributeGroups = reduce(
    payloadAttributeGroups, (groups, attributeGroup) => {
      const productSpecification = productSpecificationAttribute.find((group) => {
        return group.id === attributeGroup.id
      });
      if (!productSpecification) {
        return groups;
      }
      if (productSpecification.selection && attributeGroup.attributes.length > 1) {
        isValidSpecification = false;
        return groups;
      }
      ///
      const differenceWithProductData = differenceWith(
        attributeGroup.attributes,
        productSpecification.attributes,
        (item1, item2) => {
          if (item1.id === item2.id) {
            if (item2.basis_options?.find((option) => option.id === item1.basis_option_id)) {
              return true;
            }
            return false;
          }
          return false;
        }
      )
      if (isEmpty(differenceWithProductData)) {
        groups.push(attributeGroup);
      } else {
        isValidSpecification = false;
      }
      ///
      return groups;
  }, [] as ProductSpecificationSelection['attribute_groups']);
  //
  if (!isValidSpecification) {
    return false;
  }
  return payloadAttributeGroups;
}
