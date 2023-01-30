import { VALID_IMAGE_TYPES, BASIS_OPTION_STORE } from "@/constants";
import {
  getFileTypeFromBase64,
  isDuplicatedString,
  randomName,
  sortObjectArray,
} from "@/helper/common.helper";
import { toWebp } from "@/helper/image.helper";
import { deleteFile, isExists } from "@/service/aws.service";
import { IBasisAttributes } from "@/types";
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
    buffer: await toWebp(Buffer.from(image, "base64")),
    path: `${BASIS_OPTION_STORE}/${fileName}.webp`,
    mime_type: "image/webp",
  };
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
                  if (
                    element.id === value.id &&
                    element.image &&
                    element.image !== "/default/option_default.webp"
                  ) {
                    await deleteFile(element.image.slice(1));
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

export const sortBasisOptionOrPreset = (
  basisGroup: IBasisAttributes[],
  order: "ASC" | "DESC"
) => {
  return basisGroup.map((item: IBasisAttributes) => {
    const returnedBasis = item.subs.map((preset: any) => ({
      ...preset,
      count: preset.subs.length,
    }));
    const { type, ...rest } = {
      ...item,
      subs: sortObjectArray(returnedBasis, "name", order),
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
