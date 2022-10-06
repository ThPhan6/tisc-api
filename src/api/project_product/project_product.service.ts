import { COMMON_TYPES, MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import productRepository from "@/repositories/product.repository";
import { projectRepository } from "@/repositories/project.repository";
import { projectZoneRepository } from "@/repositories/project_zone.repository";
import { SortOrder } from "@/type/common.type";
import { BrandAttributes, IProjectZoneAttributes } from "@/types";
import { groupBy, orderBy, partition, uniqBy } from "lodash";
import { ProjectProductAttributes } from "./project_product.model";
import { projectProductRepository } from "./project_product.repository";
import {
  AssignProductToProjectRequest,
  OrderMethod,
  ProductConsiderStatus,
  ProductSpecifyStatus,
  ProjectProductStatus,
} from "./project_product.type";

class ProjectProductService {
  public assignProductToProduct = async (
    payload: AssignProductToProjectRequest,
    user_id: string
  ) => {
    if (!payload.entire_allocation && !payload.allocation.length) {
      return errorMessageResponse(MESSAGES.PROJECT_ZONE_MISSING, 400);
    }
    const product = await productRepository.find(payload.product_id);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 400);
    }
    const project = await projectRepository.find(payload.project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 400);
    }

    return await projectProductRepository.upsert(payload, user_id);
  };

  public getProjectAssignZoneByProduct = async (
    project_id: string,
    product_id: string
  ) => {
    const product = await productRepository.find(product_id);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
    const project = await projectRepository.find(project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    const assignItems = await projectProductRepository.findBy({
      project_id,
      product_id,
    });

    const zones = await projectZoneRepository.getAllBy({ project_id });

    const entireSection = {
      name: "ENTIRE PROJECT",
      is_assigned: assignItems?.entire_allocation ? true : false,
    };

    const returnZones = zones.map((zone) => {
      const areas = zone.areas.map((area) => {
        const rooms = area.rooms.map((room) => ({
          ...room,
          is_assigned: assignItems?.allocation?.some(
            (item) => item === room.id
          ),
        }));
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

    return successResponse({
      data: returnZones,
    });
  };

  private groupProductsByRoom = (
    allocatedProducts: any[],
    projectZones: IProjectZoneAttributes[],
    area_order: SortOrder,
    room_order: SortOrder,
    brand_order: SortOrder
  ): any[] => {
    return projectZones.map((zone) => {
      const areas = zone.areas.map((area) => {
        const rooms = area.rooms.map((room) => {
          const products = allocatedProducts.filter((prod: any) =>
            prod.specifiedDetail.allocation.includes(room.id)
          );
          return {
            ...room,
            products: brand_order
              ? orderBy(
                  products,
                  "brand_name",
                  brand_order.toLocaleLowerCase() as any
                )
              : products,
            count: products.length,
          };
        });

        const allProductsInRooms = uniqBy(
          rooms.flatMap((room) => room.products),
          "id"
        );
        return {
          ...area,
          rooms: room_order
            ? orderBy(rooms, "room_name", room_order.toLocaleLowerCase() as any)
            : rooms,
          count: allProductsInRooms.length,
        };
      });

      const allProductsInAreas = uniqBy(
        areas.flatMap((area) => area.rooms.flatMap((room) => room.products)),
        "id"
      );

      return {
        ...zone,
        areas: area_order
          ? orderBy(areas, "name", area_order.toLocaleLowerCase() as any)
          : areas,
        count: allProductsInAreas.length,
      };
    });
  };

  public getConsideredProducts = async (
    project_id: string,
    zone_order: SortOrder,
    area_order: SortOrder,
    room_order: SortOrder,
    brand_order: SortOrder
  ) => {
    const project = await projectRepository.find(project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    const projectZones = await projectZoneRepository.getByProjectId(
      project_id,
      zone_order
    );

    const consideredProducts =
      await projectProductRepository.getConsideredProductsByProject(project_id);

    const mappedConsideredProducts = consideredProducts.map((el: any) => ({
      ...el.products,
      brand: el.brands,
      collection: el.collections,
      specifiedDetail: {
        ...el,
        products: undefined,
        brands: undefined,
        users: undefined,
        collections: undefined,
        user_product_specifications: undefined,
        specification: el.user_product_specifications?.specification,
        brand_location_id: el.user_product_specifications?.brand_location_id,
        distributor_location_id:
          el.user_product_specifications?.distributor_location_id,
      },
      assigned_name: `${el.users?.firstname || ""}${
        el.users?.lastname ? " " + el.users?.lastname : ""
      }`,
    }));

    const [entireConsideredProducts, allocatedProducts] = partition(
      mappedConsideredProducts,
      "specifiedDetail.entire_allocation"
    );

    const mappedAllocatedProducts = this.groupProductsByRoom(
      allocatedProducts,
      projectZones,
      area_order,
      room_order,
      brand_order
    );

    const results = [
      {
        id: "entire_project",
        name: "ENTIRE PROJECT",
        products: entireConsideredProducts,
        count: entireConsideredProducts.length,
      },
    ].concat(mappedAllocatedProducts);

    const unlistedCount = consideredProducts.reduce(
      (total: number, prod: any) =>
        total +
        (prod.consider_status === ProductConsiderStatus.Unlisted ? 1 : 0),
      0
    );
    return successResponse({
      data: {
        considered_products: results,
        summary: [
          {
            name: "Considered",
            value: consideredProducts.length - unlistedCount,
          },
          { name: "Unlisted", value: unlistedCount },
        ],
      },
    });
  };

  public updateConsiderProduct = async (
    projectProductId: string,
    payload: Partial<ProjectProductAttributes>,
    relationId?: string // specifying
  ) => {
    if (payload.unit_type_id) {
      const unitTypes = await commonTypeRepository.findOrCreate(
        payload.unit_type_id,
        relationId || "",
        COMMON_TYPES.PROJECT_UNIT
      );
      payload.unit_type_id = unitTypes.id;
    }

    if (payload.requirement_type_ids) {
      const requirements = await Promise.all(
        payload.requirement_type_ids.map((id) => {
          return commonTypeRepository.findOrCreate(
            id,
            relationId || "",
            COMMON_TYPES.PROJECT_REQUIREMENT
          );
        })
      );
      payload.requirement_type_ids = requirements.map((el) => el.id);
    }

    const considerProduct = await projectProductRepository.findAndUpdate(
      projectProductId,
      {
        ...payload,
        status: relationId
          ? ProjectProductStatus.specify
          : ProjectProductStatus.consider,
        specified_status:
          payload.specified_status ??
          (relationId ? ProductSpecifyStatus.Specified : undefined),
      }
    );

    if (!considerProduct) {
      return errorMessageResponse(MESSAGES.CONSIDER_PRODUCT_NOT_FOUND);
    }
    return successResponse({
      data: considerProduct,
    });
  };

  public deleteConsiderProduct = async (projectProductId: string) => {
    const deletedRecord = await projectProductRepository.findAndDelete(
      projectProductId
    );
    if (!deletedRecord) {
      return errorMessageResponse(MESSAGES.CONSIDER_PRODUCT_NOT_FOUND, 404);
    }
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };

  public getSpecifiedProductsByBrand = async (
    project_id: string,
    brand_order?: SortOrder
  ) => {
    const project = await projectRepository.find(project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    const specifiedProducts =
      await projectProductRepository.getSpecifiedProductsForBrandGroup(
        project_id
      );

    const brands: BrandAttributes[] = specifiedProducts.flatMap(
      (el: { brands: BrandAttributes }) => el.brands
    );
    const filteredBrands = uniqBy(brands, "id");

    const sortedBrands = brand_order
      ? orderBy(filteredBrands, "name", brand_order.toLocaleLowerCase() as any)
      : filteredBrands;

    const mappedProducts = specifiedProducts.map((el: any) => ({
      ...el.products,
      brand: el.brands,
      collection: el.collections,
      specifiedDetail: {
        ...el,
        products: undefined,
        brands: undefined,
        collections: undefined,
      },
      product_id: "XXX-000",
      variant: "updating",
    }));

    const groupByBrandProducts = groupBy(mappedProducts, "brand_id");

    const results: any[] = [];

    sortedBrands.forEach((brand) => {
      results.push({
        id: brand.id,
        name: brand.name,
        products: groupByBrandProducts[brand.id],
        count: groupByBrandProducts[brand.id].length,
      });
    });

    const unlistedCount = specifiedProducts.reduce(
      (total: number, prod: any) =>
        total +
        (prod.specified_status === ProductSpecifyStatus.Cancelled ? 1 : 0),
      0
    );
    return successResponse({
      data: {
        data: results,
        summary: [
          {
            name: "Specified",
            value: specifiedProducts.length - unlistedCount,
          },
          { name: "Cancelled", value: unlistedCount },
        ],
      },
    });
  };

  public getSpecifiedProductsByMaterial = async (
    user_id: string,
    project_id: string,
    brand_order?: SortOrder,
    material_order?: SortOrder
  ) => {
    const project = await projectRepository.find(project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    const specifiedProducts =
      await projectProductRepository.getSpecifiedProductsForMaterial(
        user_id,
        project_id,
        brand_order,
        material_order
      );

    const mappedProducts = specifiedProducts.map((el: any) => ({
      ...el.product,
      brand: el.brand,
      collection: el.collection,
      specifiedDetail: {
        ...el.project_products,
        unit_type: el.unit_type?.name,
        material_code: el.material_code?.code,
        order_method_name: OrderMethod[el.project_products.order_method],
      },
    }));

    const unlistedCount = specifiedProducts.reduce(
      (total: number, prod: any) =>
        total +
        (prod.project_products.specified_status ===
        ProductSpecifyStatus.Cancelled
          ? 1
          : 0),
      0
    );
    return successResponse({
      data: {
        data: mappedProducts,
        summary: [
          {
            name: "Specified",
            value: specifiedProducts.length - unlistedCount,
          },
          { name: "Cancelled", value: unlistedCount },
        ],
      },
    });
  };

  public getSpecifiedProductsByZone = async (
    user_id: string,
    project_id: string,
    zone_order: SortOrder,
    area_order: SortOrder,
    room_order: SortOrder,
    brand_order: SortOrder
  ) => {
    const project = await projectRepository.find(project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    const projectZones = await projectZoneRepository.getByProjectId(
      project_id,
      zone_order
    );

    const specifiedProducts =
      await projectProductRepository.getSpecifiedProductsForZoneGroup(
        user_id,
        project_id
      );
    const mappedProducts = specifiedProducts.map((el: any) => ({
      ...el.product,
      brand: el.brand,
      collection: el.collection,
      specifiedDetail: {
        ...el.project_products,
        unit_type: el.unit_type?.name,
        material_code: el.material_code?.code,
        order_method_name: OrderMethod[el.project_products.order_method],
      },
    }));

    const [entireConsideredProducts, allocatedProducts] = partition(
      mappedProducts,
      "specifiedDetail.entire_allocation"
    );

    const mappedAllocatedProducts = this.groupProductsByRoom(
      allocatedProducts,
      projectZones,
      area_order,
      room_order,
      brand_order
    );

    const results = [
      {
        id: "entire_project",
        name: "ENTIRE PROJECT",
        products: entireConsideredProducts,
        count: entireConsideredProducts.length,
      },
    ].concat(mappedAllocatedProducts);

    const unlistedCount = specifiedProducts.reduce(
      (total: number, prod: any) =>
        total +
        (prod.project_products.specified_status ===
        ProductSpecifyStatus.Cancelled
          ? 1
          : 0),
      0
    );
    return successResponse({
      data: {
        data: results,
        summary: [
          {
            name: "Specified",
            value: specifiedProducts.length - unlistedCount,
          },
          { name: "Cancelled", value: unlistedCount },
        ],
      },
    });
  };
}

export const projectProductService = new ProjectProductService();

export default ProjectProductService;
