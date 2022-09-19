import AttributeRepository from "@/repositories/attribute.repository";
import { IContentType } from "@/types/attribute.type";
import { v4 as uuid } from "uuid";
import {
  ATTRIBUTE_TYPES,
  BASIS_TYPES,
  MESSAGES,
} from "../../constant/common.constant";
import { getSummaryTable } from "../../helper/common.helper";
import BasisModel from "../../model/basis.model";
import { IMessageResponse } from "../../type/common.type";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "./../../helper/response.helper";
import {
  checkAttributeDuplicateByName,
  getBasisType,
  getFlatListBasis,
  getListAttributeWithSort,
  mappingAttributeData,
  mappingContentTypeList,
  mappingSubAttribute,
  mappingSubAttributeUpdate,
} from "./attribute.mapping";
import {
  IAttributeRequest,
  IGetAllAttributeResponse,
  IUpdateAttributeRequest,
} from "./attribute.type";
export default class AttributeService {
  private basisModel: BasisModel;
  private attributeRepository: AttributeRepository;
  constructor() {
    this.basisModel = new BasisModel();
    this.attributeRepository = new AttributeRepository();
  }

  private getFlatListContentType = async (): Promise<IContentType[]> => {
    const conversionGroups = await this.basisModel.getAllBasisByType(
      BASIS_TYPES.CONVERSION
    );
    const presetGroups = await this.basisModel.getAllBasisByType(
      BASIS_TYPES.PRESET
    );
    const optionGroups = await this.basisModel.getAllBasisByType(
      BASIS_TYPES.OPTION
    );
    return getFlatListBasis(conversionGroups, presetGroups, optionGroups);
  };

  public async create(payload: IAttributeRequest) {
    const attribute = await this.attributeRepository.findBy({
      name: payload.name,
    });
    if (attribute) {
      return errorMessageResponse(MESSAGES.ATTRIBUTE_EXISTED);
    }

    const duplicatedAttribute = checkAttributeDuplicateByName(payload);
    if (duplicatedAttribute) {
      return errorMessageResponse(duplicatedAttribute);
    }
    const subData = payload.subs.map((item) => {
      return {
        id: uuid(),
        name: item.name,
        basis_id: item.basis_id,
      };
    });
    const createdAttribute = await this.attributeRepository.create({
      name: payload.name,
      type: payload.type,
      subs: subData,
    });
    if (!createdAttribute) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    return this.get(createdAttribute.id);
  }

  public async get(id: string) {
    const contentTypes = await this.getFlatListContentType();
    const attribute = await this.attributeRepository.find(id);
    if (!attribute) {
      return errorMessageResponse(MESSAGES.ATTRIBUTE_NOT_FOUND, 404);
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
    filter: any,
    group_order: "ASC" | "DESC",
    attribute_order: "ASC" | "DESC",
    content_type_order: "ASC" | "DESC"
  ) {
    const contentTypes = await this.getFlatListContentType();
    const attributeWithPagination =
      await this.attributeRepository.getListWithPagination(
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

    const allAttributeByType = await this.attributeRepository.getByType(
      attribute_type
    );
    const summaryTable = getSummaryTable(allAttributeByType);
    const summary = [
      {
        name:
          attribute_type === ATTRIBUTE_TYPES.SPECIFICATION
            ? "Specification Group"
            : "Attribute Group",
        value: summaryTable.countGroup,
      },
      {
        name:
          attribute_type === ATTRIBUTE_TYPES.SPECIFICATION
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
    const attribute = await this.attributeRepository.find(id);
    if (!attribute) {
      return errorMessageResponse(MESSAGES.ATTRIBUTE_NOT_FOUND, 404);
    }
    const duplicatedAttributeGroup =
      await this.attributeRepository.getDuplicatedAttribute(id, payload.name);
    if (duplicatedAttributeGroup) {
      return errorMessageResponse(MESSAGES.GROUP_ATTRIBUTE_DUPLICATED);
    }

    const duplicatedAttribute = checkAttributeDuplicateByName(payload);
    if (duplicatedAttribute) {
      return errorMessageResponse(duplicatedAttribute);
    }
    const subData = mappingSubAttributeUpdate(attribute, payload);
    const updatedAttribute = await this.attributeRepository.update(id, {
      ...payload,
      subs: subData,
    });
    if (!updatedAttribute) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }
    return this.get(id);
  }

  public async delete(id: string) {
    const deletedAttribute = await this.attributeRepository.findAndDelete(id);
    if (!deletedAttribute) {
      return errorMessageResponse(MESSAGES.CATEGORY_NOT_FOUND, 404);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async getListContentType() {
    const conversionGroups = await this.basisModel.getAllBasisByType(
      BASIS_TYPES.CONVERSION
    );
    const presetGroups = await this.basisModel.getAllBasisByType(
      BASIS_TYPES.PRESET
    );
    const optionGroups = await this.basisModel.getAllBasisByType(
      BASIS_TYPES.OPTION
    );

    const responseData = mappingContentTypeList(
      conversionGroups,
      presetGroups,
      optionGroups
    );
    return successResponse({
      data: responseData,
    });
  }

  public getAllAttribute = (): Promise<
    IMessageResponse | IGetAllAttributeResponse
  > => {
    return new Promise(async (resolve) => {
      const bases = await this.basisModel.getAll();
      const subsBasis = bases.reduce((pre, cur) => {
        const temp = cur.subs.map((item: any) => ({
          ...item,
          type: getBasisType(cur.type),
        }));
        return pre.concat(temp);
      }, []);
      const returnedGeneralAttributes = mappingAttributeData(
        await this.attributeRepository.getByType(ATTRIBUTE_TYPES.GENERAL),
        subsBasis
      );
      const returnedFeatureAttributes = mappingAttributeData(
        await this.attributeRepository.getByType(ATTRIBUTE_TYPES.FEATURE),
        subsBasis
      );
      const returnedSpecificationAttributes = mappingAttributeData(
        await this.attributeRepository.getByType(ATTRIBUTE_TYPES.SPECIFICATION),
        subsBasis
      );
      return resolve({
        data: {
          general: returnedGeneralAttributes,
          feature: returnedFeatureAttributes,
          specification: returnedSpecificationAttributes,
        },
        statusCode: 200,
      });
    });
  };
}
