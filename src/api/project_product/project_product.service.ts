import { COMMON_TYPES, MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { fillObject, objectDiff } from "@/helpers/common.helper";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import productRepository from "@/repositories/product.repository";
import { projectRepository } from "@/repositories/project.repository";
import { projectZoneRepository } from "@/repositories/project_zone.repository";
import { projectProductFinishScheduleRepository } from "@/repositories/project_product_finish_schedule.repository";
import {
  IProjectZoneAttributes,
  UserAttributes,
  SortOrder,
  Availability,
  SummaryItemPosition,
  UserType,
} from "@/types";
import { isEmpty, sumBy, countBy, sortBy, uniqBy, orderBy } from "lodash";
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
import { ActivityTypes, logService } from "@/services/log.service";
import { projectTrackingService } from "../project_tracking/project_tracking.service";
import { userProductSpecificationRepository } from "../user_product_specification/user_product_specification.repository";
import { stepSelectionRepository } from "@/repositories/step_selection.repository";
import { randomUUID } from "crypto";
import moment from "moment";

class ProjectProductService {
  private duplicateStepSelection = (
    product_id: string,
    user_id: string,
    project_id: string,
    specification_ids: string[]
  ) =>
    Promise.all(
      specification_ids.map(async (specification_id) => {
        const paramsToFind = {
          product_id: product_id,

          specification_id: specification_id,
        };
        const stepSelection = await stepSelectionRepository.findBy({
          ...paramsToFind,
          user_id: user_id,
          deleted_at: null,
        });
        if (stepSelection) {
          //duplicate
          const projectProductStepSelection =
            await stepSelectionRepository.findBy({
              ...paramsToFind,
              project_id: project_id,
            });
          const data = {
            product_id: stepSelection.product_id,
            project_id: project_id,
            specification_id: stepSelection.specification_id,
            quantities: stepSelection.quantities,
            combined_quantities: stepSelection.combined_quantities,
          };
          if (!projectProductStepSelection) {
            await stepSelectionRepository.create(data);
          } else {
            await stepSelectionRepository.update(
              projectProductStepSelection.id,
              data
            );
          }
          return {
            specification_id,
            step_selections: {
              quantities: stepSelection.quantities,
              combined_quantities: stepSelection.combined_quantities,
            },
          };
        }
        return { specification_id };
      })
    );
  public assignProductToProduct = async (
    payload: AssignProductToProjectRequest,
    user: UserAttributes,
    path: string
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

    if (!project.team_profile_ids.includes(user.id)) {
      return errorMessageResponse(MESSAGES.GENERAL.NOT_AUTHORIZED_TO_PERFORM);
    }

    const projectProduct = await projectProductRepository.findBy({
      deleted_at: null,
      project_id: payload.project_id,
      product_id: payload.product_id,
    });
    if (projectProduct) {
      if (projectProduct.status === ProjectProductStatus.specify) {
        return successResponse({
          data: projectProduct,
        });
      }
      const updatedProjectProduct = await projectProductRepository.update(
        projectProduct.id,
        payload
      );

      if (!updatedProjectProduct) {
        return errorMessageResponse(MESSAGES.SOMETHING_WRONG, 400);
      }
      const projectTracking = await projectTrackingRepository.findBy({
        project_id: payload.project_id,
        brand_id: "brand_id" in product ? product.brand_id : "",
      });
      const notification = await projectTrackingNotificationRepository.findBy({
        project_tracking_id: projectTracking?.id || "",
        project_product_id: updatedProjectProduct.id,
        created_by: user.id,
      });
      // refresh user specification
      await userProductSpecificationRepository.deleteBy({
        product_id: payload.product_id,
        user_id: user.id,
      });
      await stepSelectionRepository.deleteBy({
        product_id: payload.product_id,
        user_id: user.id,
      });
      return successResponse({
        data: {
          ...updatedProjectProduct,
          project_tracking_id: projectTracking?.id,
          notification_id: notification?.id,
        },
      });
    }
    const designerPreSelection =
      await userProductSpecificationRepository.findBy({
        product_id: payload.product_id,
        user_id: user.id,
      });
    const stepSelections = await this.duplicateStepSelection(
      payload.product_id,
      user.id,
      payload.project_id,
      designerPreSelection?.specification?.attribute_groups.map(
        (item) => item.id
      ) || []
    );
    const mappedGroup =
      designerPreSelection?.specification?.attribute_groups.map((group) => {
        const matched = stepSelections.find(
          (item) => item.specification_id === group.id
        );
        return {
          ...group,
          step_selections: matched?.step_selections,
        };
      });
    const newSpecification = {
      ...designerPreSelection?.specification,
      attribute_groups: mappedGroup || [],
    };
    const specificationVersion = {
      ...newSpecification,
      version_id: randomUUID(),
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      created_by: user.id,
    };
    const newProjectProductRecord = await projectProductRepository.create({
      ...payload,
      specification: designerPreSelection?.specification as any,
      created_by: user.id,
      specification_versions: [specificationVersion],
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
    logService.create(ActivityTypes.assign_product_to_project, {
      path,
      user_id: user.id,
      relation_id: user.relation_id,
      data: { product_id: product.id, project_id: project.id },
    });
    // refresh user specification
    await userProductSpecificationRepository.deleteBy({
      product_id: payload.product_id,
      user_id: user.id,
    });
    await stepSelectionRepository.deleteBy({
      product_id: payload.product_id,
      user_id: user.id,
    });
    //
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
    if (assignItem) {
      const repo = assignItem?.custom_product
        ? customProductRepository
        : productRepository;
      const product = await repo.find(product_id);
      if (!product) {
        return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
      }
    }

    const zones = sortBy(
      await projectZoneRepository.getAllBy({ project_id }),
      "name"
    );

    const entireSection = {
      name: "ENTIRE PROJECT",
      is_assigned: assignItem?.entire_allocation ? true : false,
    };

    const returnZones = zones.map((zone) => {
      const areas = zone.areas.map((area) => {
        const rooms = sortBy(
          area.rooms.map((room) => ({
            ...room,
            is_assigned: assignItem?.allocation?.some(
              (item) => item === room.id
            ),
          })),
          "room_id"
        );
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

  public revertSpecificationVersion = async (
    projectProductId: string,
    versionId: string,
    user: UserAttributes
  ) => {
    let projectProduct = await projectProductRepository.findWithRelation(
      projectProductId,
      user.relation_id
    );
    const versions = sortBy(
      projectProduct?.specification_versions,
      "created_at"
    );
    if (!versions || versions.length === 1) {
      return errorMessageResponse("Cannot revert the last version!");
    }
    const version = versions.find((item) => item.version_id === versionId);
    if (version.version_id === versions[versions.length - 1].version_id) {
      return errorMessageResponse("Cannot revert the last version!");
    }
    this.updateConsiderProduct(
      projectProductId,
      { specification: version },
      user,
      ""
    );
    return successMessageResponse(MESSAGES.SUCCESS);
  };
  public updateConsiderProduct = async (
    projectProductId: string,
    payload: Partial<ProjectProductAttributes>,
    user: UserAttributes,
    path: string,
    finishSchedulePayload: UpdateFinishChedulePayload[] = [],
    isSpecifying: boolean = false, // specifying,
    isHasXSelection: boolean = false
  ) => {
    let relation = user.relation_id;

    let projectProduct = await projectProductRepository.findWithRelation(
      projectProductId,
      user.relation_id
    );

    if (user.type === UserType.Brand) {
      projectProduct = await projectProductRepository.findWithBrandRelation(
        projectProductId,
        relation
      );

      if (projectProduct) {
        relation = projectProduct.design_id;
      }
    }

    //// validate permission
    if (!projectProduct) {
      return errorMessageResponse(MESSAGES.CONSIDER_PRODUCT_NOT_FOUND);
    }
    if (isHasXSelection) {
      //Create assistance request
      projectTrackingService.createAssistanceRequest(
        user.id,
        projectProduct.product_id,
        projectProduct.project_id
      );
    }

    // validate specify specification attribute
    if (isSpecifying && payload.specification) {
      const repo = projectProduct.custom_product
        ? customProductRepository
        : productRepository;
      const product = await repo.find(projectProduct.product_id);
      if (!product) {
        return errorMessageResponse(MESSAGES.PRODUCT.PRODUCT_NOT_FOUND);
      }
      const validateSpecification =
        "specification_attribute_groups" in product
          ? validateBrandProductSpecification(
              payload.specification.attribute_groups,
              product.specification_attribute_groups
            )
          : payload.specification.attribute_groups;
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
        relation,
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
            relation,
            COMMON_TYPES.PROJECT_REQUIREMENT
          );
        })
      );
      payload.requirement_type_ids = requirements.map((el) => el.id);
    }

    if (isSpecifying && user.type === UserType.Designer) {
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

    const specificationVersion = {
      ...payload.specification,
      version_id: randomUUID(),
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      created_by: user.id,
    };
    const considerProduct = await projectProductRepository.findAndUpdate(
      projectProductId,
      {
        ...payload,
        status: isSpecifying ? ProjectProductStatus.specify : payload.status,
        is_done_assistance_request: payload.is_done_assistance_request
          ? payload.is_done_assistance_request
          : isHasXSelection
          ? false
          : undefined,
        specified_status:
          payload.specified_status ??
          (isSpecifying ? ProductSpecifyStatus.Specified : undefined),
        specification: {
          is_refer_document: payload.specification?.is_refer_document || false,
          attribute_groups:
            (payload.specification?.attribute_groups.map((item) => ({
              id: item.id,
              attributes: item.attributes,
            })) as any) || [],
        },
        specification_versions: (
          projectProduct.specification_versions || []
        ).concat([specificationVersion]),
      }
    );
    if (!considerProduct[0]) {
      return errorMessageResponse(MESSAGES.CONSIDER_PRODUCT_NOT_FOUND);
    }

    if (projectProduct.custom_product) {
      if (payload.consider_status) {
        logService.create(ActivityTypes.update_status_product_considered, {
          path,
          user_id: user.id,
          relation_id: user.relation_id,
          data: {
            product_id: projectProductId,
            status_text: ProductConsiderStatus[payload.consider_status],
            project_id: considerProduct[0].project_id,
          },
        });
      }
      if (payload.specified_status) {
        logService.create(ActivityTypes.update_status_product_specified, {
          path,
          user_id: user.id,
          relation_id: user.relation_id,
          data: {
            product_id: projectProductId,
            status_text: ProductSpecifyStatus[payload.specified_status],
            project_id: considerProduct[0].project_id,
          },
        });
      }
      return successResponse({ data: considerProduct[0] });
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

    if (payload && !payload.consider_status && !payload.specified_status) {
      const diff = objectDiff(projectProduct, payload);
      logService.create(ActivityTypes.update_product_specified, {
        path,
        user_id: user.id,
        relation_id: user.relation_id,
        data: {
          product_id: projectProductId,
          project_id: considerProduct[0].project_id,
        },
        ...diff,
      });
    }
    if (!payload) {
      {
        logService.create(ActivityTypes.specify_product_to_project, {
          path,
          user_id: user.id,
          relation_id: user.relation_id,
          data: {
            product_id: projectProductId,
            project_id: considerProduct[0].project_id,
          },
        });
      }
    }
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
    user: UserAttributes,
    path: string
  ) => {
    const projectProduct = await projectProductRepository.find(
      projectProductId
    );

    if (!projectProduct) {
      return errorMessageResponse(MESSAGES.CONSIDER_PRODUCT_NOT_FOUND, 404);
    }

    if (projectProduct.custom_product) {
      const result = await projectProductRepository.delete(projectProduct.id);
      if (!result) {
        return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
      }
      if (projectProduct.specified_status) {
        logService.create(ActivityTypes.remove_product_specified, {
          path,
          user_id: user.id,
          relation_id: user.relation_id,
          data: {
            product_id: projectProductId,
            project_id: projectProduct.project_id,
          },
        });
      }
      if (!projectProduct.specified_status && projectProduct.consider_status) {
        logService.create(ActivityTypes.remove_product_considered, {
          path,
          user_id: user.id,
          relation_id: user.relation_id,
          data: {
            product_id: projectProductId,
            project_id: projectProduct.project_id,
          },
        });
      }
      return successResponse({
        data: projectProduct,
      });
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

    const result = await projectProductRepository.delete(projectProduct.id);
    if (!result) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG);
    }
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
    brand_id?: string,
    brand_order?: SortOrder
  ) => {
    const project = await projectRepository.find(project_id);
    if (!project) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND, 404);
    }

    const specifiedProducts =
      await projectProductRepository.getSpecifiedProductsForBrandGroup(
        project_id,
        brand_id,
        brand_order
      );

    const total = sumBy(specifiedProducts, "count");

    const cancelledCount = specifiedProducts.reduce(
      (total: number, brand: any) => {
        const cancelled =
          countBy(
            brand.products,
            (p) =>
              p.specifiedDetail.specified_status ===
              ProductSpecifyStatus.Cancelled
          ).true || 0;
        return total + cancelled;
      },
      0
    );

    const availabilityRemarkCount = specifiedProducts.reduce(
      (total: number, brand: any) => {
        const notAvailableCount =
          countBy(
            brand.products,
            (p) => p.availability !== Availability.Available
          ).true || 0;
        return total + notAvailableCount;
      },
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
            position: SummaryItemPosition.Left,
          },
        ],
      },
    });
  };

  private mappingSpecifiedData = (products: any[]) =>
    products.map((el: any) => ({
      ...el.product,
      brand: el.brand,
      collection: el.collection,
      full_material_code: `${el.material_code?.code} ${el.project_products.suffix_code}`,
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
        material_order || "ASC"
      );
    const mappedProducts = this.mappingSpecifiedData(specifiedProducts);
    const uniqueList = uniqBy(mappedProducts, "full_material_code");
    const cancelledCount =
      this.countCancelledSpecifiedProductTotal(specifiedProducts);
    const availabilityRemarkCount = uniqueList.reduce(
      (total: number, prod: any) => {
        const markedAvailabilityCount =
          prod.product?.availability !== Availability.Available ? 1 : 0;
        return total + markedAvailabilityCount;
      },
      0
    );
    let returnData = uniqBy(mappedProducts, "full_material_code");
    if (material_order) {
      returnData = orderBy(
        returnData,
        ["full_material_code"],
        [material_order.toLowerCase() as any]
      );
    }
    return successResponse({
      data: {
        data: returnData,
        summary: [
          {
            name: "Specified",
            value: uniqueList.length - cancelledCount,
          },
          { name: "Cancelled", value: cancelledCount },
          {
            name: "Availability Remark",
            value: availabilityRemarkCount,
            position: SummaryItemPosition.Left,
          },
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
        zone_order || "ASC",
        area_order || "ASC",
        room_order || "ASC",
        brand_order || "ASC",
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

  public getUsedMaterialCodes = async (project_product_id: string) => {
    const projectProduct = await projectProductRepository.find(
      project_product_id
    );
    const allUseMaterialCodes = (
      await projectProductRepository.getUsedMaterialCodes(
        project_product_id,
        projectProduct?.project_id
      )
    ).filter((item: any) => !isEmpty(item.material_code_id));
    return successResponse({
      data: allUseMaterialCodes,
    });
  };
}

export const projectProductService = new ProjectProductService();

export default ProjectProductService;
