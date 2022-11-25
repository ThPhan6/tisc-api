import { COMMON_TYPES, MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { fillObject } from "@/helper/common.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import productRepository from "@/repositories/product.repository";
import { projectRepository } from "@/repositories/project.repository";
import { projectZoneRepository } from "@/repositories/project_zone.repository";
import { projectProductFinishScheduleRepository } from "@/repositories/project_product_finish_schedule.repository";
import {
  IProjectZoneAttributes, UserAttributes,
  SortOrder, Availability, SummaryItemPosition
} from "@/types";
import { orderBy, uniqBy, isEmpty, sumBy, countBy } from "lodash";
import { projectTrackingRepository } from "../project_tracking/project_tracking.repository";
import { ProjectTrackingNotificationType } from "../project_tracking/project_tracking_notification.model";
import { projectTrackingNotificationRepository } from "../project_tracking/project_tracking_notification.repository";
import { ProjectProductAttributes } from "./project_product.model";
import { projectProductRepository } from "./project_product.repository";
import {
  AssignProductToProjectRequest,
  OrderMethod,
  ProductConsiderStatus,
  ProductSpecifyStatus,
  ProjectProductStatus,
  UpdateFinishChedulePayload,
} from "./project_product.type";
import { customProductRepository } from "../custom_product/custom_product.repository";
import { validateBrandProductSpecification } from "./project_product.mapping";

class ProjectProductService {
  public assignProductToProduct = async (
    payload: AssignProductToProjectRequest,
    user: UserAttributes
  ) => {
    if (!payload.entire_allocation && !payload.allocation.length) {
      return errorMessageResponse(MESSAGES.PROJECT_ZONE_MISSING, 400);
    }

    const repo = payload.custom_product
      ? customProductRepository
      : productRepository;
    const product = await repo.find(payload.product_id);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 400);
    }

    const project = await projectRepository.find(payload.project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 400);
    }

    const projectProduct = await projectProductRepository.findBy({
      deleted_at: null,
      project_id: payload.project_id,
      product_id: payload.product_id,
    });
    if (projectProduct) {
      return errorMessageResponse(MESSAGES.PRODUCT_ALREADY_ASSIGNED, 400);
    }

    const newProjectProductRecord = await projectProductRepository.create({
      ...payload,
      created_by: user.id,
    });

    if (!newProjectProductRecord) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG, 400);
    }

    if (payload.custom_product) {
      return successResponse({
        data: newProjectProductRecord,
      });
    }

    // Create Tracking | Tracking Notification
    const projectTracking =
      await projectTrackingRepository.findOrCreateIfNotExists(
        payload.project_id,
        "brand_id" in product ? product.brand_id : ""
      );

    const notification = await projectTrackingNotificationRepository.create({
      project_tracking_id: projectTracking.id,
      project_product_id: newProjectProductRecord.id,
      created_by: user.id,
    });

    return successResponse({
      data: {
        ...newProjectProductRecord,
        project_tracking_id: projectTracking.id,
        notification_id: notification?.id,
      },
    });
  };

  public getProjectAssignZoneByProduct = async (
    project_id: string,
    product_id: string
  ) => {
    const project = await projectRepository.find(project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    const assignItem = await projectProductRepository.findBy({
      project_id,
      product_id,
      deleted_at: null,
    });

    const repo = assignItem?.custom_product
      ? customProductRepository
      : productRepository;
    const product = await repo.find(product_id);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }

    const zones = await projectZoneRepository.getAllBy({ project_id });

    const entireSection = {
      name: "ENTIRE PROJECT",
      is_assigned: assignItem?.entire_allocation ? true : false,
    };

    const returnZones = zones.map((zone) => {
      const areas = zone.areas.map((area) => {
        const rooms = area.rooms.map((room) => ({
          ...room,
          is_assigned: assignItem?.allocation?.some((item) => item === room.id),
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
    user: UserAttributes,
    project_id: string,
    zone_order: SortOrder | undefined,
    area_order: SortOrder,
    room_order: SortOrder,
    brand_order: SortOrder | undefined
  ) => {
    const project = await projectRepository.find(project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    const consideredProducts =
      await projectProductRepository.getConsideredProductsByProject(
        project_id,
        user.id,
        zone_order,
        area_order,
        room_order,
        brand_order
      );

    return successResponse({
      data: consideredProducts,
    });
  };

  private getTrackingNotificationTypeByStatus = (payload: {
    status: ProjectProductStatus;
    consider_status?: ProductConsiderStatus;
    specified_status?: ProductSpecifyStatus;
  }): ProjectTrackingNotificationType => {
    const { consider_status, specified_status, status } = payload;
    if (status === ProjectProductStatus.consider) {
      switch (consider_status) {
        case ProductConsiderStatus["Re-considered"]:
          return ProjectTrackingNotificationType["Re-considered"];
        case ProductConsiderStatus.Unlisted:
          return ProjectTrackingNotificationType.Unlisted;
        default:
          return ProjectTrackingNotificationType.Considered;
      }
    }
    switch (specified_status) {
      case ProductSpecifyStatus["Re-specified"]:
        return ProjectTrackingNotificationType["Re-specified"];
      case ProductSpecifyStatus.Cancelled:
        return ProjectTrackingNotificationType.Cancelled;
      default:
        return ProjectTrackingNotificationType.Specified;
    }
  };

  public updateConsiderProduct = async (
    projectProductId: string,
    payload: Partial<ProjectProductAttributes>,
    user: UserAttributes,
    finishSchedulePayload: UpdateFinishChedulePayload[] = [],
    isSpecifying: boolean = false // specifying
  ) => {
    //// validate permission
    const projectProduct = await projectProductRepository.findWithRelation(
      projectProductId,
      user.relation_id
    );
    if (!projectProduct) {
      return errorMessageResponse(MESSAGES.CONSIDER_PRODUCT_NOT_FOUND);
    }

    // validate specify specification attribute
    if (isSpecifying && payload.specification) {
      const product = await productRepository.find(projectProduct.product_id);
      if (!product) {
        return errorMessageResponse(MESSAGES.PRODUCT.PRODUCT_NOT_FOUND);
      }
      const validateSpecification = validateBrandProductSpecification(
        payload.specification.attribute_groups,
        product.specification_attribute_groups
      );
      if (!validateSpecification) {
        return errorMessageResponse(
          MESSAGES.PROJECT_PRODUCT.INCORRECT_SPECIFICATION
        );
      }
      payload.specification.attribute_groups = validateSpecification;
    }
    // validate specify specification attribute
    ///
    if (payload.unit_type_id) {
      const unitTypes = await commonTypeRepository.findOrCreate(
        payload.unit_type_id,
        user.relation_id,
        COMMON_TYPES.PROJECT_UNIT
      );
      payload.unit_type_id = unitTypes.id;
    }

    //
    if (payload.requirement_type_ids) {
      const requirements = await Promise.all(
        payload.requirement_type_ids.map((id) => {
          return commonTypeRepository.findOrCreate(
            id,
            user.relation_id,
            COMMON_TYPES.PROJECT_REQUIREMENT
          );
        })
      );
      payload.requirement_type_ids = requirements.map((el) => el.id);
    }

    if (isSpecifying) {
      const errorSavedFinishSchedule = await this.updateFinishScheduleByRoom(
        user,
        projectProductId,
        payload.entire_allocation,
        payload.allocation,
        finishSchedulePayload
      );
      if (errorSavedFinishSchedule) {
        return errorSavedFinishSchedule;
      }
    }

    const considerProduct = await projectProductRepository.findAndUpdate(
      projectProductId,
      {
        ...payload,
        status: isSpecifying ? ProjectProductStatus.specify : payload.status,
        specified_status:
          payload.specified_status ??
          (isSpecifying ? ProductSpecifyStatus.Specified : undefined),
      }
    );
    if (!considerProduct[0]) {
      return errorMessageResponse(MESSAGES.CONSIDER_PRODUCT_NOT_FOUND);
    }

    const notiType: ProjectTrackingNotificationType = isSpecifying
      ? ProjectTrackingNotificationType.Specified
      : this.getTrackingNotificationTypeByStatus({
          status: considerProduct[0].status,
          consider_status: payload.consider_status,
          specified_status: payload.specified_status,
        });

    const brand = await projectProductRepository.getProductBrandById(
      considerProduct[0].id
    );

    if (!brand[0]) {
      console.log("brand not found");
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }
    const trackingRecord = await projectTrackingRepository.findBy({
      brand_id: brand[0].id,
      project_id: considerProduct[0].project_id,
    });

    if (!trackingRecord) {
      console.log("trackingRecord not found");
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    const notification = await projectTrackingNotificationRepository.create({
      project_tracking_id: trackingRecord.id,
      project_product_id: considerProduct[0].id,
      type: notiType,
      created_by: user.id,
    });
    return successResponse({
      data: {
        ...considerProduct[0],
        project_tracking_id: trackingRecord.id,
        notification_id: notification?.id,
      },
    });
  };

  public deleteConsiderProduct = async (
    projectProductId: string,
    user: UserAttributes
  ) => {
    const projectProduct = await projectProductRepository.find(
      projectProductId
    );

    if (!projectProduct) {
      return errorMessageResponse(MESSAGES.CONSIDER_PRODUCT_NOT_FOUND, 404);
    }

    const brand = await projectProductRepository.getProductBrandById(
      projectProductId
    );

    const trackingRecord = await projectTrackingRepository.findBy({
      brand_id: brand[0].id,
      project_id: projectProduct.project_id,
    });

    if (!trackingRecord) {
      console.log("trackingRecord not found");
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }

    const notification = await projectTrackingNotificationRepository.create({
      project_tracking_id: trackingRecord.id,
      project_product_id: projectProductId,
      type: ProjectTrackingNotificationType.Deleted,
      created_by: user.id,
    });

    await projectProductRepository.delete(projectProduct.id);

    return successResponse({
      data: {
        ...projectProduct,
        project_tracking_id: trackingRecord.id,
        notification_id: notification?.id,
      },
    });
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
        project_id,
        brand_order
      );

    const total = sumBy(specifiedProducts, "count");

    const cancelledCount = specifiedProducts.reduce(
      (total: number, brand: any) =>
        total +
          countBy(
            brand.products,
            (p) =>
              p.specifiedDetail.specified_status ===
              ProductSpecifyStatus.Cancelled
          ).true || 0,
      0
    );
    const availabilityRemarkCount = specifiedProducts.reduce(
      (total: number, brand: any) =>
        total +
          countBy(
            brand.products,
            (p) =>
              p.availability !== Availability.Available
          ).true || 0,
      0
    );

    return successResponse({
      data: {
        data: specifiedProducts,
        summary: [
          {
            name: "Specified",
            value: total - cancelledCount,
          },
          { name: "Cancelled", value: cancelledCount },
          {
            name: "Availability Remark",
            value: availabilityRemarkCount,
            position: SummaryItemPosition.Left
          }
        ],
      },
    });
  };

  private mappingSpecifiedData = (products: any[]) =>
    products.map((el: any) => ({
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

  private countCancelledSpecifiedProductTotal = (products: any[]) =>
    products.reduce(
      (total: number, prod: any) =>
        total +
        (prod.project_products?.specified_status ===
        ProductSpecifyStatus.Cancelled
          ? 1
          : 0),
      0
    );

  public getSpecifiedProductsByMaterial = async (
    user: UserAttributes,
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
        user.id,
        project_id,
        brand_order,
        material_order
      );

    const mappedProducts = this.mappingSpecifiedData(specifiedProducts);

    const cancelledCount =
      this.countCancelledSpecifiedProductTotal(specifiedProducts);
    const availabilityRemarkCount = specifiedProducts.reduce(
      (total: number, prod: any) =>
        total +
        (prod.project_products?.availability !==
        Availability.Available
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
            value: specifiedProducts.length - cancelledCount,
          },
          { name: "Cancelled", value: cancelledCount },
          {
              name: "Availability Remark",
              value: availabilityRemarkCount,
              position: SummaryItemPosition.Left
            }
        ],
      },
    });
  };

  public getSpecifiedProductsByZone = async (
    user: UserAttributes,
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

    const consideredProducts =
      await projectProductRepository.getConsideredProductsByProject(
        project_id,
        user.id,
        zone_order,
        area_order,
        room_order,
        brand_order,
        true
      );

    return successResponse({
      data: consideredProducts,
    });
  };

  public getFinishScheduleByRoom = async (
    projectProductId: string,
    roomIds: string[],
    user: UserAttributes
  ) => {
    //// validate permission
    const projectProduct = await projectProductRepository.findWithRelation(
      projectProductId,
      user.relation_id
    );
    if (!projectProduct) {
      return errorMessageResponse(MESSAGES.CONSIDER_PRODUCT_NOT_FOUND);
    }

    let rooms: IProjectZoneAttributes["areas"][0]["rooms"] = [];
    if (!isEmpty(roomIds)) {
      /// check room is exist
      rooms = await projectProductRepository.getRoomDataByRoomIds(
        projectProductId,
        roomIds
      );
      if (rooms.length !== roomIds.length) {
        return errorMessageResponse(
          MESSAGES.FINISH_SCHEDULE.ROOM_DOES_NOT_EXIST
        );
      }
    }

    /// get
    const finishSchedules =
      await projectProductFinishScheduleRepository.getByProjectProductAndRoom(
        projectProductId,
        roomIds
      );
    return successResponse({
      data: finishSchedules.map((item, index) => {
        return {
          ...item,
          room_id_text: isEmpty(roomIds) ? "EP" : rooms[index].room_id,
          room_name: isEmpty(roomIds)
            ? "ENTIRE PROJECT"
            : rooms[index].room_name,
        };
      }),
    });
  };

  private updateFinishScheduleByRoom = async (
    user: UserAttributes,
    projectProductId: string,
    entireAllocation: boolean | undefined,
    roomIds: string[] | undefined,
    payload: UpdateFinishChedulePayload[]
  ) => {
    ///
    if (
      (!entireAllocation && !roomIds) ||
      (entireAllocation && roomIds && roomIds.length > 0)
    ) {
      return errorMessageResponse(MESSAGES.FINISH_SCHEDULE.MISSING_ROOM_DATA);
    }

    ////
    let assignRooms: string[] = [];
    if (roomIds) {
      assignRooms = roomIds;
    }

    ///
    const rooms = await projectProductRepository.getRoomDataByRoomIds(
      projectProductId,
      assignRooms
    );
    if (
      rooms.length !== assignRooms.length || //// not found room
      (rooms.length !== payload.length && !entireAllocation) || /// payload not correct
      (payload.length > 1 && entireAllocation) /// entire product should only have one payload
    ) {
      return errorMessageResponse(MESSAGES.FINISH_SCHEDULE.MISSING_ROOM_DATA);
    }

    /// update finish schedule
    const response = await Promise.all(
      payload.map(async (item, index) => {
        const upsertData = fillObject(
          projectProductFinishScheduleRepository.getDefaultAttribute(
            projectProductId
          ),
          {
            ...item,
            project_product_id: projectProductId,
            room_id: entireAllocation ? "" : assignRooms[index],
          }
        );
        return projectProductFinishScheduleRepository.upsert(
          upsertData,
          user.id
        );
      })
    );
    if (
      (entireAllocation && response.length !== 1) ||
      (!entireAllocation && response.length !== assignRooms.length)
    ) {
      return errorMessageResponse(
        MESSAGES.GENERAL.SOMETHING_WRONG_CONTACT_SYSADMIN
      );
    }
  };
}

export const projectProductService = new ProjectProductService();

export default ProjectProductService;
