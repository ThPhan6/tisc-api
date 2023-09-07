import _ from "lodash";
import { ConfigurationStepRequest } from "../linkage/linkage.type";
import { UserProductSpecificationRequest } from "./user_product_specification.model";

export const toOriginDataAndConfigurationStep = (
  payload: UserProductSpecificationRequest
) => {
  let configurationSteps: ConfigurationStepRequest[] = [];

  const originData = payload.specification.attribute_groups.map((group) => {
    configurationSteps = configurationSteps.concat(
      group.configuration_steps || []
    );
    return {
      id: group.id,
      attributes: group.attributes,
    };
  });
  return {
    data: {
      ...payload,
      specification: {
        ...payload.specification,
        attribute_groups: originData,
      },
    },
    configuration_steps: configurationSteps,
  };
};
