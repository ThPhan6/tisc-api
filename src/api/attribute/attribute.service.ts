import {
  BASIS_TYPES,
  LONG_TEXT_ID,
  MESSAGES,
  SHORT_TEXT_ID,
} from "@/constants";
import {
  getSummaryTable,
  toSingleSpaceAndToLowerCase,
} from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import AttributeRepository from "@/repositories/attribute.repository";
import basisRepository from "@/repositories/basis.repository";
import BasisRepository from "@/repositories/basis.repository";
import { AttributeType, SortOrder } from "@/types";
import {
  checkAttributeDuplicateByName,
  getFlatListBasis,
  getListAttributeWithSort,
  getSubBasisAttribute,
  mappingAttributeData,
  mappingAttributes,
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

    const subData = mappingAttributes(payload);

    const createdAttribute = await AttributeRepository.create({
      name: toSingleSpaceAndToLowerCase(payload.name),
      type: payload.type,
      subs: subData,
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

    return successResponse({
      data: {
        ...rest,
        count: attribute.subs.length,
        subs: subResponses,
      },
    });
  }

  public async getList(
    attribute_type: number,
    limit: number,
    offset: number,
    _filter: any,
    group_order: SortOrder | undefined,
    attribute_order?: SortOrder,
    content_type_order?: SortOrder
  ) {
    const contentTypes = await this.getFlatListContentType();
    const attributeWithPagination =
      await AttributeRepository.getListWithPagination(
        limit,
        offset,
        attribute_type,
        group_order
      );

    const returnedAttributes = getListAttributeWithSort(
      attributeWithPagination.data,
      contentTypes,
      attribute_order,
      content_type_order
    );

    const allAttributeByType = await AttributeRepository.getByType(
      attribute_type
    );
    const summaryTable = getSummaryTable(allAttributeByType);
    const summary = [
      {
        name:
          attribute_type === AttributeType.Specification
            ? "Specification Group"
            : "Attribute Group",
        value: summaryTable.countGroup,
      },
      {
        name:
          attribute_type === AttributeType.Specification
            ? "Specification"
            : "Attribute",
        value: summaryTable.countSub,
      },
    ];
    return successResponse({
      data: {
        attributes: returnedAttributes,
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

    const subData = mappingAttributes(payload);

    const updatedAttribute = await AttributeRepository.update(id, {
      ...payload,
      subs: subData,
      name: toSingleSpaceAndToLowerCase(payload.name),
    });
    if (!updatedAttribute) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);
    }
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
    const basesGroupByType = await basisRepository.getAllBasesGroupByType();

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
      },
    });
  }

  public async getAllAttribute() {
    const bases = await BasisRepository.getAll();
    const subsBasis = getSubBasisAttribute(bases);
    const returnedGeneralAttributes = mappingAttributeData(
      await AttributeRepository.getByType(AttributeType.General),
      subsBasis
    );
    const returnedFeatureAttributes = mappingAttributeData(
      await AttributeRepository.getByType(AttributeType.Feature),
      subsBasis
    );
    const returnedSpecificationAttributes = mappingAttributeData(
      await AttributeRepository.getByType(AttributeType.Specification),
      subsBasis
    );
    return successResponse({
      data: {
        general: returnedGeneralAttributes,
        feature: returnedFeatureAttributes,
        specification: returnedSpecificationAttributes,
      },
    });
  }
}

export default new AttributeService();
