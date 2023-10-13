import _ from "lodash";
import { linkageService } from "../linkage/linkage.service";
import { ConfigurationStepRequest } from "../linkage/linkage.type";
import { projectProductRepository } from "../project_product/project_product.repository";

export const toOriginDataAndConfigurationStep = (payload: any) => {
  let configurationSteps: ConfigurationStepRequest[] = [];

  let specification_id = "";
  const originData = payload.specification.attribute_groups.map(
    (group: any) => {
      if (group.configuration_steps) {
        configurationSteps = group.configuration_steps;
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
      if (group.configuration_steps && projectProduct) {
        await linkageService.upsertConfigurationStep({
          product_id: projectProduct.product_id,
          project_id: projectProduct.project_id,
          data: group.configuration_steps,
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
