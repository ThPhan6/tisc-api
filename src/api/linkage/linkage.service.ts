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
  public async validateQuantities(payload: MultiConfigurationStepRequest) {
    const stepIds = payload.data.map((item) => item.step_id);
    const steps = await specificationStepRepository.getMany(stepIds);
    const sortedSteps = sortObjectArray(steps, "order", "ASC");

    const stepOptions = steps.reduce((pre: any[], cur) => {
      return pre.concat(cur.options);
    }, []);
    const configurationStepOptions = payload.data
      .filter((item) => item.step_id !== sortedSteps[0].id)
      .reduce((pre: any[], cur) => {
        return pre.concat(cur.options);
      }, [])
      .map((item) => {
        const found = stepOptions.find(
          (el) => el.id === item.id && el.pre_option === item.pre_option
        );
        return {
          ...item,
          ...found,
        };
      });
    const preOptionQuantity = configurationStepOptions.reduce((pre, cur) => {
      return {
        ...pre,
        [cur.pre_option]: (pre[cur.pre_option] || 0) + cur.quantity,
      };
    }, {});
    const keysToCheck = Object.keys(preOptionQuantity);
    let check = true;
    keysToCheck.forEach((preOptionToCheck) => {
      const foundReplicate = stepOptions.find((item) => {
        if (item.pre_option)
          return preOptionToCheck === `${item.pre_option},${item.id}`;
        else return preOptionToCheck === item.id;
      });
      if (
        !foundReplicate ||
        foundReplicate.replicate !== preOptionQuantity[preOptionToCheck]
      ) {
        check = false;
      }
    });

    return check;
  }
  public async upsertConfigurationStep(payload: MultiConfigurationStepRequest) {
    // const isValidQuantity = await this.validateQuantities(payload);
    // if (!isValidQuantity) {
    //   return errorMessageResponse(
    //     MESSAGES.CONFIGURATION_STEP_QUANTITIES_NOT_EQUAL_TO_AUTO_STEP_REPLICATE
    //   );
    // }
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
