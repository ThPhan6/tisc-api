import { specificationStepRepository } from "@/repositories/specification_step.repository";
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

export const checkXSelection = (stepSelections: any) => {
  const stepSelectionIds = Object.keys(stepSelections);
  const stepSelectIds = stepSelectionIds.map((selectId) => {
    const parts = selectId.split(",");
    const lastId = parts[parts.length - 1];
    return lastId.split("_")[0];
  });
  // check has X selection and return true false
  return specificationStepRepository.checkXSelection(stepSelectIds);
};
export const toOriginDataAndUpsertConfigurationSteps = async (
  id: string,
  payload: any
) => {
  const projectProduct = await projectProductRepository.find(id);
  let stepSelections: any = {};
  const originData = await Promise.all(
    payload.specification.attribute_groups.map(async (group: any) => {
      let dataSelection: any = [];
      if (group.step_selections && projectProduct) {
        stepSelections = {
          ...stepSelections,
          ...group.step_selections,
        };
        const data: any = await linkageService.upsertStepSelection({
          product_id: projectProduct.product_id,
          project_id: projectProduct.project_id,
          step_selections: group.step_selections,
          specification_id: group.id,
        });
        dataSelection = data.data;
      }
      return {
        id: group.id,
        attributes: group.attributes,
        step_selections: dataSelection,
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
    isHasXSelection: await checkXSelection(stepSelections),
  };
};
