import {
  CONSIDERED_PRODUCT_STATUS,
  MESSAGES,
} from "../../constant/common.constant";
import {
  getConsideredProductStatusName,
  getDistinctArray,
  sortObjectArray,
} from "../../helper/common.helper";
import BrandModel from "../../model/brand.model";
import CollectionModel from "../../model/collection.model";
import ConsideredProductModel, {
  IConsideredProductAttributes,
} from "../../model/considered_product.model";
import ProductModel from "../../model/product.model";
import ProjectModel from "../../model/project.model";
import ProjectZoneModel from "../../model/project_zone.model";
import UserModel from "../../model/user.model";
import SpecifiedProductModel from "../../model/specified_product.model";
import { IMessageResponse, SortOrder } from "../../type/common.type";
import {
  IRoom,
  IConsideredProductsResponse,
  StatusConsideredProductRequest,
} from "./considered_product.type";

export default class ConsideredProductService {
  private consideredProductModel: ConsideredProductModel;
  private projectZoneModel: ProjectZoneModel;
  private projectModel: ProjectModel;
  private productModel: ProductModel;
  private brandModel: BrandModel;
  private collectionModel: CollectionModel;
  private userModel: UserModel;
  private specifiedProductModel: SpecifiedProductModel;

  constructor() {
    this.consideredProductModel = new ConsideredProductModel();
    this.specifiedProductModel = new SpecifiedProductModel();
    this.projectZoneModel = new ProjectZoneModel();
    this.projectModel = new ProjectModel();
    this.productModel = new ProductModel();
    this.brandModel = new BrandModel();
    this.collectionModel = new CollectionModel();
    this.userModel = new UserModel();
  }
  private getAssignProducts = async (
    foundConsideredProducts: IConsideredProductAttributes[],
    brand_order: SortOrder
  ) => {
    const products = await Promise.all(
      foundConsideredProducts.map(async (foundConsideredProduct) => {
        const product = await this.productModel.find(
          foundConsideredProduct.product_id
        );
        if (!product) {
          return {};
        }
        const brand = await this.brandModel.find(product.brand_id);
        const collection = await this.collectionModel.find(
          product.collection_id || ""
        );
        const user = await this.userModel.find(
          foundConsideredProduct.assigned_by
        );
        return {
          id: product.id,
          name: product.name,
          image: product.images[0],
          brand_id: product.brand_id,
          brand_name: brand?.name,
          collection_id: product.collection_id,
          collection_name: collection?.name,
          assigned_by: foundConsideredProduct.assigned_by,
          assigned_name: user?.firstname,
          status: foundConsideredProduct.status,
          status_name: getConsideredProductStatusName(
            foundConsideredProduct.status
          ),
          description: product.description,
          brand_logo: brand?.logo,
          considered_id: foundConsideredProduct.id,
          project_zone_id: foundConsideredProduct.project_zone_id,
        };
      })
    );
    return sortObjectArray(products, "brand_name", brand_order);
  };

  getList = (
    project_id: string,
    zone_order: SortOrder,
    area_order: SortOrder,
    room_order: SortOrder,
    brand_order: SortOrder
  ): Promise<IConsideredProductsResponse | IMessageResponse> =>
    new Promise(async (resolve) => {
      const project = await this.projectModel.find(project_id);
      if (!project) {
        return resolve({
          message: MESSAGES.PROJECT_NOT_FOUND,
          statusCode: 404,
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

      const consideredProducts = await this.consideredProductModel.getAllBy(
        {
          project_id,
        },
        [
          "id",
          "product_id",
          "project_zone_id",
          "assigned_by",
          "status",
          "is_entire",
        ]
      );
      const mappingZonePromises = projectZones.map(async (zone) => {
        const mappingAreaPromises = zone.areas.map(async (area) => {
          const mappingRoomPromises = area.rooms.map(async (room) => {
            const foundConsideredProducts = consideredProducts.filter(
              (item) => item.project_zone_id === room.id
            );
            const products = await this.getAssignProducts(
              foundConsideredProducts,
              brand_order
            );

            return {
              ...room,
              products: products.map((product) => {
                return {
                  ...product,
                  project_zone_id: room.id,
                };
              }),
              count: products.length,
            };
          });

          const newRooms = await Promise.all(mappingRoomPromises);
          const sortedNewRooms = sortObjectArray(
            newRooms,
            "room_name",
            room_order
          );
          return {
            ...area,
            rooms: sortedNewRooms,
            count: sortedNewRooms.reduce((pre, cur) => {
              return cur.products.length ? pre + cur.products.length : pre;
            }, 0),
          };
        });

        const newAreas = await Promise.all(mappingAreaPromises);

        const sortedAreas = sortObjectArray(newAreas, "name", area_order);
        return {
          ...zone,
          areas: sortedAreas,
          count: sortedAreas.reduce((pre, cur) => {
            cur.rooms.forEach((item: IRoom) => {
              pre += item.products.length;
            });
            return pre;
          }, 0),
        };
      });

      const newProjectZones = await Promise.all(mappingZonePromises);

      const entireConsideredProducts = consideredProducts.filter(
        (item) => item.is_entire === true
      );
      const entireProducts = await this.getAssignProducts(
        entireConsideredProducts,
        brand_order
      );
      const result = [
        {
          name: "ENTIRE PROJECT",
          products: entireProducts.map((entireProduct) => {
            return {
              ...entireProduct,
              is_entire: true,
            };
          }),
          count: entireProducts.length,
        },
      ].concat(newProjectZones as any);
      const consideredCount = consideredProducts.reduce((pre, cur) => {
        if (
          cur.status === CONSIDERED_PRODUCT_STATUS.CONSIDERED ||
          cur.status === CONSIDERED_PRODUCT_STATUS.RE_CONSIDERED
        ) {
          return pre + 1;
        }
        return pre;
      }, 0);
      const unlistedCount = consideredProducts.reduce((pre, cur) => {
        if (cur.status === CONSIDERED_PRODUCT_STATUS.UNLISTED) return pre + 1;
        return pre;
      }, 0);
      return resolve({
        data: {
          considered_products: result,
          summary: [
            { name: "Considered", value: consideredCount },
            { name: "Unlisted", value: unlistedCount },
          ],
        },
        statusCode: 200,
      });
    });

  public getListAssignedProject = (
    project_id: string,
    product_id: string
  ): Promise<any> =>
    new Promise(async (resolve) => {
      const product = await this.productModel.find(product_id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const project = await this.projectModel.find(project_id);
      if (!project) {
        return resolve({
          message: MESSAGES.PROJECT_NOT_FOUND,
          statusCode: 404,
        });
      }

      const consideredProducts = await this.consideredProductModel.getBy({
        product_id,
        project_id,
      });
      const projectZoneIds = getDistinctArray(
        consideredProducts
          .map((item) => item.project_zone_id || "")
          .filter((item) => {
            if (item === "") return false;
            return true;
          })
      );
      const zones = await this.projectZoneModel.getBy({
        project_id,
      });
      const entireSection = {
        name: "ENTIRE PROJECT",
        is_assigned: consideredProducts[0]?.is_entire ? true : false,
      };
      const returnZones = zones.map((zone) => {
        const areas = zone.areas.map((area) => {
          const rooms = area.rooms.map((room) => {
            const foundRoom = projectZoneIds.find((item) => item === room.id);
            if (foundRoom)
              return {
                ...room,
                is_assigned: true,
              };
            return {
              ...room,
              is_assigned: false,
            };
          });
          return {
            ...area,
            rooms,
          };
        });
        return {
          ...zone,
          areas,
        };
      });
      returnZones.unshift(entireSection as any);
      return resolve({
        data: returnZones,
        statusCode: 200,
      });
    });

  public updateConsiderProductStatus = async (
    considered_product_id: string,
    payload: StatusConsideredProductRequest
  ): Promise<IMessageResponse> =>
    new Promise(async (resolve) => {
      const considerProduct = await this.consideredProductModel.find(
        considered_product_id
      );
      if (!considerProduct) {
        return resolve({
          message: MESSAGES.CONSIDER_PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const updatedConsiderProduct = await this.consideredProductModel.update(
        considerProduct.id,
        {
          status: payload.status,
        }
      );
      if (!updatedConsiderProduct) {
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

  public deleteConsiderProduct = async (
    considered_product_id: string
  ): Promise<IMessageResponse> =>
    new Promise(async (resolve) => {
      const consideredProduct = await this.consideredProductModel.find(
        considered_product_id
      );
      if (!consideredProduct) {
        return resolve({
          message: MESSAGES.CONSIDER_PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const specifiedProduct = await this.specifiedProductModel.findBy({
        considered_product_id: considered_product_id,
      });
      if (specifiedProduct) {
        return resolve({
          message: MESSAGES.PRODUCT_WAS_SPECIFIED_ALREADY,
          statusCode: 400,
        });
      }

      const updatedConsiderProduct = await this.consideredProductModel.update(
        considered_product_id,
        {
          is_deleted: true,
        }
      );
      if (!updatedConsiderProduct) {
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
