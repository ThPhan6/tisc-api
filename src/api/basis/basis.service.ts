import { MESSAGES, BASIS_TYPES, ImageSize } from "@/constants";
import {
  getBasisOptionSummaryTable,
  getSummaryTable,
  isDuplicatedString,
  toSingleSpaceAndToLowerCase,
} from "@/helpers/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import BasisRepository from "@/repositories/basis.repository";
import { basisOptionMainRepository } from "@/repositories/basis_option_main.repository";
import { uploadImages } from "@/services/image.service";
import { SortOrder } from "@/types";
import { sortBy } from "lodash";
import { v4 as uuid } from "uuid";
import {
  addBasisOptionMain,
  addCountBasis,
  duplicateBasisConversion,
  mappingBasisConversion,
  mappingBasisOptionCreate,
  mappingBasisOptionUpdate,
  mappingBasisPresetCreate,
  mappingBasisPresetUpdate,
  sortBasisConversion,
  sortBasisOption,
  sortBasisOptionOrPreset,
} from "./basis.mapping";
import {
  IBasisConversionRequest,
  IBasisConversionUpdateRequest,
  IBasisOptionRequest,
  IBasisPresetRequest,
  IUpdateBasisOptionRequest,
  IUpdateBasisPresetRequest,
} from "./basis.type";

class BasisService {
  public async createBasisConversion(payload: IBasisConversionRequest) {
    const conversionGroup = await BasisRepository.findBy({
      name: toSingleSpaceAndToLowerCase(payload.name),
      type: BASIS_TYPES.CONVERSION,
    });
    if (conversionGroup) {
      return errorMessageResponse(
        MESSAGES.BASIS.BASIS_CONVERSION_GROUP_DUPLICATED
      );
    }
    const isDuplicateBasisConversion = duplicateBasisConversion(payload);
    if (isDuplicateBasisConversion) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_CONVERSION_DUPLICATED);
    }
    const conversions = payload.subs.map((item) => {
      return {
        id: uuid(),
        name_1: toSingleSpaceAndToLowerCase(item.name_1),
        name_2: toSingleSpaceAndToLowerCase(item.name_2),
        formula_1: item.formula_1,
        formula_2: item.formula_2,
        unit_1: item.unit_1,
        unit_2: item.unit_2,
      };
    });

    const createdBasisConversion = await BasisRepository.create({
      name: toSingleSpaceAndToLowerCase(payload.name),
      type: BASIS_TYPES.CONVERSION,
      subs: sortBy(conversions, "name_1"),
    });
    if (!createdBasisConversion) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }
    const { type, ...rest } = createdBasisConversion;

    return successResponse({
      data: rest,
    });
  }

  public async getBasisConversions(
    limit: number,
    offset: number,
    _filter: any,
    conversion_group_order: SortOrder | undefined,
    conversion_between_order: SortOrder
  ) {
    const conversionGroups = await BasisRepository.getListBasisWithPagination(
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
    const basisConversionGroup = await BasisRepository.find(id);
    if (!basisConversionGroup) {
      return errorMessageResponse(
        MESSAGES.BASIS.BASIS_CONVERSION_NOT_FOUND,
        404
      );
    }
    const basisConversion = mappingBasisConversion(basisConversionGroup.subs);
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
    const basisConversionGroup = await BasisRepository.find(id);
    if (!basisConversionGroup) {
      return errorMessageResponse(
        MESSAGES.BASIS.BASIS_CONVERSION_NOT_FOUND,
        404
      );
    }

    if (basisConversionGroup.master) {
      return errorMessageResponse(MESSAGES.GENERAL.CAN_NOT_MODIFY_MASTER_DATA);
    }

    const duplicatedConversionGroup = await BasisRepository.getExistedBasis(
      id,
      toSingleSpaceAndToLowerCase(payload.name),
      BASIS_TYPES.CONVERSION
    );
    if (duplicatedConversionGroup) {
      return errorMessageResponse(
        MESSAGES.BASIS.BASIS_CONVERSION_GROUP_DUPLICATED
      );
    }
    const isDuplicateBasisConversion = duplicateBasisConversion(payload);
    if (isDuplicateBasisConversion) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_CONVERSION_DUPLICATED);
    }

    const conversions = payload.subs.map((item) => ({
      ...item,
      id: item.id || uuid(),
      name_1: toSingleSpaceAndToLowerCase(item.name_1),
      name_2: toSingleSpaceAndToLowerCase(item.name_2),
    }));

    const updatedBasisConversion = await BasisRepository.update(id, {
      name: toSingleSpaceAndToLowerCase(payload.name),
      type: BASIS_TYPES.CONVERSION,
      subs: sortBy(conversions, "name_1"),
    });

    if (!updatedBasisConversion) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);
    }
    const { type, ...rest } = updatedBasisConversion;
    return successResponse({
      data: rest,
    });
  }

  public async deleteBasis(id: string) {
    const basisConversion = await BasisRepository.find(id);
    if (!basisConversion) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_NOT_FOUND, 404);
    }
    if (basisConversion.master) {
      return errorMessageResponse(MESSAGES.GENERAL.CAN_NOT_DELETE_MASTER_DATA);
    }
    await BasisRepository.delete(id);
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async createBasisOption(payload: IBasisOptionRequest) {
    const basisOptionGroup = await BasisRepository.findBy({
      type: BASIS_TYPES.OPTION,
      name: toSingleSpaceAndToLowerCase(payload.name),
    });
    if (basisOptionGroup) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_OPTION_EXISTED);
    }
    if (
      isDuplicatedString(
        payload.subs.map((item) => {
          return toSingleSpaceAndToLowerCase(item.name);
        })
      )
    ) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_OPTION_DUPLICATED);
    }
    let isDupOptionName = false;
    payload.subs.forEach((main: any) => {
      if (
        isDuplicatedString(
          main.subs.map((sub: any) => {
            return toSingleSpaceAndToLowerCase(sub.name);
          })
        )
      )
        isDupOptionName = true;
    });
    if (isDupOptionName)
      return errorMessageResponse(MESSAGES.BASIS.BASIS_OPTION_DUPLICATED);

    const groupId = uuid();
    const mappingBasisOption = await mappingBasisOptionCreate(payload, groupId);
    if (!mappingBasisOption.is_valid_image) {
      return errorMessageResponse(MESSAGES.IMAGE_INVALID);
    }
    await uploadImages(mappingBasisOption.valid_upload_image, ImageSize.small);
    const createdBasisOption = await BasisRepository.create({
      name: toSingleSpaceAndToLowerCase(payload.name),
      type: BASIS_TYPES.OPTION,
      subs: mappingBasisOption.basis_option,
      id: groupId,
    });
    if (!createdBasisOption) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }

    return this.getBasisOption(createdBasisOption.id);
  }

  public async getBasisOption(id: string) {
    const basisOptionGroup = await BasisRepository.find(id);
    if (!basisOptionGroup) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_OPTION_NOT_FOUND, 404);
    }
    const mains = await basisOptionMainRepository.getAllBy({
      basis_option_group_id: basisOptionGroup.id,
    });
    const addedMain = addBasisOptionMain([basisOptionGroup], mains);
    const returnedBasisOption = sortBasisOption(addedMain);

    return successResponse({
      data: returnedBasisOption[0],
    });
  }

  public async getListBasisOption(
    limit: number,
    offset: number,
    _filter: any,
    groupOrder?: SortOrder,
    mainOrder?: SortOrder,
    optionOrder?: SortOrder
  ) {
    const basisOptionGroups = await BasisRepository.getListBasisWithPagination(
      limit,
      offset,
      BASIS_TYPES.OPTION,
      groupOrder
    );
    const basisOptionMains = await basisOptionMainRepository.getAll();
    const addedMain = addBasisOptionMain(
      basisOptionGroups.data,
      basisOptionMains
    );
    const returnedBasisOption = sortBasisOption(
      addedMain,
      mainOrder,
      optionOrder
    );
    const summaryTable = getBasisOptionSummaryTable(addedMain);
    const summary = [
      {
        name: "Group Options",
        value: summaryTable.countGroup,
      },
      {
        name: "Main Options",
        value: summaryTable.countMain,
      },
      {
        name: "Sub Options",
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
    const basisOptionGroup = await BasisRepository.find(id);
    if (!basisOptionGroup) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_OPTION_NOT_FOUND, 404);
    }
    const existedGroup = await BasisRepository.getExistedBasis(
      id,
      toSingleSpaceAndToLowerCase(payload.name),
      BASIS_TYPES.OPTION
    );
    if (existedGroup) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_OPTION_EXISTED);
    }
    if (
      isDuplicatedString(
        payload.subs.map((item) => {
          return item.name;
        })
      )
    ) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_OPTION_DUPLICATED);
    }
    let isDupOptionName = false;
    payload.subs.forEach((main: any) => {
      if (
        isDuplicatedString(
          main.subs.map((sub: any) => {
            return toSingleSpaceAndToLowerCase(sub.name);
          })
        )
      )
        isDupOptionName = true;
    });
    if (isDupOptionName)
      return errorMessageResponse(MESSAGES.BASIS.BASIS_OPTION_DUPLICATED);

    const mappingBasisOption = await mappingBasisOptionUpdate(
      payload,
      basisOptionGroup
    );
    if (!mappingBasisOption.is_valid_image) {
      return errorMessageResponse(MESSAGES.IMAGE.IMAGE_INVALID);
    }
    await uploadImages(mappingBasisOption.valid_upload_image, ImageSize.small);

    const updatedAttribute = await BasisRepository.update(id, {
      ...payload,
      subs: mappingBasisOption.basis_option,
      name: toSingleSpaceAndToLowerCase(payload.name),
    });
    if (!updatedAttribute) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);
    }
    return this.getBasisOption(id);
  }

  public async createBasisPreset(payload: IBasisPresetRequest) {
    const basisOptionGroup = await BasisRepository.findBy({
      type: BASIS_TYPES.PRESET,
      name: toSingleSpaceAndToLowerCase(payload.name),
    });
    if (basisOptionGroup) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_PRESET_EXISTED);
    }
    if (
      isDuplicatedString(
        payload.subs.map((item) => {
          return item.name;
        })
      )
    ) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_PRESET_DUPLICATED);
    }
    const presets = mappingBasisPresetCreate(payload);
    const createdBasisPreset = await BasisRepository.create({
      name: toSingleSpaceAndToLowerCase(payload.name),
      type: BASIS_TYPES.PRESET,
      subs: presets,
    });
    if (!createdBasisPreset) {
      return successMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
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
    const basisPresetGroup = await BasisRepository.find(id);
    if (!basisPresetGroup) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_PRESET_NOT_FOUND);
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
    _filter: any,
    groupOrder: SortOrder | undefined,
    presetOrder: SortOrder
  ) {
    const basisPresetGroups = await BasisRepository.getListBasisWithPagination(
      limit,
      offset,
      BASIS_TYPES.PRESET,
      groupOrder
    );
    const returnedGroups = sortBasisOptionOrPreset(
      basisPresetGroups.data,
      presetOrder
    );
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
    const basisPresetGroup = await BasisRepository.find(id);
    if (!basisPresetGroup) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_PRESET_NOT_FOUND, 404);
    }
    const existedGroup = await BasisRepository.getExistedBasis(
      id,
      toSingleSpaceAndToLowerCase(payload.name),
      BASIS_TYPES.PRESET
    );
    if (existedGroup) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_PRESET_EXISTED);
    }
    if (
      isDuplicatedString(
        payload.subs.map((item) => {
          return item.name;
        })
      )
    ) {
      return errorMessageResponse(MESSAGES.BASIS.BASIS_PRESET_DUPLICATED);
    }

    const presets = mappingBasisPresetUpdate(payload, basisPresetGroup);
    const updatedAttribute = await BasisRepository.update(id, {
      ...payload,
      subs: presets,
      name: toSingleSpaceAndToLowerCase(payload.name),
    });
    if (!updatedAttribute) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);
    }
    return this.getBasisPreset(id);
  }
}

export default new BasisService();
