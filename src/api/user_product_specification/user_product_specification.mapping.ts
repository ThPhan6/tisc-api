import _ from "lodash";
import { ConfigurationStepRequest } from "../linkage/linkage.type";

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
