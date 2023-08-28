import {
  VALID_IMAGE_TYPES,
  BASIS_OPTION_STORE,
  BASIS_TYPES,
  DEFAULT_MAIN_OPTION_ID,
} from "@/constants";
import {
  getFileTypeFromBase64,
  isDuplicatedString,
  randomName,
  sortObjectArray,
  toSingleSpaceAndToLowerCase,
} from "@/helpers/common.helper";
import basisRepository from "@/repositories/basis.repository";
import { basisOptionMainRepository } from "@/repositories/basis_option_main.repository";
import { optionLinkageRepository } from "@/repositories/option_linkage.repository";
import { deleteFile, isExists } from "@/services/aws.service";
import { IBasisAttributes, SortOrder } from "@/types";
import _, { sortBy } from "lodash";
import { v4 as uuid } from "uuid";
import {
  IBasisConversionRequest,
  IBasisOptionRequest,
  IBasisPresetRequest,
  IUpdateBasisOptionRequest,
  IUpdateBasisPresetRequest,
} from "./basis.type";

export const duplicateBasisConversion = (payload: IBasisConversionRequest) => {
  let isCheckedSubsDuplicate = false;
  payload.subs.forEach((item) => {
    if (item.name_1 === item.name_2 || item.unit_1 === item.unit_2) {
      isCheckedSubsDuplicate = true;
    }
  });

  const conversionBetweenNames = payload.subs.map((item: any) => {
    return `${item.name_1} - ${item.name_2}`;
  });
  const conversionUnitNames = payload.subs.map((item: any) => {
    return `${item.unit_1} - ${item.unit_2}`;
  });
  const isCheckedConversionBetween = isDuplicatedString(conversionBetweenNames);
  const isCheckedConversionUnit = isDuplicatedString(conversionUnitNames);

  if (isCheckedConversionBetween || isCheckedConversionUnit) {
    isCheckedSubsDuplicate = true;
  }
  return isCheckedSubsDuplicate;
};

export const mappingBasisConversion = (basisConversions: any) => {
  return basisConversions.map((item: any) => {
    return {
      ...item,
      conversion_between: `${item.name_1} - ${item.name_2}`,
      first_formula: `${item.formula_1} ${item.unit_1} = 1 ${item.unit_2}`,
      second_formula: `${item.formula_2} ${item.unit_2} = 1 ${item.unit_1}`,
    };
  });
};

export const sortBasisConversion = (
  conversionGroups: IBasisAttributes[],
  conversionOder: "ASC" | "DESC"
) => {
  const returnedConversionGroups: any = conversionGroups.map(
    (item: IBasisAttributes) => {
      const { type, ...rest } = {
        ...item,
        subs: sortObjectArray(item.subs, "name_1", conversionOder),
      };
      return {
        ...rest,
        count: item.subs.length,
      };
    }
  );
  return returnedConversionGroups.map((basisConversion: any) => {
    return {
      ...basisConversion,
      subs: mappingBasisConversion(basisConversion.subs),
    };
  });
};
const toValidImageItem = async (image: any, fileName: string) => {
  return {
    image,
    path: `${BASIS_OPTION_STORE}/${fileName}.webp`,
    mime_type: "image/webp",
  };
};
export const mappingBasisOptionCreate = async (
  payload: IBasisOptionRequest,
  groupId: string
) => {
  let isValidImage = true;
  const validUploadImages: {
    image: string;
    path: string;
    mime_type: string;
  }[] = [];
  let options: any[] = [];
  await Promise.all(
    payload.subs.map(async (main) => {
      const createdMain = await basisOptionMainRepository.create({
        basis_option_group_id: groupId,
        name: main.name,
      });
      const temp = await Promise.all(
        main.subs.map(async (item) => {
          const values = await Promise.all(
            item.subs.map(async (value) => {
              if (
                value.image &&
                value.image !== "/default/option_default.webp"
              ) {
                const fileType = await getFileTypeFromBase64(value.image);
                const fileName = randomName(8);
                if (
                  !fileType ||
                  !VALID_IMAGE_TYPES.find(
                    (validType) => validType === fileType.mime
                  )
                ) {
                  isValidImage = false;
                }
                const validImageItem = await toValidImageItem(
                  value.image,
                  fileName
                );
                validUploadImages.push(validImageItem);
                return {
                  id: uuid(),
                  image: `/${validImageItem.path}`,
                  value_1: value.value_1,
                  value_2: value.value_2,
                  unit_1: value.unit_1,
                  unit_2: value.unit_2,
                  product_id: value.product_id,
                };
              }
              return {
                id: uuid(),
                image: "/default/option_default.webp",
                value_1: value.value_1,
                value_2: value.value_2,
                unit_1: value.unit_1,
                unit_2: value.unit_2,
                product_id: value.product_id,
              };
            })
          );
          return {
            id: uuid(),
            name: toSingleSpaceAndToLowerCase(item.name),
            subs: values,
            main_id: createdMain?.id,
          };
        })
      );
      options = options.concat(temp);
      return {
        ...main,
        subs: sortBy(temp, "name"),
      };
    })
  );

  return {
    is_valid_image: isValidImage,
    valid_upload_image: validUploadImages,
    basis_option: options,
  };
};

export const addCountBasis = (subBasis: any) => {
  return subBasis.map((basis: any) => {
    return {
      ...basis,
      count: basis.subs.length,
    };
  });
};

export const getAllValueInOneGroup = (group: any) => {
  let result: any[] = [];
  group.subs.map((option: any) => {
    result = result.concat(option.subs);
  });
  return result;
};
export const getBasisOptionGroupImages = (
  basisOptionGroup: IBasisAttributes
) => {
  let temp: string[] = [];
  basisOptionGroup.subs.forEach((sub: any) => {
    sub.subs.forEach((value: any) => {
      if (value.image && value.image !== "/default/option_default.webp") {
        temp.push(value.image);
      }
    });
  });
  return temp;
};
export const checkCanDeleteBasisOptionImage = (
  images: string[],
  image: string
) => {
  const count = images.filter((item) => item === image).length;
  if (count === 1) return true;
  else return false;
};
export const mappingBasisOptionUpdate = async (
  payload: IUpdateBasisOptionRequest,
  basisOptionGroup: IBasisAttributes
) => {
  let isValidImage = true;
  const validUploadImages: {
    image: string;
    path: string;
    mime_type: string;
  }[] = [];
  let options: any[] = [];
  let mains: any[] = [];
  const currentImages = getBasisOptionGroupImages(basisOptionGroup);
  await Promise.all(
    payload.subs.map(async (main: any) => {
      let temp_main_id = main.id;
      if (!main.id) {
        temp_main_id = uuid();
      }
      mains = mains.concat([
        {
          id: temp_main_id,
          name: main.name,
          basis_option_group_id: basisOptionGroup.id,
        },
      ]);
      let temp = await Promise.all(
        main.subs.map(async (item: any) => {
          const { is_have_image, ...rest } = item;

          const values = await Promise.all(
            item.subs.map(async (value: any) => {
              let foundValue = false;
              if (value.id) {
                const foundItemValue = getAllValueInOneGroup(
                  basisOptionGroup
                ).find((valueInGroup) => valueInGroup.id === value.id);
                if (foundItemValue) {
                  foundValue = true;
                }
              }
              let imagePath: string | null = "";

              if (value.image) {
                if (await isExists(value.image.slice(1))) {
                  imagePath = value.image;
                } else {
                  basisOptionGroup.subs.map((sub: any) => {
                    sub.subs.map(async (element: any) => {
                      if (
                        element.id === value.id &&
                        element.image &&
                        element.image !== "/default/option_default.webp"
                      ) {
                        if (
                          checkCanDeleteBasisOptionImage(
                            currentImages,
                            element.image
                          )
                        ) {
                          await deleteFile(element.image.slice(1));
                        }
                      }
                    });
                  });

                  const fileType = await getFileTypeFromBase64(value.image);
                  if (
                    fileType &&
                    VALID_IMAGE_TYPES.find(
                      (validType) => validType === fileType.mime
                    )
                  ) {
                    const fileName = randomName(8);
                    const validImageItem = await toValidImageItem(
                      value.image,
                      fileName
                    );
                    validUploadImages.push(validImageItem);
                    imagePath = `/${validImageItem.path}`;
                  } else {
                    const isExistedImage = await isExists(value.image);

                    if (!isExistedImage) {
                      isValidImage = false;
                    }
                    imagePath = value.image;
                  }
                }
                return foundValue
                  ? {
                      ...value,
                      image: imagePath,
                    }
                  : {
                      ...value,
                      image: imagePath,
                      id: uuid(),
                    };
              }
            })
          );
          return {
            ...rest,
            subs: values,
            id: rest.id || uuid(),
            name: toSingleSpaceAndToLowerCase(rest.name),
            main_id: temp_main_id,
          };
        })
      );

      options = options.concat(temp);
    })
  );
  return {
    is_valid_image: isValidImage,
    valid_upload_image: validUploadImages,
    basis_option: options,
    mains: mains.filter((item) => item.id !== DEFAULT_MAIN_OPTION_ID),
  };
};

export const mappingBasisPresetCreate = (payload: IBasisPresetRequest) => {
  const presets = payload.subs.map((item) => {
    const values = item.subs.map((value) => {
      return {
        id: uuid(),
        value_1: value.value_1,
        value_2: value.value_2,
        unit_1: value.unit_1,
        unit_2: value.unit_2,
      };
    });
    return {
      id: uuid(),
      name: toSingleSpaceAndToLowerCase(item.name),
      subs: values,
    };
  });

  return sortBy(presets, "name");
};

export const addBasisOptionMain = (
  basisGroups: IBasisAttributes[],
  basisOptionMains: any[]
) => {
  return basisGroups.map((group: any) => {
    const mains = group.subs.map((sub: any) => {
      let main = basisOptionMains.find(
        (item) => item.id === (sub.main_id || "")
      );
      if (!main) {
        main = {
          id: DEFAULT_MAIN_OPTION_ID,
          name: "Main option",
          basis_option_group_id: "",
        };
      }
      return main;
    });
    // get distinct array
    const returnMains = _.uniqBy(mains, "id").map((main: any) => {
      const mainSubs = group.subs.filter((item: any) => {
        if (!item.main_id) item.main_id = DEFAULT_MAIN_OPTION_ID;
        return item.main_id === main.id;
      });
      return {
        id: main.id,
        name: main.name,
        count: mainSubs.length,
        subs: mainSubs,
      };
    });

    return { ...group, subs: returnMains, count: returnMains.length };
  });
};
export const divideBasisOptionMain = (basisGroup: IBasisAttributes) => {
  const mains = basisGroup.subs.map((main: any) => ({
    id: main.id,
    name: main.name,
    basis_option_group_id: basisGroup.id,
  }));
  const group = {
    ...basisGroup,
    subs: basisGroup.subs.reduce((pre: any, cur: any) => {
      const newSubs = cur.subs.map((sub: any) => ({ ...sub, main_id: cur.id }));
      return pre.concat([newSubs]);
    }, []),
  };
  return {
    group,
    mains,
  };
};

export const sortBasisOption = (
  basisGroups: IBasisAttributes[],
  mainOrder?: SortOrder,
  subOrder?: SortOrder
) => {
  return basisGroups.map((group: IBasisAttributes) => {
    const basisMain = group.subs.map((main: any) => ({
      ...main,
      count: main.subs.length,
    }));
    const sortedMain = basisMain.map((main: any) => {
      const sortedSub = main.subs.map((sub: any) => {
        return {
          ...sub,
          subs: sortObjectArray(sub.subs, "value_1", "ASC"),
          count: sub.subs.length,
        };
      });
      return {
        ...main,
        subs: subOrder
          ? sortObjectArray(sortedSub, "name", subOrder)
          : sortedSub,
      };
    });
    const { type, ...rest } = {
      ...group,
      subs: sortObjectArray(sortedMain, "name", mainOrder || "ASC"),
    };
    return {
      ...rest,
      count: rest.subs.length,
    };
  });
};

export const sortBasisOptionOrPreset = (
  basisGroups: IBasisAttributes[],
  order: "ASC" | "DESC"
) => {
  return basisGroups.map((item: IBasisAttributes) => {
    const returnedBasis = item.subs.map((preset: any) => ({
      ...preset,
      count: preset.subs.length,
    }));
    const sorted1Value = returnedBasis.map((item: any) => {
      return {
        ...item,
        subs: sortObjectArray(item.subs, "value_1", "ASC"),
      };
    });
    const { type, ...rest } = {
      ...item,
      subs: sortObjectArray(sorted1Value, "name", order),
    };
    return {
      ...rest,
      count: rest.subs.length,
    };
  });
};

export const mappingBasisPresetUpdate = (
  payload: IUpdateBasisPresetRequest,
  basisPresetGroup: IBasisAttributes
) => {
  const presets = payload.subs.map((item) => {
    let foundPreset = false;
    if (item.id) {
      const foundItem = basisPresetGroup.subs.find(
        (sub: any) => sub.id === item.id
      );
      if (foundItem) {
        foundPreset = true;
      }
    }
    const values = item.subs.map((value) => {
      let foundValue = false;
      if (value.id) {
        const foundItem = getAllValueInOneGroup(basisPresetGroup).find(
          (valueInGroup) => valueInGroup.id === value.id
        );
        if (foundItem) {
          foundValue = true;
        }
      }
      if (foundValue) {
        return value;
      }
      return {
        ...value,
        id: uuid(),
      };
    });
    if (foundPreset) {
      return {
        ...item,
        subs: values,
      };
    }
    return {
      ...item,
      subs: values,
      id: uuid(),
      name: toSingleSpaceAndToLowerCase(item.name),
    };
  });
  return sortBy(presets, "name");
};
export const getAllBasisOptionValues = async (options?: {
  fields: string[];
}) => {
  const basisGroups = await basisRepository.getAllBy({
    type: BASIS_TYPES.OPTION,
  });
  let values: any[] = [];
  basisGroups.forEach((group) => {
    group.subs.forEach((sub: any) => {
      values = values.concat(sub.subs);
    });
  });
  if (options && options.fields) {
    return _.map(values, _.property(options.fields));
  }
  return values;
};
export const addBasisOptionPairCount = async (group: IBasisAttributes) => {
  const values = getAllValueInOneGroup(group);
  const counted = await Promise.all(
    values.map(async (value: any) => {
      const count = await optionLinkageRepository.countPair(value.id);
      return {
        id: value.id,
        paired: count,
      };
    })
  );
  return {
    ...group,
    subs: group.subs.map((sub: any) => ({
      ...sub,
      subs: sub.subs.map((value: any) => ({
        ...value,
        paired: counted.find((item) => item.id === value.id)?.paired,
      })),
    })),
  };
};
