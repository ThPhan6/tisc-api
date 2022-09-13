import { getDistinctArray, removeSpecialChars } from "@/helper/common.helper";
import { toWebp } from "@/helper/image.helper";
import { IAttributeAttributes } from "@/model/attribute.model";
import { IBasisAttributes } from "@/model/basis.model";
import { upload } from "@/service/aws.service";
import {
  IProductAttributes,
  ProductWithCollectionAndBrand,
} from "@/types/product.type";
import moment from "moment";
import { v4 as uuid } from "uuid";
import { ISubBasisConversion } from "../basis/basis.type";
import { CategoryValue } from "../category/category.type";
import {
  IAttributeGroup,
  IAttributeGroupWithOptionalId,
  IAttributeGroupWithOptionId,
  IProductOption,
  IProductOptionAttribute,
} from "./product.type";

export const getProductCategories = (
  categoryIds: string[] = [],
  categories: CategoryValue[]
) => {
  const productCategories: CategoryValue[] = [];
  ///
  categoryIds.forEach((categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      productCategories.push(category);
    }
  });
  return productCategories;
};

export const mappingByCategory = (
  products: ProductWithCollectionAndBrand[],
  categories: CategoryValue[]
) => {
  return categories.map((category) => {
    let categoryProducts = products.filter((item) =>
      item.category_ids.includes(category.id)
    );

    /// format product data
    const responseProducts = categoryProducts.map((product) => {
      const { is_deleted, collection_id, brand_id, category_ids, ...rest } =
        product;
      //
      ///
      return {
        ...rest,
        favorites: product.favorites.length,
        is_liked: true,
        categories: getProductCategories(category_ids, categories),
      };
    });
    ///
    return {
      ...category,
      count: categoryProducts.length,
      products: responseProducts,
    };
  });
};

export const mappingByBrand = (
  products: ProductWithCollectionAndBrand[],
  categories: CategoryValue[],
  brands: ProductWithCollectionAndBrand["brand"][]
) => {
  return brands.map((brand) => {
    let categoryProducts = products.filter(
      (item) => item.brand_id === brand.id
    );

    /// format product data
    const responseProducts = categoryProducts.map((product) => {
      const { is_deleted, collection_id, brand_id, category_ids, ...rest } =
        product;

      ///
      return {
        ...rest,
        favorites: product.favorites.length,
        is_liked: true,
        categories: getProductCategories(category_ids, categories),
      };
    });
    ///
    return {
      id: brand.id,
      name: brand.name,
      count: categoryProducts.length,
      products: responseProducts,
    };
  });
};

export const getTotalVariantOfProducts = (
  products: IProductAttributes[] | ProductWithCollectionAndBrand[] = []
) => {
  return [...products].reduce((pre: IProductOption[], cur) => {
    let temp: IProductOption[] = [];
    cur.specification_attribute_groups.forEach((group) => {
      group.attributes.forEach((attribute) => {
        attribute.basis_options?.forEach((basis_option) => {
          temp.push(basis_option);
        });
      });
    });
    return pre.concat(temp);
  }, []);
};

export const getTotalCategoryOfProducts = (products: IProductAttributes[]) => {
  const rawCategoryIds = products.reduce((pre: string[], cur) => {
    return pre.concat(cur.category_ids || []);
  }, []);
  return getDistinctArray(rawCategoryIds);
};

export const getUniqueBrands = (products: ProductWithCollectionAndBrand[]) => {
  return products.reduce(
    (res: ProductWithCollectionAndBrand["brand"][], cur) => {
      if (!res.find((brand) => brand.id === cur.brand.id)) {
        res = res.concat(cur.brand);
      }
      return res;
    },
    []
  );
};

export const getUniqueCollections = (
  products: ProductWithCollectionAndBrand[]
) => {
  return products.reduce(
    (res: ProductWithCollectionAndBrand["collection"][], cur) => {
      if (!res.find((collection) => collection.id === cur.collection.id)) {
        res = res.concat(cur.collection);
      }
      return res;
    },
    []
  );
};

export const mappingAttribute = (
  attributeGroup: IAttributeGroupWithOptionalId,
  allBasisConversion: ISubBasisConversion[]
) => {
  const newAttributes = attributeGroup.attributes.map((attribute: any) => {
    if (attribute.type === "Conversions") {
      const conversion = allBasisConversion.find(
        (basisConversion: any) => basisConversion.id === attribute.basis_id
      );
      const value1 = parseFloat(attribute.conversion_value_1 || "0");
      const value2 = value1 / parseFloat(conversion?.formula_1 || "1");
      return {
        ...attribute,
        conversion_value_1: value1.toFixed(2),
        conversion_value_2: value2.toFixed(2),
      };
    }
    return attribute;
  });
  if (attributeGroup.id) {
    return {
      ...attributeGroup,
      attributes: newAttributes,
    };
  }
  return {
    ...attributeGroup,
    id: uuid(),
    attributes: newAttributes,
  };
};

export const uploadImagesProduct = (
  images: string[],
  keywords: string[],
  brand_name: string,
  productId: string
) => {
  const brandName = removeSpecialChars(
    brand_name.trim().toLowerCase().split(" ").join("-").replace(/ /g, "-") ||
      ""
  );
  return images.map(async (image, index) => {
    const mediumBuffer = await toWebp(Buffer.from(image, "base64"), "medium");
    const cleanKeywords = keywords.map((item) => {
      return item.trim().replace(/ /g, "-");
    });
    let fileName = `${brandName}-${cleanKeywords.join(
      "-"
    )}-${moment.now()}${index}`;
    await upload(
      mediumBuffer,
      `product/${productId}/${fileName}_medium.webp`,
      "image/webp"
    );
    return `/product/${productId}/${fileName}_medium.webp`;
  });
};

export const mappingAttributeOrBasis = (
  all_attribute: IAttributeAttributes[]
) => {
  return all_attribute.reduce((pre: any, cur) => {
    return pre.concat(cur.subs);
  }, []);
};

export const mappingAttributeGroups = (
  attribute_groups: IAttributeGroupWithOptionId[],
  all_specification_attribute: IAttributeAttributes[],
  all_basis_conversion: IBasisAttributes[],
  all_basis_option_value?: IBasisAttributes[]
) => {
  return attribute_groups.map(async (group) => {
    {
      const newAttributes = await Promise.all(
        group.attributes.map(async (attribute) => {
          const foundAttribute = all_specification_attribute.find(
            (item) => item.id === attribute.id
          );
          let newBasisOptions: any = attribute.basis_options;
          if (all_basis_option_value) {
            if (attribute.basis_options) {
              newBasisOptions = attribute.basis_options.map((basisOption) => {
                const foundBasisOption: any = all_basis_option_value?.find(
                  (item) => item.id === basisOption.id
                );
                return {
                  ...basisOption,
                  value_1: foundBasisOption?.value_1,
                  value_2: foundBasisOption?.value_2,
                  unit_1: foundBasisOption?.unit_1,
                  unit_2: foundBasisOption?.unit_2,
                  image: foundBasisOption?.image,
                };
              });
            }
          }
          if (attribute.type === "Conversions") {
            const conversion = all_basis_conversion.find(
              (item: IBasisAttributes) => item.id === attribute.basis_id
            );
            return {
              ...attribute,
              name: foundAttribute?.name,
              basis_options: all_basis_option_value ? newBasisOptions : null,
              conversion,
            };
          }
          return {
            ...attribute,
            name: foundAttribute?.name,
            basis_options: all_basis_option_value ? newBasisOptions : null,
          };
        })
      );
      return { ...group, attributes: newAttributes };
    }
  });
};
