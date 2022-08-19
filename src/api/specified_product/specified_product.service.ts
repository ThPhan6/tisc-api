import {
  MESSAGES,
  SPECIFIED_PRODUCT_STATUS,
} from "../../constant/common.constant";
import { getDistinctArray, sortObjectArray } from "../../helper/common.helper";
import AttributeModel from "../../model/attribute.model";
import BasisModel from "../../model/basis.model";
import BrandModel from "../../model/brand.model";
import CollectionModel from "../../model/collection.model";
import ConsideredProductModel, {
  IConsideredProductAttributes,
} from "../../model/considered_product.model";
import InstructionTypeModel from "../../model/instruction_type.model";
import MaterialCodeModel from "../../model/material_code.model";
import ProductModel from "../../model/product.model";
import ProjectModel from "../../model/project.model";
import ProjectZoneModel from "../../model/project_zone.model";
import RequirementTypeModel, {
  REQUIREMENT_TYPE_NULL_ATTRIBUTES,
} from "../../model/requirement_type.model";
import SpecifiedProductModel, {
  ISpecifiedProductAttributes,
  SPECIFIED_PRODUCT_NULL_ATTRIBUTES,
} from "../../model/specified_product.model";
import UnitTypeModel, {
  UNIT_TYPE_NULL_ATTRIBUTES,
} from "../../model/unit_type.model";
import UserModel from "../../model/user.model";
import { IMessageResponse, SortOrder } from "../../type/common.type";
import {
  IInstructionTypesResponse,
  IRequirementTypesResponse,
  ISpecifiedProductRequest,
  ISpecifiedProductResponse,
  IUnitTypesResponse,
  StatusSpecifiedProductRequest,
} from "./specified_product.type";

export default class SpecifiedProductService {
  private consideredProductModel: ConsideredProductModel;
  private specifiedProductModel: SpecifiedProductModel;
  private requirementTypeModel: RequirementTypeModel;
  private instructionTypeModel: InstructionTypeModel;
  private unitTypeModel: UnitTypeModel;
  private projectModel: ProjectModel;
  private userModel: UserModel;
  private productModel: ProductModel;
  private brandModel: BrandModel;
  private collectionModel: CollectionModel;
  private materialCodeModel: MaterialCodeModel;
  private projectZoneModel: ProjectZoneModel;
  private attributeModel: AttributeModel;
  private basisModel: BasisModel;

  constructor() {
    this.consideredProductModel = new ConsideredProductModel();
    this.specifiedProductModel = new SpecifiedProductModel();
    this.requirementTypeModel = new RequirementTypeModel();
    this.instructionTypeModel = new InstructionTypeModel();
    this.unitTypeModel = new UnitTypeModel();
    this.projectModel = new ProjectModel();
    this.userModel = new UserModel();
    this.productModel = new ProductModel();
    this.brandModel = new BrandModel();
    this.collectionModel = new CollectionModel();
    this.materialCodeModel = new MaterialCodeModel();
    this.projectZoneModel = new ProjectZoneModel();
    this.attributeModel = new AttributeModel();
    this.basisModel = new BasisModel();
  }
  private getSpecifiedProducts = async (
    foundConsideredProducts: IConsideredProductAttributes[],
    brand_order: SortOrder,
    specifiedProducts: ISpecifiedProductAttributes[]
  ) => {
    const products = await Promise.all(
      foundConsideredProducts.map(async (foundConsideredProduct) => {
        const specifiedProduct = specifiedProducts.find(
          (item) => item.considered_product_id === foundConsideredProduct.id
        );
        const product = await this.productModel.find(
          foundConsideredProduct.product_id
        );
        const brand = await this.brandModel.find(product?.brand_id || "");
        return {
          id: specifiedProduct?.id,
          image: product?.images[0],
          brand_name: brand?.name,
          product_id: product?.name,
          material_code: specifiedProduct?.material_code,
          description: specifiedProduct?.description,
          status: specifiedProduct?.status,
        };
      })
    );
    return sortObjectArray(products, "brand_name", brand_order);
  };
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
  public getUnitTypes = (
    user_id: string
  ): Promise<IUnitTypesResponse | IMessageResponse> => {
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

      const unitType = await this.unitTypeModel.find(payload.unit_type_id);
      if (!unitType) {
        return resolve({
          message: MESSAGES.UNIT_TYPE_NOT_FOUND,
          statusCode: 404,
        });
      }
      const requirementTypeIds = await Promise.all(
        payload.requirement_type_ids.map(async (requirement_type_id) => {
          let requirementType: any =
            await this.requirementTypeModel.findByNameOrId(
              requirement_type_id,
              user.relation_id || ""
            );
          if (!requirementType) {
            requirementType = await this.requirementTypeModel.create({
              ...REQUIREMENT_TYPE_NULL_ATTRIBUTES,
              name: requirement_type_id,
              design_id: user.relation_id || "0",
            });
          }
          return requirementType.id;
        })
      );

      const materialCodeGroups = await this.materialCodeModel.getBy({
        design_id: user.relation_id,
      });
      const materialCodeSubList = materialCodeGroups.reduce(
        (
          pre: {
            id: string;
            name: string;
            codes: {
              id: string;
              code: string;
              description: string;
            }[];
          }[],
          cur
        ) => {
          return pre.concat(cur.subs);
        },
        []
      );
      const materialCodes = materialCodeSubList.reduce(
        (
          pre: {
            id: string;
            code: string;
            description: string;
          }[],
          cur
        ) => {
          return pre.concat(cur.codes);
        },
        []
      );
      const materialCode = materialCodes.find(
        (item) => item.id === payload.material_code_id
      );
      if (!specifiedProduct) {
        //create
        const createdSpecifiedProduct = await this.specifiedProductModel.create(
          {
            ...SPECIFIED_PRODUCT_NULL_ATTRIBUTES,
            ...payload,
            unit_type_id: unitType.id,
            requirement_type_ids: requirementTypeIds,
            instruction_type_ids: getDistinctArray(
              payload.instruction_type_ids
            ),
            status: SPECIFIED_PRODUCT_STATUS.SPECIFIED,
            product_id: consideredProduct.product_id,
            project_id: consideredProduct.project_id,
            material_code: materialCode?.code + "-" + payload.suffix_code,
            special_instructions: payload.special_instructions,
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
          instruction_type_ids: getDistinctArray(payload.instruction_type_ids),
          status: SPECIFIED_PRODUCT_STATUS.SPECIFIED,
          product_id: consideredProduct.product_id,
          project_id: consideredProduct.project_id,
          material_code: materialCode?.code + "-" + payload.suffix_code,
          special_instructions: payload.special_instructions,
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
          message: MESSAGES.SPECIFIED_PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      return resolve({
        data: specifiedProduct,
        statusCode: 200,
      });
    });
  public getListByBrand = (
    user_id: string,
    project_id: string,
    brand_order: SortOrder
  ): Promise<any> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 200,
        });
      }
      const project = await this.projectModel.find(project_id);
      if (!project) {
        return resolve({
          message: MESSAGES.PROJECT_NOT_FOUND,
          statusCode: 200,
        });
      }
      const specifiedProducts = await this.specifiedProductModel.getBy({
        project_id,
      });
      const productIds = getDistinctArray(
        specifiedProducts.map((item) => item.product_id)
      );
      const products = await this.productModel.getMany(productIds);
      const brandIds = getDistinctArray(products.map((item) => item.brand_id));
      const brands = await this.brandModel.getManyOrder(
        brandIds,
        undefined,
        "name",
        brand_order
      );
      const specified = specifiedProducts.filter(
        (item) => item.status === SPECIFIED_PRODUCT_STATUS.SPECIFIED
      );
      const cancelled = specifiedProducts.filter(
        (item) => item.status === SPECIFIED_PRODUCT_STATUS.CANCELLED
      );
      const result = await Promise.all(
        brands.map(async (brand) => {
          const brandProducts = products.filter(
            (item) => item.brand_id === brand.id
          );
          const brandSpecifiedProducts =
            await this.specifiedProductModel.getManyByProduct(
              brandProducts.map((item) => item.id)
            );
          const returnSpecifiedProducts = await Promise.all(
            brandSpecifiedProducts.map(async (specifiedProduct) => {
              const product = brandProducts.find(
                (item) => item.id === specifiedProduct.product_id
              );
              const collection = await this.collectionModel.find(
                product?.collection_id || ""
              );
              return {
                id: product?.id,
                name: product?.name,
                collection_name: collection?.name,
                variant: "abc-xyz",
                product_id: "XXX-000",
                image: product?.images[0],
                status: specifiedProduct.status,
                specified_product_id: specifiedProduct.id,
                considered_product_id: specifiedProduct.considered_product_id,
              };
            })
          );
          return {
            id: brand.id,
            name: brand.name,
            products: returnSpecifiedProducts,
            count: returnSpecifiedProducts.length,
          };
        })
      );
      return resolve({
        data: {
          data: result,
          summary: [
            {
              name: "Specified",
              value: specified.length,
            },
            {
              name: "Cancelled",
              value: cancelled.length,
            },
          ],
        },
        statusCode: 200,
      });
    });
  public getListByMaterial = (
    user_id: string,
    project_id: string,
    brand_order?: SortOrder,
    material_code_order?: SortOrder
  ): Promise<any> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 200,
        });
      }
      const project = await this.projectModel.find(project_id);
      if (!project) {
        return resolve({
          message: MESSAGES.PROJECT_NOT_FOUND,
          statusCode: 200,
        });
      }
      const specifiedProducts = await this.specifiedProductModel.getAllBy(
        {
          project_id,
        },
        undefined,
        "material_code",
        material_code_order
      );

      let returnSpecifiedProducts = await Promise.all(
        specifiedProducts.map(async (specifiedProduct) => {
          const product = await this.productModel.find(
            specifiedProduct.product_id
          );
          const brand = await this.brandModel.find(product?.brand_id || "");
          const unit = await this.unitTypeModel.find(
            specifiedProduct.unit_type_id
          );
          return {
            id: specifiedProduct.id,
            material_code: specifiedProduct.material_code,
            description: specifiedProduct.description,
            image: product?.images[0],
            brand_name: brand?.name,
            product_name: product?.name,
            quantity: specifiedProduct.quantity,
            unit: unit?.code,
            order_method: specifiedProduct.order_method,
            status: specifiedProduct.status,
            specified_product_id: specifiedProduct.id,
            considered_product_id: specifiedProduct.considered_product_id,
          };
        })
      );
      if (brand_order) {
        returnSpecifiedProducts = sortObjectArray(
          returnSpecifiedProducts,
          "brand_name",
          brand_order
        );
      }
      const specified = specifiedProducts.filter(
        (item) => item.status === SPECIFIED_PRODUCT_STATUS.SPECIFIED
      );
      const cancelled = specifiedProducts.filter(
        (item) => item.status === SPECIFIED_PRODUCT_STATUS.CANCELLED
      );
      return resolve({
        data: {
          data: returnSpecifiedProducts,
          summary: [
            {
              name: "Specified",
              value: specified.length,
            },
            {
              name: "Cancelled",
              value: cancelled.length,
            },
          ],
        },
        statusCode: 200,
      });
    });
  public getListByZone = (
    user_id: string,
    project_id: string,
    zone_order: SortOrder,
    area_order: SortOrder,
    room_order: SortOrder,
    brand_order: SortOrder
  ): Promise<any> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 200,
        });
      }
      const project = await this.projectModel.find(project_id);
      if (!project) {
        return resolve({
          message: MESSAGES.PROJECT_NOT_FOUND,
          statusCode: 200,
        });
      }
      const projectZones = await this.projectZoneModel.getAllBy(
        {
          project_id,
        },
        ["id", "name", "areas"],
        "name",
        zone_order
      );
      const specifiedProducts = await this.specifiedProductModel.getBy({
        project_id,
      });
      const consideredProductIds = specifiedProducts.map(
        (item) => item.considered_product_id
      );
      const consideredProducts = await this.consideredProductModel.getMany(
        consideredProductIds
      );

      const newProjectZones = await Promise.all(
        projectZones.map(async (zone) => {
          const newAreas = await Promise.all(
            zone.areas.map(async (area) => {
              const newRooms = await Promise.all(
                area.rooms.map(async (room) => {
                  const foundConsideredProducts = consideredProducts.filter(
                    (item) => item.project_zone_id === room.id
                  );
                  const products = await this.getSpecifiedProducts(
                    foundConsideredProducts,
                    brand_order,
                    specifiedProducts
                  );
                  return {
                    ...room,
                    products,
                    count: products.length,
                  };
                })
              );
              const sortedNewRooms = sortObjectArray(
                newRooms,
                "name",
                room_order
              );
              return {
                ...area,
                count: area.rooms.length,
                rooms: sortedNewRooms,
              };
            })
          );
          const sortedAreas = sortObjectArray(newAreas, "name", area_order);
          return {
            ...zone,
            count: zone.areas.length,
            areas: sortedAreas,
          };
        })
      );
      const entireConsideredProducts = consideredProducts.filter(
        (item) => item.is_entire === true
      );
      const entireProducts = await this.getSpecifiedProducts(
        entireConsideredProducts,
        brand_order,
        specifiedProducts
      );
      const specified = specifiedProducts.filter(
        (item) => item.status === SPECIFIED_PRODUCT_STATUS.SPECIFIED
      );
      const cancelled = specifiedProducts.filter(
        (item) => item.status === SPECIFIED_PRODUCT_STATUS.CANCELLED
      );
      const result = [
        {
          name: "ENTIRE PROJECT",
          products: entireProducts,
          count: entireProducts.length,
        },
      ].concat(newProjectZones as any);
      return resolve({
        data: {
          data: result,
          summary: [
            {
              name: "Specified",
              value: specified.length,
            },
            {
              name: "Cancelled",
              value: cancelled.length,
            },
          ],
        },
        statusCode: 200,
      });
    });

  public updateStatusProductSpecified = (
    specified_product_id: string,
    payload: StatusSpecifiedProductRequest
  ): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const specifiedProduct = await this.specifiedProductModel.find(
        specified_product_id
      );
      if (!specifiedProduct) {
        return resolve({
          message: MESSAGES.SPECIFIED_PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const updatedSpecifiedProduct = await this.specifiedProductModel.update(
        specifiedProduct.id,
        {
          status: payload.status,
        }
      );
      if (!updatedSpecifiedProduct) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };

  public deleteProductSpecified = async (
    specified_product_id: string
  ): Promise<IMessageResponse> =>
    new Promise(async (resolve) => {
      const specifiedProduct = await this.specifiedProductModel.find(
        specified_product_id
      );
      if (!specifiedProduct) {
        return resolve({
          message: MESSAGES.SPECIFIED_PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const updatedSpecifiedProduct = await this.specifiedProductModel.update(
        specified_product_id,
        {
          is_deleted: true,
        }
      );
      if (!updatedSpecifiedProduct) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_DELETE,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
}
