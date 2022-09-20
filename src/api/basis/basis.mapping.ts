import {
  getFileTypeFromBase64,
  isDuplicatedString,
  sortObjectArray,
  randomName,
} from "@/helper/common.helper";
import { BasisConversion, IBasisAttributes } from "@/types/basis.type";
import {
  IBasisConversionRequest,
  IBasisOptionRequest,
  IBasisPresetRequest,
  IUpdateBasisOptionRequest,
  IUpdateBasisPresetRequest,
} from "./basis.type";
import { v4 as uuid } from "uuid";
import { VALID_IMAGE_TYPES } from "@/constant/common.constant";
import { BASIS_OPTION_STORE } from "@/constants/basis.constant";
import { deleteFile, isExists } from "@/service/aws.service";

export const duplicateBasisConversion = (payload: IBasisConversionRequest) => {
  let isCheckedSubsDuplicate = false;
  payload.subs.forEach((item) => {
    if (item.name_1 === item.name_2 || item.unit_1 === item.unit_2) {
      isCheckedSubsDuplicate = true;
    }
  });

  const conversionBetweenNames = payload.subs.map((item: any) => {
    return item.name_1 + "-" + item.name_2;
  });
  const conversionUnitNames = payload.subs.map((item: any) => {
    return item.unit_1 + "-" + item.unit_2;
  });
  const isCheckedConversionBetween = isDuplicatedString(conversionBetweenNames);
  const isCheckedConversionUnit = isDuplicatedString(conversionUnitNames);

  if (isCheckedConversionBetween || isCheckedConversionUnit) {
    isCheckedSubsDuplicate = true;
  }
  return isCheckedSubsDuplicate;
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
      return { ...rest, count: item.subs.length };
    }
  );
  return returnedConversionGroups.map((item: IBasisAttributes) => {
    const subsBasisConversion = item.subs.map((element: any) => {
      return {
        ...element,
        conversion_between: element.name_1 + " - " + element.name_2,
        first_formula:
          element.formula_1 +
          " " +
          element.unit_1 +
          " = " +
          1 +
          " " +
          element.unit_2,
        second_formula:
          element.formula_2 +
          " " +
          element.unit_2 +
          " = " +
          1 +
          " " +
          element.unit_1,
      };
    });
    return {
      ...item,
      subs: subsBasisConversion,
    };
  });
};

export const mappingBasisOptionCreate = async (
  payload: IBasisOptionRequest
) => {
  let isValidImage = true;
  const validUploadImages: {
    buffer: Buffer;
    path: string;
    mime_type: string;
  }[] = [];
  const options = await Promise.all(
    payload.subs.map(async (item) => {
      const values = await Promise.all(
        item.subs.map(async (value) => {
          if (!item.is_have_image) {
            return {
              id: uuid(),
              image: null,
              value_1: value.value_1,
              value_2: value.value_2,
              unit_1: value.unit_1,
              unit_2: value.unit_2,
            };
          }
          if (value.image) {
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
            validUploadImages.push({
              buffer: Buffer.from(value.image, "base64"),
              path: `${BASIS_OPTION_STORE}/${fileName}.${fileType.ext}`,
              mime_type: fileType.mime,
            });
            return {
              id: uuid(),
              image: `/${BASIS_OPTION_STORE}/${fileName}.${fileType.ext}`,
              value_1: value.value_1,
              value_2: value.value_2,
              unit_1: value.unit_1,
              unit_2: value.unit_2,
            };
          }
          return {
            id: uuid(),
            image: null,
            value_1: value.value_1,
            value_2: value.value_2,
            unit_1: value.unit_1,
            unit_2: value.unit_2,
          };
        })
      );
      return {
        id: uuid(),
        name: item.name,
        subs: values,
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

export const sortBasisOption = (
  basisOptionGroup: IBasisAttributes[],
  optionOrder: "ASC" | "DESC"
) => {
  return basisOptionGroup.map((item: IBasisAttributes) => {
    const returnedOptions = item.subs.map((option: any) => ({
      ...option,
      count: option.subs.length,
    }));
    const { type, ...rest } = {
      ...item,
      subs: sortObjectArray(returnedOptions, "name", optionOrder),
    };
    return {
      ...rest,
      count: rest.subs.length,
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

export const mappingBasisOptionUpdate = async (
  payload: IUpdateBasisOptionRequest,
  basisOptionGroup: IBasisAttributes
) => {
  let isValidImage = true;
  const validUploadImages: {
    buffer: Buffer;
    path: string;
    mime_type: string;
  }[] = [];
  let options = await Promise.all(
    payload.subs.map(async (item) => {
      const { is_have_image, ...rest } = item;
      let foundOption = false;
      if (item.id) {
        const foundItemOption = basisOptionGroup.subs.find(
          (sub: any) => sub.id === item.id
        );
        if (foundItemOption) {
          foundOption = true;
        }
      }
      const values = await Promise.all(
        item.subs.map(async (value) => {
          let foundValue = false;
          if (value.id) {
            const foundItemValue = getAllValueInOneGroup(basisOptionGroup).find(
              (valueInGroup) => valueInGroup.id === value.id
            );
            if (foundItemValue) {
              foundValue = true;
            }
          }
          let imagePath: string | null = "";
          if (!item.is_have_image) {
            imagePath = null;
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
          if (value.image) {
            if (await isExists(value.image.slice(1))) {
              imagePath = value.image;
            } else {
              basisOptionGroup.subs.map((sub: any) => {
                sub.subs.map(async (element: any) => {
                  if (element.id === value.id && element.image) {
                    await deleteFile(element.image.slice(1));
                  }
                });
              });

              const fileType = await getFileTypeFromBase64(value.image);
              if (
                !fileType ||
                !VALID_IMAGE_TYPES.find(
                  (validType) => validType === fileType.mime
                )
              ) {
                isValidImage = false;
              }
              const fileName = randomName(8);
              validUploadImages.push({
                buffer: Buffer.from(value.image, "base64"),
                path: `${BASIS_OPTION_STORE}/${fileName}.${fileType.ext}`,
                mime_type: fileType.mime,
              });
              imagePath = `/${BASIS_OPTION_STORE}/${fileName}.${fileType.ext}`;
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
      if (foundOption) {
        return {
          ...rest,
          subs: values,
        };
      }
      return {
        ...rest,
        subs: values,
        id: uuid(),
      };
    })
  );
  return {
    is_valid_image: isValidImage,
    valid_upload_image: validUploadImages,
    basis_option: options,
  };
};

export const mappingBasisPresetCreate = (payload: IBasisPresetRequest) => {
  return payload.subs.map((item) => {
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
      name: item.name,
      subs: values,
    };
  });
};

export const sortBasisPreset = (
  basisPresetGroup: IBasisAttributes[],
  order: "ASC" | "DESC"
) => {
  return basisPresetGroup.map((item: IBasisAttributes) => {
    const returnedPresets = item.subs.map((preset: any) => ({
      ...preset,
      count: preset.subs.length,
    }));
    const { type, ...rest } = {
      ...item,
      subs: sortObjectArray(returnedPresets, "name", order),
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
  return payload.subs.map((item) => {
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
    };
  });
};
