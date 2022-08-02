import ProjectModel from "../../model/project.model";
import UserModel from "../../model/user.model";
import ConsideredProductModel from "../../model/considered_product.model";
import RequirementTypeModel, {
  REQUIREMENT_TYPE_NULL_ATTRIBUTES,
} from "../../model/requirement_type.model";
import InstructionTypeModel from "../../model/instruction_type.model";
import UnitTypeModel, {
  UNIT_TYPE_NULL_ATTRIBUTES,
} from "../../model/unit_type.model";
import SpecifiedProductModel, {
  SPECIFIED_PRODUCT_NULL_ATTRIBUTES,
} from "../../model/specified_product.model";
import { MESSAGES } from "../../constant/common.constant";

import { IMessageResponse } from "../../type/common.type";
import {
  IInstructionTypesResponse,
  IRequirementTypesResponse,
  ISpecifiedProductRequest,
  ISpecifiedProductResponse,
  IUnitTypesResponse,
} from "./specified_product.type";

export default class SpecifiedProductService {
  private consideredProductModel: ConsideredProductModel;
  private specifiedProductModel: SpecifiedProductModel;
  private requirementTypeModel: RequirementTypeModel;
  private instructionTypeModel: InstructionTypeModel;
  private unitTypeModel: UnitTypeModel;
  private projectModel: ProjectModel;
  private userModel: UserModel;

  constructor() {
    this.consideredProductModel = new ConsideredProductModel();
    this.specifiedProductModel = new SpecifiedProductModel();
    this.requirementTypeModel = new RequirementTypeModel();
    this.instructionTypeModel = new InstructionTypeModel();
    this.unitTypeModel = new UnitTypeModel();
    this.projectModel = new ProjectModel();
    this.userModel = new UserModel();
  }
  public getRequirementTypes = (
    user_id: string
  ): Promise<IRequirementTypesResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const rawTypes = await this.requirementTypeModel.getAllBy(
        { design_id: "0" },
        ["id", "name"],
        "created_at",
        "ASC"
      );
      const types = await this.requirementTypeModel.getAllBy(
        { design_id: user.relation_id },
        ["id", "name"],
        "created_at",
        "ASC"
      );
      return resolve({
        data: rawTypes.concat(types),
        statusCode: 200,
      });
    });
  };
  public getInstructionTypes = (
    user_id: string
  ): Promise<IInstructionTypesResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const rawTypes = await this.instructionTypeModel.getAllBy(
        { design_id: "0" },
        ["id", "name"],
        "created_at",
        "ASC"
      );
      const types = await this.instructionTypeModel.getAllBy(
        { design_id: user.relation_id },
        ["id", "name"],
        "created_at",
        "ASC"
      );
      return resolve({
        data: rawTypes.concat(types),
        statusCode: 200,
      });
    });
  };
  public getUnitTypes = (user_id: string): Promise<IUnitTypesResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const rawTypes = await this.unitTypeModel.getAllBy(
        { design_id: "0" },
        ["id", "name", "code"],
        "created_at",
        "ASC"
      );
      const types = await this.unitTypeModel.getAllBy(
        { design_id: user.relation_id },
        ["id", "name", "code"],
        "created_at",
        "ASC"
      );
      return resolve({
        data: rawTypes.concat(types),
        statusCode: 200,
      });
    });
  };
  public specify = (
    user_id: string,
    payload: ISpecifiedProductRequest
  ): Promise<IMessageResponse | ISpecifiedProductResponse> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 200,
        });
      }
      const consideredProduct = await this.consideredProductModel.find(
        payload.considered_product_id
      );
      if (!consideredProduct) {
        return resolve({
          message: MESSAGES.CONSIDERED_PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const specifiedProduct = await this.specifiedProductModel.findBy({
        considered_product_id: payload.considered_product_id,
      });
      let unitType = await this.unitTypeModel.findByNameOrId(
        payload.unit_type_id
      );
      if (unitType === false) {
        unitType = await this.unitTypeModel.create({
          ...UNIT_TYPE_NULL_ATTRIBUTES,
          name: payload.unit_type_id,
          code: payload.unit_type_id.slice(2).toUpperCase(),
          design_id: user.relation_id || "0",
        });
      }
      const requirementTypeIds = await Promise.all(
        payload.requirement_type_ids.map(async (requirement_type_id) => {
          let requirementType = await this.requirementTypeModel.findByNameOrId(
            requirement_type_id
          );
          if (requirementType === false) {
            requirementType = await this.requirementTypeModel.create({
              ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
              name: requirement_type_id,
              design_id: user.relation_id || "0",
            });
          }
          return requirementType.id;
        })
      );
      const instructionTypeIds = await Promise.all(
        payload.instruction_type_ids.map(async (instruction_type_id) => {
          let instructionType = await this.instructionTypeModel.findByNameOrId(
            instruction_type_id
          );
          if (instructionType === false) {
            instructionType = await this.instructionTypeModel.create({
              ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
              name: instruction_type_id,
              design_id: user.relation_id || "0",
            });
          }
          return instructionType.id;
        })
      );
      if (!specifiedProduct) {
        //create
        const createdSpecifiedProduct = await this.specifiedProductModel.create(
          {
            ...SPECIFIED_PRODUCT_NULL_ATTRIBUTES,
            ...payload,
            unit_type_id: unitType.id,
            requirement_type_ids: requirementTypeIds,
            instruction_type_ids: instructionTypeIds,
          }
        );
        if (!createdSpecifiedProduct) {
          return resolve({
            message: MESSAGES.SOMETHING_WRONG_CREATE,
            statusCode: 400,
          });
        }
        return resolve({
          data: createdSpecifiedProduct,
          statusCode: 200,
        });
      }
      //update
      const updatedSpecifiedProduct = await this.specifiedProductModel.update(
        specifiedProduct.id,
        {
          ...payload,
          unit_type_id: unitType.id,
          requirement_type_ids: requirementTypeIds,
          instruction_type_ids: instructionTypeIds,
        }
      );
      if (!updatedSpecifiedProduct) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      return resolve({
        data: updatedSpecifiedProduct,
        statusCode: 200,
      });
    });

  public get = (user_id: string, considered_product_id: string): Promise<any> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 200,
        });
      }
      const consideredProduct = await this.consideredProductModel.find(
        considered_product_id
      );
      if (!consideredProduct) {
        return resolve({
          message: MESSAGES.CONSIDERED_PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const project = await this.projectModel.find(
        consideredProduct.project_id
      );
      if (!project) {
        return resolve({
          message: MESSAGES.PROJECT_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (project.design_id !== user.relation_id) {
        return resolve({
          message: MESSAGES.JUST_OWNER_CAN_GET,
          statusCode: 400,
        });
      }
      const specifiedProduct = await this.specifiedProductModel.findBy({
        considered_product_id,
      });
      if (!specifiedProduct) {
        return resolve({
          message: MESSAGES.CONSIDERED_PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      return resolve({
        data: specifiedProduct,
        statusCode: 200,
      });
    });
}
