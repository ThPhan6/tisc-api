import { v4 as uuid } from "uuid";
import {
  BASIS_OPTION_STORE,
  MESSAGES,
  VALID_IMAGE_TYPES,
} from "@/constant/common.constant";
import {
  getFileTypeFromBase64,
  isDuplicatedString,
  randomName,
  sortObjectArray,
} from "@/helper/common.helper";
import BasisModel, { BASIS_NULL_ATTRIBUTES } from "@/model/basis.model";
import { deleteFile, isExists, upload } from "@/service/aws.service";
import { BASIS_TYPES } from "@/constant/common.constant";
import { IBasisAttributes } from "@/model/basis.model";
import { IMessageResponse, IPagination } from "@/type/common.type";
import {
  IBasisConversionRequest,
  IBasisConversionResponse,
  IBasisConversionsResponse,
  IBasisConversionUpdateRequest,
  IBasisOptionRequest,
  IBasisOptionResponse,
  IBasisOptionsResponse,
  IBasisPresetRequest,
  IBasisPresetResponse,
  IBasisPresetsResponse,
  IUpdateBasisOptionRequest,
  IUpdateBasisPresetRequest,
} from "./basis.type";
import BasisRepository from "@/repositories/basis.repository";

export default class BasisService {
  private basisModel: BasisModel;
  private basisRepository: BasisRepository;
  constructor() {
    this.basisModel = new BasisModel();
    this.basisRepository = new BasisRepository();
  }

  private isDuplicatedConversion = (payload: any) => {
    const conversionBetweenNames = payload.subs.map((item: any) => {
      return item.name_1 + "-" + item.name_2;
    });
    const conversionUnitNames = payload.subs.map((item: any) => {
      return item.unit_1 + "-" + item.unit_2;
    });
    const isCheckedConversionBetween = isDuplicatedString(
      conversionBetweenNames
    );
    const isCheckedConversionUnit = isDuplicatedString(conversionUnitNames);

    if (isCheckedConversionBetween || isCheckedConversionUnit) {
      return true;
    }
    return false;
  };

  public getConversion = async (
    id: string
  ): Promise<
    | {
        id: string;
        name_1: string;
        name_2: string;
        formula_1: string;
        formula_2: string;
        unit_1: string;
        unit_2: string;
      }
    | undefined
  > =>
    new Promise(async (resolve) => {
      const allBasisConversion = await this.basisModel.getAllBy({
        type: BASIS_TYPES.CONVERSION,
      });
      const allConversion: {
        id: string;
        name_1: string;
        name_2: string;
        formula_1: string;
        formula_2: string;
        unit_1: string;
        unit_2: string;
      }[] = allBasisConversion.reduce((pre, cur) => {
        return pre.concat(cur.subs);
      }, []);
      const conversion = allConversion.find((item: any) => item.id === id);
      return resolve(conversion);
    });
  public createBasisConversion = async (
    payload: IBasisConversionRequest
  ): Promise<IMessageResponse | IBasisConversionResponse> => {
    return new Promise(async (resolve) => {
      const conversionGroup = await this.basisModel.findBy({
        name: payload.name.toLowerCase(),
        type: BASIS_TYPES.CONVERSION,
      });

      if (conversionGroup) {
        return resolve({
          message: MESSAGES.BASIS_CONVERSION_GROUP_DUPLICATED,
          statusCode: 400,
        });
      }

      let isCheckedSubsDuplicate = false;
      payload.subs.forEach((item) => {
        if (item.name_1 === item.name_2 || item.unit_1 === item.unit_2) {
          isCheckedSubsDuplicate = true;
        }
      });

      if (isCheckedSubsDuplicate) {
        return resolve({
          message: MESSAGES.BASIS_CONVERSION_DUPLICATED,
          statusCode: 400,
        });
      }

      const isCheckedConversion = this.isDuplicatedConversion(payload);
      if (isCheckedConversion) {
        return resolve({
          message: MESSAGES.BASIS_CONVERSION_DUPLICATED,
          statusCode: 400,
        });
      }
      const conversions = payload.subs.map((item) => {
        return {
          id: uuid(),
          name_1: item.name_1,
          name_2: item.name_2,
          formula_1: item.formula_1,
          formula_2: item.formula_2,
          unit_1: item.unit_1,
          unit_2: item.unit_2,
        };
      });

      const createdBasisConversion = await this.basisModel.create({
        ...BASIS_NULL_ATTRIBUTES,
        name: payload.name,
        type: BASIS_TYPES.CONVERSION,
        subs: conversions,
      });
      if (!createdBasisConversion) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { type, is_deleted, ...rest } = createdBasisConversion;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getBasisConversions = async (
    limit: number,
    offset: number,
    filter: any,
    conversion_group_order: "ASC" | "DESC",
    conversion_between_order: "ASC" | "DESC"
  ): Promise<IMessageResponse | IBasisConversionsResponse> => {
    return new Promise(async (resolve) => {
      const conversionGroups = await this.basisModel.list(
        limit,
        offset,
        {
          ...filter,
          type: BASIS_TYPES.CONVERSION,
        },
        ["name", conversion_group_order]
      );
      let returnedConversionGroups = conversionGroups.map(
        (item: IBasisAttributes) => {
          const { type, is_deleted, ...rest } = {
            ...item,
            subs: sortObjectArray(
              item.subs,
              "name_1",
              conversion_between_order
            ),
          };
          return { ...rest, count: item.subs.length };
        }
      );
      returnedConversionGroups = returnedConversionGroups.map(
        (item: IBasisAttributes) => {
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
        }
      );
      const pagination: IPagination = await this.basisModel.getPagination(
        limit,
        offset,
        { type: BASIS_TYPES.CONVERSION }
      );

      const allConversion = await this.basisModel.getAllBasisByType(
        BASIS_TYPES.CONVERSION
      );
      const conversionGroupCount = allConversion.length;
      let conversionCount = 0;
      allConversion.forEach((item: any) => {
        conversionCount += item.subs.length;
      });
      const summary = [
        {
          name: "Conversion Group",
          value: conversionGroupCount,
        },
        {
          name: "Conversion",
          value: conversionCount,
        },
      ];

      return resolve({
        data: {
          basis_conversions: returnedConversionGroups,
          summary,
          pagination,
        },
        statusCode: 200,
      });
    });
  };

  public getBasisConversionById = async (
    id: string
  ): Promise<IMessageResponse | IBasisConversionResponse> => {
    return new Promise(async (resolve) => {
      let basisConversion = await this.basisModel.find(id);
      if (!basisConversion) {
        return resolve({
          message: MESSAGES.BASIS_CONVERSION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const result = basisConversion.subs.map((item: any) => {
        return {
          ...item,
          conversion_between: item.name_1 + " - " + item.name_2,
          first_formula:
            item.formula_1 + " " + item.unit_1 + " = " + 1 + " " + item.unit_2,
          second_formula:
            item.formula_2 + " " + item.unit_2 + " = " + 1 + " " + item.unit_1,
        };
      });
      const { type, is_deleted, ...rest } = basisConversion;
      return resolve({
        data: {
          ...rest,
          subs: result,
        },
        statusCode: 200,
      });
    });
  };

  public updateBasisConversion = async (
    id: string,
    payload: IBasisConversionUpdateRequest
  ): Promise<IMessageResponse | IBasisConversionResponse> => {
    return new Promise(async (resolve) => {
      const basisConversion = await this.basisModel.find(id);
      if (!basisConversion) {
        return resolve({
          message: MESSAGES.BASIS_CONVERSION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const duplicatedConversionGroup = await this.basisModel.getExistedBasis(
        id,
        payload.name,
        BASIS_TYPES.CONVERSION
      );
      if (duplicatedConversionGroup) {
        return resolve({
          message: MESSAGES.BASIS_CONVERSION_GROUP_DUPLICATED,
          statusCode: 400,
        });
      }

      let duplicatedConversion = false;
      payload.subs.forEach((item) => {
        if (item.name_1 === item.name_2 || item.unit_1 === item.unit_2) {
          duplicatedConversion = true;
        }
      });

      if (duplicatedConversion) {
        return resolve({
          message: MESSAGES.BASIS_CONVERSION_DUPLICATED,
          statusCode: 400,
        });
      }

      const isCheckedConversion = this.isDuplicatedConversion(payload);
      if (isCheckedConversion) {
        return resolve({
          message: MESSAGES.BASIS_CONVERSION_DUPLICATED,
          statusCode: 400,
        });
      }

      const conversions = payload.subs.map((item) => {
        let found = false;
        if (item.id) {
          const foundItem = basisConversion.subs.find(
            (sub: any) => sub.id === item.id
          );
          if (foundItem) {
            found = true;
          }
        }
        if (found) {
          return item;
        }
        return {
          ...item,
          id: uuid(),
        };
      });
      const updatedBasisConversion = await this.basisModel.update(id, {
        ...BASIS_NULL_ATTRIBUTES,
        name: payload.name,
        type: BASIS_TYPES.CONVERSION,
        subs: conversions,
      });

      if (!updatedBasisConversion) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      const { type, is_deleted, ...rest } = updatedBasisConversion;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public deleteBasis = async (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const basisConversion = await this.basisModel.find(id);
      if (!basisConversion) {
        return resolve({
          message: MESSAGES.BASIS_NOT_FOUND,
          statusCode: 404,
        });
      }
      await this.basisModel.update(id, { is_deleted: true });
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
  public createBasisOption = (
    payload: IBasisOptionRequest
  ): Promise<IMessageResponse | IBasisOptionResponse> => {
    return new Promise(async (resolve) => {
      const group = await this.basisModel.findBy({
        type: BASIS_TYPES.OPTION,
        name: payload.name.toLowerCase(),
      });
      if (group) {
        return resolve({
          message: MESSAGES.BASIS_OPTION_EXISTED,
          statusCode: 400,
        });
      }
      if (
        isDuplicatedString(
          payload.subs.map((item) => {
            return item.name;
          })
        )
      ) {
        return resolve({
          message: MESSAGES.BASIS_OPTION_DUPLICATED,
          statusCode: 400,
        });
      }
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
      if (!isValidImage) {
        return resolve({
          message: MESSAGES.IMAGE_INVALID,
          statusCode: 400,
        });
      }
      await Promise.all(
        validUploadImages.map(async (item) => {
          await upload(item.buffer, item.path, item.mime_type);
          return true;
        })
      );
      const createdBasisOption = await this.basisModel.create({
        ...BASIS_NULL_ATTRIBUTES,
        name: payload.name,
        type: BASIS_TYPES.OPTION,
        subs: options,
      });
      if (!createdBasisOption) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { type, is_deleted, ...rest } = createdBasisOption;
      const returnedOptions = await createdBasisOption.subs.map(
        (option: any) => {
          return {
            ...option,
            count: option.subs.length,
          };
        }
      );
      return resolve({
        data: {
          ...rest,
          count: payload.subs.length,
          subs: returnedOptions,
        },
        statusCode: 200,
      });
    });
  };
  public getBasisOption = (
    id: string
  ): Promise<IMessageResponse | IBasisOptionResponse> => {
    return new Promise(async (resolve) => {
      const group = await this.basisModel.find(id);
      if (!group) {
        return resolve({
          message: MESSAGES.BASIS_OPTION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const option = group.subs.map((item: any) => {
        return {
          ...item,
          count: item.subs.length,
        };
      });
      const { type, is_deleted, ...rest } = group;
      return resolve({
        data: {
          ...rest,
          count: group.subs.length,
          subs: option,
        },
        statusCode: 200,
      });
    });
  };
  private countOptions = (groups: any[]) => {
    return groups.reduce((pre, cur) => {
      return pre + cur.subs.length;
    }, 0);
  };
  private countValues = (groups: any[]) => {
    let result = 0;
    groups.forEach((group) => {
      result += group.subs.reduce((pre: any, cur: any) => {
        return pre + cur.subs.length;
      }, 0);
    });
    return result;
  };
  public getListBasisOption = (
    limit: number,
    offset: number,
    filter: any,
    group_order: "ASC" | "DESC",
    option_order: "ASC" | "DESC"
  ): Promise<IMessageResponse | IBasisOptionsResponse> => {
    return new Promise(async (resolve) => {
      const groups = await this.basisModel.list(
        limit,
        offset,
        { ...filter, type: BASIS_TYPES.OPTION },
        ["name", group_order]
      );
      const returnedGroups = groups.map((item: IBasisAttributes) => {
        const returnedOptions = item.subs.map((option: any) => ({
          ...option,
          count: option.subs.length,
        }));
        const { type, is_deleted, ...rest } = {
          ...item,
          subs: sortObjectArray(returnedOptions, "name", option_order),
        };
        return {
          ...rest,
          count: rest.subs.length,
        };
      });
      const pagination: IPagination = await this.basisModel.getPagination(
        limit,
        offset,
        { type: BASIS_TYPES.OPTION }
      );

      const allBasisOption = await this.basisModel.getAllBasisByType(
        BASIS_TYPES.OPTION
      );
      const summary = [
        {
          name: "Option Group",
          value: allBasisOption.length,
        },
        {
          name: "Option",
          value: this.countOptions(allBasisOption),
        },
        {
          name: "Value",
          value: this.countValues(allBasisOption),
        },
      ];
      return resolve({
        data: {
          basis_options: returnedGroups,
          summary,
          pagination,
        },
        statusCode: 200,
      });
    });
  };
  private getAllValueInOneGroup = (group: any) => {
    let result: any[] = [];
    group.subs.map((option: any) => {
      result = result.concat(option.subs);
    });
    return result;
  };
  public updateBasisOption = (
    id: string,
    payload: IUpdateBasisOptionRequest
  ): Promise<IMessageResponse | IBasisOptionResponse> => {
    return new Promise(async (resolve) => {
      const group = await this.basisModel.find(id);
      if (!group) {
        return resolve({
          message: MESSAGES.BASIS_OPTION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const existedGroup = await this.basisModel.getExistedBasis(
        id,
        payload.name,
        BASIS_TYPES.OPTION
      );
      if (existedGroup) {
        return resolve({
          message: MESSAGES.BASIS_OPTION_EXISTED,
          statusCode: 400,
        });
      }
      if (
        isDuplicatedString(
          payload.subs.map((item) => {
            return item.name;
          })
        )
      ) {
        return resolve({
          message: MESSAGES.BASIS_OPTION_DUPLICATED,
          statusCode: 400,
        });
      }

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
            const foundItemOption = group.subs.find(
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
                const foundItemValue = this.getAllValueInOneGroup(group).find(
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
                  group.subs.map((sub: any) => {
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
      if (!isValidImage) {
        return resolve({
          message: MESSAGES.IMAGE_INVALID,
          statusCode: 400,
        });
      }
      await Promise.all(
        validUploadImages.map(async (item) => {
          await upload(item.buffer, item.path, item.mime_type);
          return true;
        })
      );
      const updatedAttribute = await this.basisModel.update(id, {
        ...payload,
        subs: options,
      });
      if (!updatedAttribute) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      return resolve(this.getBasisOption(id));
    });
  };
  public createBasisPreset = (
    payload: IBasisPresetRequest
  ): Promise<IMessageResponse | IBasisPresetResponse> => {
    return new Promise(async (resolve) => {
      const group = await this.basisModel.findBy({
        type: BASIS_TYPES.PRESET,
        name: payload.name.toLowerCase(),
      });
      if (group) {
        return resolve({
          message: MESSAGES.BASIS_PRESET_EXISTED,
          statusCode: 400,
        });
      }
      if (
        isDuplicatedString(
          payload.subs.map((item) => {
            return item.name;
          })
        )
      ) {
        return resolve({
          message: MESSAGES.BASIS_PRESET_DUPLICATED,
          statusCode: 400,
        });
      }
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
          name: item.name,
          subs: values,
        };
      });
      const createdBasisPreset = await this.basisModel.create({
        ...BASIS_NULL_ATTRIBUTES,
        name: payload.name,
        type: BASIS_TYPES.PRESET,
        subs: presets,
      });
      if (!createdBasisPreset) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { type, is_deleted, ...rest } = createdBasisPreset;
      const returnedPresets = createdBasisPreset.subs.map((preset: any) => {
        return {
          ...preset,
          count: preset.subs.length,
        };
      });
      return resolve({
        data: {
          ...rest,
          count: payload.subs.length,
          subs: returnedPresets,
        },
        statusCode: 200,
      });
    });
  };
  public getBasisPreset = (
    id: string
  ): Promise<IMessageResponse | IBasisPresetResponse> => {
    return new Promise(async (resolve) => {
      const group = await this.basisModel.find(id);
      if (!group) {
        return resolve({
          message: MESSAGES.BASIS_PRESET_NOT_FOUND,
          statusCode: 404,
        });
      }
      const preset = group.subs.map((item: any) => ({
        ...item,
        count: item.subs.length,
      }));
      const { type, is_deleted, ...rest } = group;
      return resolve({
        data: {
          ...rest,
          count: group.subs.length,
          subs: preset,
        },
        statusCode: 200,
      });
    });
  };
  public getListBasisPreset = (
    limit: number,
    offset: number,
    filter: any,
    group_order: "ASC" | "DESC",
    preset_order: "ASC" | "DESC"
  ): Promise<IMessageResponse | IBasisPresetsResponse> => {
    return new Promise(async (resolve) => {
      const groups = await this.basisModel.list(
        limit,
        offset,
        { ...filter, type: BASIS_TYPES.PRESET },
        ["name", group_order]
      );

      const returnedGroups = groups.map((item: IBasisAttributes) => {
        const returnedPresets = item.subs.map((preset: any) => ({
          ...preset,
          count: preset.subs.length,
        }));
        const { type, is_deleted, ...rest } = {
          ...item,
          subs: sortObjectArray(returnedPresets, "name", preset_order),
        };
        return rest;
      });
      const pagination: IPagination = await this.basisModel.getPagination(
        limit,
        offset,
        { type: BASIS_TYPES.PRESET }
      );

      const allBasisPreset = await this.basisModel.getAllBasisByType(
        BASIS_TYPES.PRESET
      );
      const summary = [
        {
          name: "Preset Group",
          value: allBasisPreset.length,
        },
        {
          name: "Preset",
          value: this.countOptions(allBasisPreset),
        },
        {
          name: "Value",
          value: this.countValues(allBasisPreset),
        },
      ];
      return resolve({
        data: {
          basis_presets: returnedGroups,
          summary,
          pagination,
        },
        statusCode: 200,
      });
    });
  };
  public updateBasisPreset = (
    id: string,
    payload: IUpdateBasisPresetRequest
  ): Promise<IMessageResponse | IBasisPresetResponse> => {
    return new Promise(async (resolve) => {
      const group = await this.basisModel.find(id);
      if (!group) {
        return resolve({
          message: MESSAGES.BASIS_PRESET_NOT_FOUND,
          statusCode: 404,
        });
      }
      const existedGroup = await this.basisModel.getExistedBasis(
        id,
        payload.name,
        BASIS_TYPES.PRESET
      );
      if (existedGroup) {
        return resolve({
          message: MESSAGES.BASIS_PRESET_EXISTED,
          statusCode: 400,
        });
      }
      if (
        isDuplicatedString(
          payload.subs.map((item) => {
            return item.name;
          })
        )
      ) {
        return resolve({
          message: MESSAGES.BASIS_PRESET_DUPLICATED,
          statusCode: 400,
        });
      }
      const presets = payload.subs.map((item) => {
        let foundPreset = false;
        if (item.id) {
          const foundItem = group.subs.find((sub: any) => sub.id === item.id);
          if (foundItem) {
            foundPreset = true;
          }
        }
        const values = item.subs.map((value) => {
          let foundValue = false;
          if (value.id) {
            const foundItem = this.getAllValueInOneGroup(group).find(
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
      const updatedAttribute = await this.basisModel.update(id, {
        ...payload,
        subs: presets,
      });
      if (!updatedAttribute) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      return resolve(this.getBasisPreset(id));
    });
  };
}
