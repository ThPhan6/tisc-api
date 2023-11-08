import { MESSAGES } from "@/constants";
import { sortObjectArray } from "@/helpers/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { configurationStepRepository } from "@/repositories/configuration_step.repository";
import { optionLinkageRepository } from "@/repositories/option_linkage.repository";
import { specificationStepRepository } from "@/repositories/specification_step.repository";
import { stepSelectionRepository } from "@/repositories/step_selection.repository";
import { ConfigurationStepType } from "@/types";
import _ from "lodash";
import { projectProductRepository } from "../project_product/project_product.repository";
import {
  mappingSteps,
  toConnections,
  toLinkageOptions,
} from "./linkage.mappinng";
import {
  LinkageRequest,
  MultiConfigurationStepRequest,
  MultiStepRequest,
  StepSelectionRequest,
} from "./linkage.type";

class LinkageService {
  constructor() {}
  private async checkExistKeyPair(pair: string) {
    const items = pair.split(",");
    const check = await optionLinkageRepository.findPair(items);
    return check;
  }
  public async upsertLinkages(payload: LinkageRequest) {
    await Promise.all(
      payload.data.map(async (linkage) => {
        const checkedPair = await this.checkExistKeyPair(linkage.pair);
        if (checkedPair) {
          return optionLinkageRepository.update(checkedPair.id, linkage);
        }
        return optionLinkageRepository.create(linkage);
      })
    );
    return successMessageResponse(MESSAGES.SUCCESS);
  }
  public async getLinkages(option_id: string) {
    const find = await optionLinkageRepository.findPairsByOption(option_id);
    return {
      data: await toConnections(find, option_id),
      statusCode: 200,
    };
  }
  public async pair(pair: string) {
    const items = pair.split(",");
    const find = await optionLinkageRepository.findPair(items);
    if (find) await optionLinkageRepository.update(find.id, { is_pair: true });
    return successMessageResponse(MESSAGES.SUCCESS);
  }
  public async unpair(pair: string) {
    const items = pair.split(",");
    const find = await optionLinkageRepository.findPair(items);
    if (find) await optionLinkageRepository.update(find.id, { is_pair: false });
    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async upsertStep(payload: MultiStepRequest) {
    if (payload.data[0]) {
      const product_id = payload.data[0].product_id;
      const specification_id = payload.data[0].specification_id;
      const steps = await specificationStepRepository.getStepsBy(
        product_id,
        specification_id
      );
      const payloadStepOrders = payload.data.map((item) => item.order);
      const stepsToDelete = steps.filter(
        (step: any) => !payloadStepOrders.includes(step.order)
      );
      await Promise.all(
        stepsToDelete.map((step: any) => {
          return specificationStepRepository.deleteBy({
            product_id,
            specification_id,
            order: step.order,
          });
        })
      );
    }

    await Promise.all(
      payload.data.map(async (step) => {
        const found = await specificationStepRepository.findBy({
          product_id: step.product_id,
          specification_id: step.specification_id,
          order: step.order,
        });
        if (found) {
          await specificationStepRepository.update(found.id, {
            name: step.name,
            order: step.order,
            options: step.options,
          });
        } else {
          await specificationStepRepository.create(step);
        }
      })
    );

    return successMessageResponse(MESSAGES.SUCCESS);
  }
  public async getSteps(product_id: string, specification_id: string) {
    const steps = await specificationStepRepository.getStepsBy(
      product_id,
      specification_id
    );
    const result = await mappingSteps(sortObjectArray(steps, "order", "ASC"));
    return successResponse({
      data: result,
    });
  }

  public async getLinkageRestOptions(
    option_ids: string[],
    except_option_ids?: string[]
  ) {
    const find = await optionLinkageRepository.findPairsByOptions(option_ids, {
      or: true,
    });
    return {
      data: await toLinkageOptions(find, option_ids, except_option_ids),
      statusCode: 200,
    };
  }
  private async upsertConfigurationStepWithType(paramsToFind: any, data: any) {
    const found = await configurationStepRepository.findBy(paramsToFind);
    if (found) {
      await configurationStepRepository.update(found.id, {
        options: data.options,
      });
    } else {
      await configurationStepRepository.create(data);
    }
  }
  public async upsertConfigurationStep(payload: MultiConfigurationStepRequest) {
    if (payload.project_id && payload.product_id) {
      const projectProduct = await projectProductRepository.findBy({
        deleted_at: null,
        project_id: payload.project_id,
        product_id: payload.product_id,
      });
      if (!projectProduct) {
        return errorMessageResponse(MESSAGES.CONSIDER_PRODUCT_NOT_FOUND);
      }
    }
    let paramsToFind: any = payload.user_id
      ? {
          product_id: payload.product_id,
          user_id: payload.user_id,
        }
      : {
          product_id: payload.product_id,
          project_id: payload.project_id,
        };
    await Promise.all(
      payload.data.map(async (step) => {
        const temp = {
          ...paramsToFind,
          step_id: step.step_id,
        };
        this.upsertConfigurationStepWithType(temp, {
          ...step,
          product_id: payload.product_id,
          project_id: payload.project_id,
          user_id: payload.user_id,
          type: payload.user_id
            ? ConfigurationStepType.PreSelection
            : ConfigurationStepType.Selection,
        });
      })
    );
    if (payload.specification_id) {
      const payloadStepIds = payload.data.map((item) => item.step_id);

      const specificationSteps = await specificationStepRepository.getAllBy({
        product_id: payload.product_id || "",
        specification_id: payload.specification_id,
      });
      await Promise.all(
        specificationSteps.map((item) => {
          if (!payloadStepIds.includes(item.id))
            return configurationStepRepository.deleteBy({
              ...paramsToFind,
              step_id: item.id,
            });
        })
      );
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public combineQuantityForStepSelection = (data: any) => {
    const selectIds = Object.keys(data);
    const combinedOptionQuantity = selectIds.reduce(
      (pre: any, selectId: string) => {
        const parts = selectId.split(",");
        const last = parts[parts.length - 1];
        const lastParts = last.split("_");
        const optionId = lastParts[0];
        const quantity = data[selectId];
        return quantity > 0
          ? {
              ...pre,
              [optionId]: pre[optionId] ? pre[optionId] + quantity : quantity,
            }
          : pre;
      },
      {}
    );
    const optionIds = Object.keys(combinedOptionQuantity);
    return optionIds.map((optionId: string) => {
      return {
        id: optionId,
        quantity: combinedOptionQuantity[optionId],
      };
    });
  };
  
  public validateQuantities = (data: any, specificationSteps: any[]) => {
    const selectIds = Object.keys(data);
    const combinedOptionQuantity = selectIds.reduce(
      (pre: any, selectId: string) => {
        const parts = selectId.split(",");
        // if (parts.length === 1) return pre;
        const destination = parts[parts.length - 1];
        const optionId = destination;
        const quantity = data[selectId];
        return quantity > 0
          ? {
              ...pre,
              [optionId]: {
                quantity: pre[optionId]
                  ? pre[optionId].quantity + quantity
                  : quantity,
                pre_option: parts
                  .slice(0, parts.length - 1)
                  .map((item: string) => item.split("_")[0])
                  .join(","),
                select_id: selectId,
              },
            }
          : pre;
      },
      {}
    );

    const optionIds = Object.keys(combinedOptionQuantity);
    const mappedQuantities = optionIds.map((optionId) => {
      return {
        id: optionId,
        quantity: combinedOptionQuantity[optionId].quantity,
        pre_option: combinedOptionQuantity[optionId].pre_option,
        select_id: combinedOptionQuantity[optionId].select_id,
      };
    });
    let check = true;
    const flatSpecificationOptions = specificationSteps.reduce(
      (pre: any, cur: any) => {
        return pre.concat(cur.options);
      },
      []
    );

    mappedQuantities.forEach((mappedQuantity) => {
      const optionId = mappedQuantity.id.split("_")[0];

      const currentOption = flatSpecificationOptions.find(
        (item: any) =>
          item.id === optionId &&
          _.isEmpty(
            mappedQuantity.pre_option
              ? item.pre_option === mappedQuantity.pre_option
              : true
          )
      );
      const nextOptions = flatSpecificationOptions.filter(
        (item: any) =>
          item.pre_option ===
          (mappedQuantity.pre_option
            ? `${mappedQuantity.pre_option},${optionId}`
            : optionId)
      );
      let yours = mappedQuantities.reduce((pre: number, cur: any) => {
        if (
          cur.select_id.includes(mappedQuantity.select_id) &&
          cur.select_id.split(",").length -
            mappedQuantity.select_id.split(",").length ===
            1 &&
          cur.select_id !== mappedQuantity.select_id
        )
          return pre + cur.quantity;
        return pre;
      }, 0);

      if (!currentOption) check = false;

      if (
        currentOption &&
        currentOption.replicate !== yours &&
        nextOptions.length !== 0
      )
        check = false;
    });
    return check;
  };
  public async upsertStepSelection(payload: StepSelectionRequest) {
    const specificationSteps: any = await linkageService.getSteps(
      payload.product_id || "",
      payload.specification_id || ""
    );
    const isValidQuantity = this.validateQuantities(
      payload.step_selections,
      specificationSteps.data
    );
    if (!isValidQuantity) {
      return errorMessageResponse(
        MESSAGES.CONFIGURATION_STEP_QUANTITIES_NOT_EQUAL_TO_AUTO_STEP_REPLICATE
      );
    }
    if (payload.project_id && payload.product_id) {
      const projectProduct = await projectProductRepository.findBy({
        deleted_at: null,
        project_id: payload.project_id,
        product_id: payload.product_id,
      });
      if (!projectProduct) {
        return errorMessageResponse(MESSAGES.CONSIDER_PRODUCT_NOT_FOUND);
      }
    }
    let paramsToFind: any = payload.user_id
      ? {
          product_id: payload.product_id,
          user_id: payload.user_id,
          specification_id: payload.specification_id,
        }
      : {
          product_id: payload.product_id,
          project_id: payload.project_id,
          specification_id: payload.specification_id,
        };
    const stepSelection = await stepSelectionRepository.findBy(paramsToFind);
    if (!stepSelection) {
      await stepSelectionRepository.create({
        ...payload,
        combined_quantities: this.combineQuantityForStepSelection(
          payload.step_selections
        ),
      });
    } else {
      await stepSelectionRepository.update(stepSelection.id, {
        quantities: payload.step_selections,
        combined_quantities: this.combineQuantityForStepSelection(
          payload.step_selections
        ),
      });
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  }
  public async getConfigurationSteps(
    product_id: string,
    specification_id: string,
    project_id?: string,
    user_id?: string
  ) {
    const steps = await specificationStepRepository.getAllBy({
      product_id,
      specification_id,
    });
    const stepIds = steps.map((step) => step.id);
    const configurationSteps = await configurationStepRepository.getMany(
      stepIds,
      project_id,
      user_id
    );
    const returnConfigurationSteps = sortObjectArray(steps, "order", "ASC")
      .map((step) => {
        return configurationSteps.find((item: any) => item.step_id === step.id);
      })
      .filter((item) => !_.isEmpty(item));
    return successResponse({
      data: returnConfigurationSteps,
    });
  }
}

export const linkageService = new LinkageService();
