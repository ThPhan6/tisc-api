import {
  BASIS_TYPES,
  LONG_TEXT_ID,
  MESSAGES,
  SHORT_TEXT_ID,
} from "@/constants";
import {
  getSummaryTable,
  toSingleSpaceAndToLowerCase,
} from "@/helpers/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { AdditionalSubGroupType } from "@/models/additional_sub_group.model";
import { additionalSubGroupRepository } from "@/repositories/additional_sub_group.repository";
import { default as AttributeRepository } from "@/repositories/attribute.repository";
import { default as BasisRepository } from "@/repositories/basis.repository";
import { basisOptionMainRepository } from "@/repositories/basis_option_main.repository";
import { SortOrder } from "@/types";
import { v4 as uuid } from "uuid";
import {
  addBasisOptionMain,
  addBasisPresetSubGroup,
} from "../basis/basis.mapping";
import {
  addAttributeSubGroup,
  checkAttributeDuplicateByName,
  getFlatListBasis,
  getListAttributeWithSort,
  mappingAttributeCreate,
  mappingAttributeUpdate,
  mappingSubAttribute,
} from "./attribute.mapping";
import { IAttributeRequest, IUpdateAttributeRequest } from "./attribute.type";

class AttributeService {
  private async getFlatListContentType() {
    const conversionGroups = await BasisRepository.getAllBasisByType(
      BASIS_TYPES.CONVERSION
    );
    const presetGroups = await BasisRepository.getAllBasisByType(
      BASIS_TYPES.PRESET
    );
    const optionGroups = await BasisRepository.getAllBasisByType(
      BASIS_TYPES.OPTION
    );
    return getFlatListBasis(conversionGroups, presetGroups, optionGroups);
  }

  public async create(payload: IAttributeRequest) {
    const duplicatedAttribute = checkAttributeDuplicateByName(payload);
    if (duplicatedAttribute) {
      return errorMessageResponse(duplicatedAttribute);
    }

    // const subData = mappingAttributes(payload);
    const id = uuid();
    const data = await mappingAttributeCreate(payload, id);

    const createdAttribute = await AttributeRepository.create({
      id,
      name: toSingleSpaceAndToLowerCase(payload.name),
      type: payload.type,
      subs: data,
    });
    if (!createdAttribute) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }
    return this.get(createdAttribute.id);
  }

  public async get(id: string) {
    const contentTypes = await this.getFlatListContentType();
    const attribute = await AttributeRepository.find(id);
    if (!attribute) {
      return errorMessageResponse(MESSAGES.ATTRIBUTE.ATTRIBUTE_NOT_FOUND, 404);
    }
    const subResponses = mappingSubAttribute(attribute, contentTypes);
    const { type, ...rest } = attribute;
    const data = {
      ...rest,
      count: attribute.subs.length,
      subs: subResponses,
    };
    const subGroups = await additionalSubGroupRepository.getAllBy({
      type: AdditionalSubGroupType.Attribute,
      relation_id: attribute.id,
    });
    const addedSubGroups = addAttributeSubGroup([data], subGroups);
    return successResponse({
      data: addedSubGroups[0],
    });
  }

  public async getList(
    attribute_type: number,
    limit: number,
    offset: number,
    _filter: any,
    group_order: SortOrder | undefined,
    attribute_order?: SortOrder,
    content_type_order?: SortOrder,
    sub_group_order?: SortOrder
  ) {
    const contentTypes = await this.getFlatListContentType();
    const attributeWithPagination =
      await AttributeRepository.getListWithPagination(
        limit,
        offset,
        attribute_type,
        group_order
      );

    const rawAttributes = getListAttributeWithSort(
      attributeWithPagination.data,
      contentTypes,
      attribute_order,
      content_type_order
    );
    const attributeSubGroups = await additionalSubGroupRepository.getAllBy({
      type: AdditionalSubGroupType.Attribute,
    });
    const addedSubGroups = addAttributeSubGroup(
      rawAttributes,
      attributeSubGroups,
      sub_group_order || "ASC"
    );
    const summaryTable = getSummaryTable(addedSubGroups);
    const summary = [
      {
        name: "Main",
        value: summaryTable.countGroup,
      },
      {
        name: "Sub",
        value: summaryTable.countSub,
      },
      {
        name: "Attribute",
        value: summaryTable.countItem,
      },
    ];
    return successResponse({
      data: {
        attributes: addedSubGroups,
        summary,
        pagination: attributeWithPagination.pagination,
      },
    });
  }

  public async update(id: string, payload: IUpdateAttributeRequest) {
    const attribute = await AttributeRepository.find(id);

    if (!attribute) {
      return errorMessageResponse(MESSAGES.ATTRIBUTE.ATTRIBUTE_NOT_FOUND, 404);
    }

    if (attribute.master) {
      return errorMessageResponse(MESSAGES.GENERAL.CAN_NOT_MODIFY_MASTER_DATA);
    }

    const duplicatedAttribute = checkAttributeDuplicateByName(payload);
    if (duplicatedAttribute) {
      return errorMessageResponse(duplicatedAttribute);
    }
    const mappedAttribute = mappingAttributeUpdate(payload, attribute);

    // const subData = mappingAttributes(payload);

    await Promise.all(
      mappedAttribute.subGroups.map(async (subGroup) => {
        const find = await additionalSubGroupRepository.find(subGroup.id);
        if (!find) {
          return additionalSubGroupRepository.create(subGroup);
        }
        return additionalSubGroupRepository.update(subGroup.id, {
          name: subGroup.name,
        });
      })
    );
    const updatedAttribute = await AttributeRepository.update(id, {
      ...payload,
      subs: mappedAttribute.data,
      name: toSingleSpaceAndToLowerCase(payload.name),
    });
    if (!updatedAttribute) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);
    }

    const group = (await this.get(id)) as any;
    let result = group;

    await Promise.all(
      group.data.subs.map(async (s: any) => {
        if (s.content_type !== "Presets") {
          return;
        }

        const sub = await BasisRepository.getSubBasisPresetById(s.basis_id);

        result = { ...result, sub: sub };
      })
    );

    return this.get(id);
  }

  public async delete(id: string) {
    const attribute = await AttributeRepository.find(id);
    if (!attribute) {
      return errorMessageResponse(MESSAGES.CATEGORY.CATEGORY_NOT_FOUND, 404);
    }
    if (attribute.master) {
      return errorMessageResponse(MESSAGES.GENERAL.CAN_NOT_DELETE_MASTER_DATA);
    }
    await AttributeRepository.delete(id);
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async getListContentType() {
    const basesGroupByType = await BasisRepository.getAllBasesGroupByType();
    const mains = await basisOptionMainRepository.getAll();
    const addedMain = addBasisOptionMain(basesGroupByType.options, mains);

    const basisPresetSubGroups = await additionalSubGroupRepository.getAllBy({
      type: AdditionalSubGroupType.Preset,
    });

    const presetsAddedSub = addBasisPresetSubGroup(
      basesGroupByType.presets,
      basisPresetSubGroups
    );

    const featurePresetsAddedSub = addBasisPresetSubGroup(
      basesGroupByType.feature_presets,
      basisPresetSubGroups
    );

    return successResponse({
      data: {
        texts: [
          {
            id: LONG_TEXT_ID,
            name: "Long Format",
          },
          {
            id: SHORT_TEXT_ID,
            name: "Short Format",
          },
        ],
        ...basesGroupByType,
        presets: presetsAddedSub,
        feature_presets: featurePresetsAddedSub,
        options: addedMain,
      },
    });
  }

  public async getAllAttribute() {
    const { general, feature, specification } =
      await AttributeRepository.getAllAttributesGroupByType();
    return successResponse({
      data: { general, feature, specification },
    });
  }
}

export default new AttributeService();
