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
    await Promise.all(
      payload.data.map(async (step) => {
        let paramsToFind: any = payload.user_id
          ? {
              step_id: step.step_id,
              product_id: payload.product_id,
              user_id: payload.user_id,
            }
          : {
              step_id: step.step_id,
              product_id: payload.product_id,
              project_id: payload.project_id,
            };
        this.upsertConfigurationStepWithType(paramsToFind, {
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
    return successResponse({
      data: configurationSteps,
    });
  }
}

export const linkageService = new LinkageService();
