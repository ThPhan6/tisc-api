import { getDistinctArray, numberToFixed } from "@/helpers/common.helper";
import {
  IBasisAttributes,
  AttributeProps,
  BasisConversion,
  IProductAttributes,
  ProductWithRelationData,
  ProductWithCollectionAndBrand,
} from "@/types";
import { v4 as uuid } from "uuid";
import {
  IAttributeGroupWithOptionalId,
  IAttributeGroupWithOptionId,
  IProductOption,
  SelectionAttributeGroupWithOptionalId,
} from "./product.type";
import { isArray, toNumber, isNaN, isEmpty } from "lodash";
import { SpecificationType } from "@/constants";
import { specificationStepRepository } from "@/repositories/specification_step.repository";
import { linkageService } from "../linkage/linkage.service";
import { stepSelectionRepository } from "@/repositories/step_selection.repository";
import productRepository from "@/repositories/product.repository";
import { defaultPreSelectionRepository } from "@/repositories/default_pre_selection.repository";
import galleryRepository from "@/repositories/gallery.repository";
import { BasisOptionMainAttribute } from "@/models/basis_option_main.model";
import { ProductIDType } from "../basis/basis.type";

export const getUniqueProductCategories = (
  products: ProductWithRelationData[]
) => {
  return products.reduce(
    (res: ProductWithRelationData["categories"], product) => {
      product.categories.forEach((category) => {
        if (!res.find((cat) => cat.id === category.id)) {
          res = res.concat(category);
        }
      });
      return res;
    },
    []
  );
};

export const getUniqueBrands = (products: ProductWithRelationData[]) => {
  return products.reduce((res: ProductWithRelationData["brand"][], cur) => {
    if (!res.find((brand) => brand.id === cur.brand.id)) {
      res = res.concat(cur.brand);
    }
    return res;
  }, []);
};

export const getUniqueCollections = (products: ProductWithRelationData[]) => {
  const arr = products.reduce(
    (res: ProductWithRelationData["collections"], cur) => {
      return res.concat(cur.collections);
    },
    []
  );
  return [...new Map(arr.map((item) => [item.id, item])).values()];
};

export const mappingByCategory = (products: ProductWithRelationData[]) => {
  const categories = getUniqueProductCategories(products);
  return categories.map((category) => {
    let categoryProducts = products.filter((item) =>
      item.category_ids.includes(category.id)
    );
    ///
    return {
      ...category,
      count: categoryProducts.length,
      products: categoryProducts,
    };
  });
};

export const mappingByBrand = (products: ProductWithRelationData[]) => {
  const brands = getUniqueBrands(products);
  return brands.map((brand) => {
    let brandProducts = products.filter((item) => item.brand_id === brand.id);
    return {
      id: brand.id,
      name: brand.name,
      count: brandProducts.length,
      products: brandProducts,
    };
  });
};

export const mappingByCollections = (
  products: ProductWithRelationData[],
  collectionId?: string
) => {
  let allCollections = getUniqueCollections(products);
  let collections = [...allCollections,
    // Other Collection
    {
    id: '-1',
    name: 'Other',
    type: 2,
    description: null
  }];
  if (collectionId) {
    collections = collections.filter(
      (collection) => collection.id === collectionId
    );
  } else {
    products.forEach(product => {
      // Products have no collection ID
      // Set Other Collection ID -1
      if(product.collection_ids.length == 0)
        product.collection_ids.push('-1');
    });
  }
  return Promise.all(
    collections.map(async (collection) => {
      let categoryProducts = products.filter((item) =>
        item.collection_ids?.includes(collection.id)
      );
      ///
      const brandId = products[0].brand_id;
      const gallery = await galleryRepository.findBy({
        collection_id: collection.id,
        brand_id: brandId,
      });
      return {
        id: collection.id,
        type: collection.type,
        name: collection.name,
        images: gallery?.images || [],
        description: collection.description,
        count: categoryProducts.length,
        products: categoryProducts,
      };
    })
  );
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

export const mappingAttribute = (
  attributeGroup: IAttributeGroupWithOptionalId,
  allBasisConversion: BasisConversion[]
) => {
  const newAttributes = isArray(attributeGroup.attributes)
    ? attributeGroup.attributes.reduce((final, attribute: any) => {
        if (attribute.type === "Conversions") {
          const conversion = allBasisConversion.find(
            (basisConversion: any) => basisConversion.id === attribute.basis_id
          );
          if (conversion) {
            const value1 = parseFloat(attribute.conversion_value_1 || "0");
            const value2 = value1 / conversion.formula_1;
            final.push({
              ...attribute,
              conversion_value_1: numberToFixed(value1),
              conversion_value_2: numberToFixed(value2),
            });
            return final;
          }
        }
        final.push(attribute);
        return final;
      }, [] as any)
    : [];
  if (attributeGroup.id && isNaN(toNumber(attributeGroup.id))) {
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
export const mappingSpecificationAttribute = (
  attributeGroup: SelectionAttributeGroupWithOptionalId,
  allBasisConversion: BasisConversion[]
) => {
  const newAttributes = isArray(attributeGroup.attributes)
    ? attributeGroup.attributes.reduce((final, attribute: any) => {
        if (attribute.type === "Conversions") {
          const conversion = allBasisConversion.find(
            (basisConversion: any) => basisConversion.id === attribute.basis_id
          );
          if (conversion) {
            const value1 = parseFloat(attribute.conversion_value_1 || "0");
            const value2 = value1 / conversion.formula_1;
            final.push({
              ...attribute,
              conversion_value_1: numberToFixed(value1),
              conversion_value_2: numberToFixed(value2),
            });
            return final;
          }
        }
        final.push(attribute);
        return final;
      }, [] as any)
    : [];
  if (attributeGroup.id && isNaN(toNumber(attributeGroup.id))) {
    return {
      data: {
        id: attributeGroup.id,
        name: attributeGroup.name,
        attributes: newAttributes,
        selection: attributeGroup.selection || false,
      },
      steps: attributeGroup.steps?.map((step) => ({
        ...step,
        specification_id: attributeGroup.id || "",
      })),
      defaultPreSelect:
        attributeGroup.defaultPreSelect && attributeGroup.defaultPreSelect[0]
          ? {
              specification_id: attributeGroup.id || "",
              data: attributeGroup.defaultPreSelect,
            }
          : undefined,
    };
  }
  const newId = uuid();
  let data: any = {
    id: newId,
    name: attributeGroup.name,
    attributes: newAttributes,
    selection: attributeGroup.selection || false,
  };

  if (attributeGroup.steps && attributeGroup.steps.length > 0)
    data = {
      ...data,
      type: SpecificationType.autoStep,
    };
  return {
    data,
    steps: attributeGroup.steps?.map((step) => ({
      ...step,
      specification_id: newId,
    })),
    defaultPreSelect: attributeGroup.defaultPreSelect
      ? {
          specification_id: newId,
          data: attributeGroup.defaultPreSelect,
        }
      : undefined,
  };
};

export const mappingAttributeOrBasis = (
  //change any when update basis
  all_attribute: AttributeProps[] | any
) => {
  return all_attribute.reduce((pre: any, cur: any) => {
    return pre.concat(cur.subs);
  }, []);
};

export const mappingAttributeGroups = (
  attribute_groups: IAttributeGroupWithOptionId[],
  allAttributes: AttributeProps[],
  allConversions: IBasisAttributes[],
  allBasisOptions?: IBasisAttributes[]
) => {
  return attribute_groups.map((group) => {
    const newAttributes = isArray(group.attributes)
      ? group.attributes.reduce((data, attribute) => {
          const foundAttribute = allAttributes.find(
            (item) => item.id === attribute.id
          );
          if (!foundAttribute) {
            return data;
          }
          ///
          const response: any = {
            ...attribute,
            name: foundAttribute.name,
          };

          let newBasisOptions: any = attribute.basis_options;
          if (allBasisOptions) {
            if (attribute.basis_options) {
              newBasisOptions = attribute.basis_options?.reduce(
                (final, basisOption) => {
                  let foundBasisOption: any = false;
                  allBasisOptions?.forEach((item) => {
                    const foundedOption = item.subs?.find(
                      (sub: any) => sub.id === basisOption.id
                    );
                    if (foundedOption) {
                      foundBasisOption = foundedOption;
                    }
                  });
                  if (foundBasisOption) {
                    final.push({
                      ...basisOption,
                      option_code:
                        basisOption.option_code &&
                        basisOption.option_code !== ""
                          ? basisOption.option_code
                          : foundBasisOption.product_id,
                      value_1: foundBasisOption.value_1,
                      value_2: foundBasisOption.value_2,
                      unit_1: foundBasisOption.unit_1,
                      unit_2: foundBasisOption.unit_2,
                      image: foundBasisOption.image,
                    });
                  }
                  return final;
                },
                [] as any
              );
            }
          }
          /// add basis option
          if (
            attribute.type === "Options" &&
            allBasisOptions &&
            newBasisOptions
          ) {
            response.text = `Selected ${newBasisOptions?.length || 0} item${
              newBasisOptions?.length !== 1 ? "s" : ""
            }`;
            response.basis_options = newBasisOptions;
          }
          /// add conversion attribute
          if (attribute.type === "Conversions") {
            const conversion = allConversions.find(
              (item: IBasisAttributes) => item.id === attribute.basis_id
            );
            if (conversion) {
              response.conversion = conversion;
            }
          }
          /// display correct preset text
          if (attribute.type === "Presets" && allBasisOptions) {
            const basis = allBasisOptions.find(
              (opt) => opt.id === attribute.basis_id
            );
            if (basis) {
              const basisValue = basis.subs.find(
                (subBasis: any) => subBasis.id === attribute.basis_value_id
              );
              if (basisValue) {
                response.text = `${basisValue.value_1}`;
                if (basisValue.unit_1) {
                  response.text += ` ${basisValue.unit_1}`;
                }
                if (basisValue.value_2) {
                  response.text += ` - ${basisValue.value_2}`;
                  if (basisValue.unit_2) {
                    response.text += ` ${basisValue.unit_2}`;
                  }
                }
              }
            }
          }
          ///
          data.push(response);
          return data;
        }, [] as any)
      : [];
    return { ...group, attributes: newAttributes };
  });
};
export const mappingProductID = (
  attribute_groups: IAttributeGroupWithOptionId[]
) => {
  let productIDs: string[] = [];
  attribute_groups.map((group) => {
    group.attributes.map((attribute) => {
      attribute.basis_options?.map((option) => {
        if (option.option_code) {
          productIDs.push(option.option_code);
        }
      });
    });
  });
  return productIDs.filter((item) => item && item !== "").join(", ");
};
export const mappingSpecificationStep = (
  attributeGroups: IAttributeGroupWithOptionId[],
  productId: string,
  userId: string
) => {
  return Promise.all(
    attributeGroups.map(async (group) => {
      const type = await specificationStepRepository.getSpecificationType(
        group.id || ""
      );
      if (!type) return group;
      const specificationSteps: any = await linkageService.getSteps(
        productId,
        group.id || ""
      );
      const allProductInformation =
        await productRepository.getProductInformation();
      const stepSelection = await stepSelectionRepository.findBy({
        product_id: productId,
        user_id: userId,
        specification_id: group.id || "",
        deleted_at: null,
      });
      const quantities = stepSelection?.quantities;
      const viewSteps = specificationSteps.data.map(
        (specificationStep: any, index: number) => {
          const combinedOptions = specificationStep.options.map(
            (option: any) => {
              const tempSelectId: string = !option.pre_option
                ? `${option.id}_1`
                : option.pre_option
                    .split(",")
                    .concat(option.id)
                    .map((selectId: string) => `${selectId}_1`)
                    .join(",");
              let picked = false;
              if (
                quantities &&
                quantities[tempSelectId] &&
                quantities[tempSelectId] > 0
              ) {
                picked = true;
              }
              const nextOptions = specificationSteps.data[
                index + 1
              ]?.options.filter(
                (item: any) =>
                  item.pre_option ===
                  (option.pre_option
                    ? `${option.pre_option},${option.id}`
                    : option.id)
              );
              const productInformation = allProductInformation.find(
                (pi) => pi.product_id === option.product_id
              );
              return {
                ...option,
                product_information_id: productInformation?.id,
                product_information_description: productInformation?.decription,
                index: 1,
                select_id: tempSelectId,
                picked,
                has_next_options: nextOptions?.length > 0,
                yours: option.replicate,
              };
            }
          );
          return {
            ...specificationStep,
            options:
              index !== 0
                ? combinedOptions
                : combinedOptions.filter(
                    (step1Item: any) => step1Item.replicate !== 0
                  ),
          };
        }
      );
      const defaultPreSelection = await defaultPreSelectionRepository.findBy({
        product_id: productId,
        specification_id: group.id || "",
      });
      return {
        ...group,
        type,
        specification_steps: specificationSteps.data,
        configuration_steps: [],
        viewSteps,
        stepSelection: stepSelection,
        defaultPreSelect: defaultPreSelection?.data || [],
      };
    })
  );
};
export const mappingProductIdType = (
  attributeGroups: IAttributeGroupWithOptionId[],
  allMainGroups: BasisOptionMainAttribute[],
  allBasis: any[]
) => {
  return attributeGroups.map((attributeGroup: any) => {
    const allBasisOptionItems = allBasis
      .reduce((pre: any, cur: any) => {
        return pre.concat(
          cur.subs?.map((item: any) => ({ ...item, main_id: cur.main_id }))
        );
      }, [])
      .filter((item: any) => !isEmpty(item));
    let basisOptionId = "";
    try {
      if (attributeGroup.attributes[0])
        basisOptionId = attributeGroup.attributes[0]?.basis_options[0]?.id;
      else
        basisOptionId = attributeGroup.specification_steps[0]?.options[0]?.id;
    } catch (error) {
      console.log(error);
    }
    const foundBasisOption = allBasisOptionItems.find(
      (item: any) => item.id === basisOptionId
    );
    if (!foundBasisOption) {
      return {
        ...attributeGroup,
        id_format_type: ProductIDType.Full,
      };
    }
    const main = allMainGroups.find(
      (main) => main.id === foundBasisOption.main_id
    );
    return {
      ...attributeGroup,
      id_format_type: main?.id_format_type || ProductIDType.Full,
    };
  });
};
