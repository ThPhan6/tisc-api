import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import productRepository from "@/repositories/product.repository";
import { projectZoneRepository } from "@/repositories/project_zone.repository";
import { SortOrder } from "@/type/common.type";
import { IProjectZoneAttributes } from "@/types";
import { orderBy, partition, uniqBy } from "lodash";
import { projectRepository } from "../project/project.repository";
import { projectProductRepository } from "./project_product.repository";
import {
  AssignProductToProjectRequest,
  ProductConsiderStatus,
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

    const consideredProducts = await projectProductRepository.getByProjectId(
      project_id
    );
    const mappedConsideredProducts = consideredProducts.map((el: any) => ({
      ...el.products,
      brand_name: el.brands.name,
      brand_logo: el.brands.logo,
      collection_name: el.collections.name,
      status: el.consider_status,
      status_name: ProductConsiderStatus[el.consider_status],
      considered_id: el.id,
      allocation: el.allocation,
      entire_allocation: el.entire_allocation,
      assigned_name: `${el.users?.firstname || ""}${
        el.users?.lastname ? " " + el.users?.lastname : ""
      }`,
    }));

    const [entireConsideredProducts, allocatedProducts] = partition(
      mappedConsideredProducts,
      "entire_allocation"
    );

    const mappedAllocatedProducts = projectZones.map(
      (zone: IProjectZoneAttributes) => {
        const areas = zone.areas.map((area) => {
          const rooms = area.rooms.map((room) => {
            const products = allocatedProducts.filter((prod: any) =>
              prod.allocation.includes(room.id)
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
              ? orderBy(
                  rooms,
                  "room_name",
                  room_order.toLocaleLowerCase() as any
                )
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
      }
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
        total + (prod.status === ProductConsiderStatus.Unlisted ? 1 : 0),
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
}

export const projectProductService = new ProjectProductService();

export default ProjectProductService;
