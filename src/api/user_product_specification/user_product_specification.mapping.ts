import _ from "lodash";
import { linkageService } from "../linkage/linkage.service";
import { ConfigurationStepRequest } from "../linkage/linkage.type";
import { projectProductRepository } from "../project_product/project_product.repository";

export const toOriginDataAndConfigurationStep = (payload: any) => {
  let configurationSteps: ConfigurationStepRequest[] = [];
  let stepSelections: any = {};
  let specification_id = "";
  const originData = payload.specification.attribute_groups.map(
    (group: any) => {
      if (group.configuration_steps) {
        configurationSteps = group.configuration_steps;
        specification_id = group.id;
      }
      if (group.step_selections) {
        stepSelections = group.step_selections;
        specification_id = group.id;
      }
      return {
        id: group.id,
        attributes: group.attributes,
      };
    }
  );
  return {
    data: {
      ...payload,
      specification: {
        ...payload.specification,
        attribute_groups: originData,
      },
    },
    configuration_steps: configurationSteps,
    step_selections: stepSelections,
    specification_id,
  };
};

export const toOriginDataAndUpsertConfigurationSteps = async (
  id: string,
  payload: any
) => {
  const projectProduct = await projectProductRepository.find(id);
  const originData = await Promise.all(
    payload.specification.attribute_groups.map(async (group: any) => {
      if (group.step_selections && projectProduct) {
        await linkageService.upsertStepSelection({
          product_id: projectProduct.product_id,
          project_id: projectProduct.project_id,
          step_selections: group.step_selections,
          specification_id: group.id,
        });
      }
      return {
        id: group.id,
        attributes: group.attributes,
      };
    })
  );
  return {
    data: {
      ...payload,
      specification: {
        ...payload.specification,
        attribute_groups: originData,
      },
    },
  };
};
