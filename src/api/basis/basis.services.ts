import { MESSAGES } from "@/constant/common.constant";
import { BASIS_TYPES } from "@/constants/basis.constant";
import { getSummaryTable, isDuplicatedString } from "@/helper/common.helper";
import BasisModel from "@/model/basis.model";
import BasisRepository from "@/repositories/basis.repository";
import { upload } from "@/service/aws.service";
import { v4 as uuid } from "uuid";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import {
  addCountBasis,
  duplicateBasisConversion,
  mappingBasisOptionCreate,
  mappingBasisOptionUpdate,
  mappingBasisPresetCreate,
  mappingBasisPresetUpdate,
  sortBasisConversion,
  sortBasisOption,
  sortBasisPreset,
} from "./basis.mapping";
import {
  IBasisConversionRequest,
  IBasisConversionUpdateRequest,
  IBasisOptionRequest,
  IBasisPresetRequest,
  IUpdateBasisOptionRequest,
  IUpdateBasisPresetRequest,
} from "./basis.type";
export default class BasisService {
  private basisRepository: BasisRepository;
  constructor() {
    this.basisRepository = new BasisRepository();
  }

  public async createBasisConversion(payload: IBasisConversionRequest) {
    const conversionGroup = await this.basisRepository.findBy({
      name: payload.name,
      type: BASIS_TYPES.CONVERSION,
    });
    if (conversionGroup) {
      return errorMessageResponse(MESSAGES.BASIS_CONVERSION_GROUP_DUPLICATED);
    }
    const isDuplicateBasisConversion = duplicateBasisConversion(payload);
    if (isDuplicateBasisConversion) {
      return errorMessageResponse(MESSAGES.BASIS_CONVERSION_DUPLICATED);
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

    const createdBasisConversion = await this.basisRepository.create({
      name: payload.name,
      type: BASIS_TYPES.CONVERSION,
      subs: conversions,
    });
    if (!createdBasisConversion) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    const { type, ...rest } = createdBasisConversion;

    return successResponse({
      data: rest,
    });
  }

  public async getBasisConversions(
    limit: number,
    offset: number,
    filter: any,
    conversion_group_order: "ASC" | "DESC",
    conversion_between_order: "ASC" | "DESC"
  ) {
    const conversionGroups =
      await this.basisRepository.getListBasisWithPagination(
        limit,
        offset,
        BASIS_TYPES.CONVERSION,
        conversion_group_order
      );
    const returnedConversionGroups = sortBasisConversion(
      conversionGroups.data,
      conversion_between_order
    );

    const summaryTable = getSummaryTable(conversionGroups.data);
    const summary = [
      {
        name: "Conversion Group",
        value: summaryTable.countGroup,
      },
      {
        name: "Conversion",
        value: summaryTable.countSub,
      },
    ];
    return successResponse({
      data: {
        basis_conversions: returnedConversionGroups,
        summary,
        pagination: conversionGroups.pagination,
      },
    });
  }

  public async getBasisConversionById(id: string) {
    const basisConversionGroup = await this.basisRepository.find(id);
    if (!basisConversionGroup) {
      return errorMessageResponse(MESSAGES.BASIS_CONVERSION_NOT_FOUND, 404);
    }
    const basisConversion = basisConversionGroup.subs.map((item: any) => {
      return {
        ...item,
        conversion_between: item.name_1 + " - " + item.name_2,
        first_formula:
          item.formula_1 + " " + item.unit_1 + " = " + 1 + " " + item.unit_2,
        second_formula:
          item.formula_2 + " " + item.unit_2 + " = " + 1 + " " + item.unit_1,
      };
    });
    const { type, ...rest } = basisConversionGroup;
    return successResponse({
      data: {
        ...rest,
        subs: basisConversion,
      },
    });
  }

  public async updateBasisConversion(
    id: string,
    payload: IBasisConversionUpdateRequest
  ) {
    const basisConversionGroup = await this.basisRepository.find(id);
    if (!basisConversionGroup) {
      return errorMessageResponse(MESSAGES.BASIS_CONVERSION_NOT_FOUND, 404);
    }
    const duplicatedConversionGroup =
      await this.basisRepository.getExistedBasis(
        id,
        payload.name,
        BASIS_TYPES.CONVERSION
      );
    if (duplicatedConversionGroup) {
      return errorMessageResponse(MESSAGES.BASIS_CONVERSION_GROUP_DUPLICATED);
    }
    const isDuplicateBasisConversion = duplicateBasisConversion(payload);
    if (isDuplicateBasisConversion) {
      return errorMessageResponse(MESSAGES.BASIS_CONVERSION_DUPLICATED);
    }

    const conversions = payload.subs.map((item) => {
      let found = false;
      if (item.id) {
        const foundItem = basisConversionGroup.subs.find(
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
    const updatedBasisConversion = await this.basisRepository.update(id, {
      name: payload.name,
      type: BASIS_TYPES.CONVERSION,
      subs: conversions,
    });

    if (!updatedBasisConversion) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }
    const { type, ...rest } = updatedBasisConversion;
    return successResponse({
      data: rest,
    });
  }

  public async deleteBasis(id: string) {
    const basisConversion = await this.basisRepository.findAndDelete(id);
    if (!basisConversion) {
      return errorMessageResponse(MESSAGES.BASIS_NOT_FOUND, 404);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async createBasisOption(payload: IBasisOptionRequest) {
    const basisOptionGroup = await this.basisRepository.findBy({
      type: BASIS_TYPES.OPTION,
      name: payload.name,
    });
    if (basisOptionGroup) {
      return errorMessageResponse(MESSAGES.BASIS_OPTION_EXISTED);
    }
    if (
      isDuplicatedString(
        payload.subs.map((item) => {
          return item.name;
        })
      )
    ) {
      return errorMessageResponse(MESSAGES.BASIS_OPTION_DUPLICATED);
    }
    const mappingBasisOption = await mappingBasisOptionCreate(payload);
    if (!mappingBasisOption.is_valid_image) {
      return errorMessageResponse(MESSAGES.IMAGE_INVALID);
    }
    await Promise.all(
      mappingBasisOption.valid_upload_image.map(async (item) => {
        await upload(item.buffer, item.path, item.mime_type);
        return true;
      })
    );
    const createdBasisOption = await this.basisRepository.create({
      name: payload.name,
      type: BASIS_TYPES.OPTION,
      subs: mappingBasisOption.basis_option,
    });
    if (!createdBasisOption) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    const { type, ...rest } = createdBasisOption;
    const returnedOptions = addCountBasis(rest.subs);
    return successResponse({
      data: {
        ...rest,
        count: payload.subs.length,
        subs: returnedOptions,
      },
    });
  }

  public async getBasisOption(id: string) {
    const basisOptionGroup = await this.basisRepository.find(id);
    if (!basisOptionGroup) {
      return errorMessageResponse(MESSAGES.BASIS_OPTION_NOT_FOUND, 404);
    }
    const option = addCountBasis(basisOptionGroup.subs);
    const { type, ...rest } = basisOptionGroup;
    return successResponse({
      data: {
        ...rest,
        count: basisOptionGroup.subs.length,
        subs: option,
      },
    });
  }

  public async getListBasisOption(
    limit: number,
    offset: number,
    filter: any,
    groupOrder: "ASC" | "DESC",
    optionOrder: "ASC" | "DESC"
  ) {
    const basisOptionGroups =
      await this.basisRepository.getListBasisWithPagination(
        limit,
        offset,
        BASIS_TYPES.OPTION,
        groupOrder
      );
    const returnedBasisOption = sortBasisOption(
      basisOptionGroups.data,
      optionOrder
    );
    const summaryTable = getSummaryTable(basisOptionGroups.data);
    const summary = [
      {
        name: "Option Group",
        value: summaryTable.countGroup,
      },
      {
        name: "Option",
        value: summaryTable.countSub,
      },
      {
        name: "Value",
        value: summaryTable.countItem,
      },
    ];
    return successResponse({
      data: {
        basis_options: returnedBasisOption,
        summary,
        pagination: basisOptionGroups.pagination,
      },
    });
  }

  public async updateBasisOption(
    id: string,
    payload: IUpdateBasisOptionRequest
  ) {
    const basisOptionGroup = await this.basisRepository.find(id);
    if (!basisOptionGroup) {
      return errorMessageResponse(MESSAGES.BASIS_OPTION_NOT_FOUND, 404);
    }
    const existedGroup = await this.basisRepository.getExistedBasis(
      id,
      payload.name,
      BASIS_TYPES.OPTION
    );
    if (existedGroup) {
      return errorMessageResponse(MESSAGES.BASIS_OPTION_EXISTED);
    }
    if (
      isDuplicatedString(
        payload.subs.map((item) => {
          return item.name;
        })
      )
    ) {
      return errorMessageResponse(MESSAGES.BASIS_OPTION_DUPLICATED);
    }
    const basisOptions = await mappingBasisOptionUpdate(
      payload,
      basisOptionGroup
    );
    if (!basisOptions.is_valid_image) {
      return errorMessageResponse(MESSAGES.IMAGE_INVALID);
    }
    await Promise.all(
      basisOptions.valid_upload_image.map(async (item) => {
        await upload(item.buffer, item.path, item.mime_type);
        return true;
      })
    );
    const updatedAttribute = await this.basisRepository.update(id, {
      ...payload,
      subs: basisOptions,
    });
    if (!updatedAttribute) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }
    return await this.getBasisOption(id);
  }

  public async createBasisPreset(payload: IBasisPresetRequest) {
    const basisOptionGroup = await this.basisRepository.findBy({
      type: BASIS_TYPES.PRESET,
      name: payload.name,
    });
    if (basisOptionGroup) {
      return errorMessageResponse(MESSAGES.BASIS_PRESET_EXISTED);
    }
    if (
      isDuplicatedString(
        payload.subs.map((item) => {
          return item.name;
        })
      )
    ) {
      return errorMessageResponse(MESSAGES.BASIS_PRESET_DUPLICATED);
    }
    const presets = mappingBasisPresetCreate(payload);
    const createdBasisPreset = await this.basisRepository.create({
      name: payload.name,
      type: BASIS_TYPES.PRESET,
      subs: presets,
    });
    if (!createdBasisPreset) {
      return successMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    const { type, ...rest } = createdBasisPreset;
    const returnedPresets = addCountBasis(rest.subs);
    return successResponse({
      data: {
        ...rest,
        count: payload.subs.length,
        subs: returnedPresets,
      },
    });
  }

  public async getBasisPreset(id: string) {
    const basisPresetGroup = await this.basisRepository.find(id);
    if (!basisPresetGroup) {
      return errorMessageResponse(MESSAGES.BASIS_PRESET_NOT_FOUND);
    }
    const { type, ...rest } = basisPresetGroup;
    const preset = addCountBasis(rest.subs);
    return successResponse({
      data: {
        ...rest,
        count: rest.subs.length,
        subs: preset,
      },
    });
  }

  public async getListBasisPreset(
    limit: number,
    offset: number,
    filter: any,
    groupOrder: "ASC" | "DESC",
    presetOrder: "ASC" | "DESC"
  ) {
    const basisPresetGroups =
      await this.basisRepository.getListBasisWithPagination(
        limit,
        offset,
        BASIS_TYPES.PRESET,
        groupOrder
      );
    const returnedGroups = sortBasisPreset(basisPresetGroups.data, presetOrder);
    const summaryTable = getSummaryTable(basisPresetGroups.data);
    const summary = [
      {
        name: "Preset Group",
        value: summaryTable.countGroup,
      },
      {
        name: "Preset",
        value: summaryTable.countSub,
      },
      {
        name: "Value",
        value: summaryTable.countItem,
      },
    ];
    return successResponse({
      data: {
        basis_presets: returnedGroups,
        summary,
        pagination: basisPresetGroups.pagination,
      },
    });
  }

  public async updateBasisPreset(
    id: string,
    payload: IUpdateBasisPresetRequest
  ) {
    const basisPresetGroup = await this.basisRepository.find(id);
    if (!basisPresetGroup) {
      return errorMessageResponse(MESSAGES.BASIS_PRESET_NOT_FOUND, 404);
    }
    const existedGroup = await this.basisRepository.getExistedBasis(
      id,
      payload.name,
      BASIS_TYPES.PRESET
    );
    if (existedGroup) {
      return errorMessageResponse(MESSAGES.BASIS_PRESET_EXISTED);
    }
    if (
      isDuplicatedString(
        payload.subs.map((item) => {
          return item.name;
        })
      )
    ) {
      return errorMessageResponse(MESSAGES.BASIS_PRESET_DUPLICATED);
    }

    const presets = mappingBasisPresetUpdate(payload, basisPresetGroup);
    const updatedAttribute = await this.basisRepository.update(id, {
      ...payload,
      subs: presets,
    });
    if (!updatedAttribute) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }
    return await this.getBasisPreset(id);
  }
}
