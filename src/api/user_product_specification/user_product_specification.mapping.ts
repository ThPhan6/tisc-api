import _ from "lodash";
import { ConfigurationStepRequest } from "../linkage/linkage.type";

export const toOriginDataAndConfigurationStep = (payload: any) => {
  let configurationSteps: ConfigurationStepRequest[] = [];

  const originData = payload.specification.attribute_groups.map(
    (group: any) => {
      configurationSteps = configurationSteps.concat(
        group.configuration_steps || []
      );
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
  };
};
