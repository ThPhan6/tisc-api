import { sortObjectArray } from "@/helpers/common.helper";
import { OptionLinkageAttribute } from "@/models/option_linkage.model";
import { basisOptionMainRepository } from "@/repositories/basis_option_main.repository";
import { optionLinkageRepository } from "@/repositories/option_linkage.repository";
import { SpecificationStepAttribute } from "@/types";
import _ from "lodash";
import { getAllBasisOptionValues } from "../basis/basis.mapping";

export const toConnections = async (
  linkages: OptionLinkageAttribute[],
  from: string
) => {
  const allOptions = await getAllBasisOptionValues();
  const fromProductId = allOptions.find((item) => item.id === from).product_id;
  return linkages
    .reduce((pre: any[], cur) => {
      const to = cur.pair.split(",").filter((item) => item !== from)[0];
      const toProductId = allOptions.find((item) => item.id === to)?.product_id;
      return pre.concat([
        {
          from,
          from_product_id: fromProductId,
          to,
          to_product_id: toProductId,
          is_pair: cur.is_pair,
        },
      ]);
    }, [])
    .filter((item) => item.is_pair === true);
};
export const toLinkageOptions = async (
  linkages: OptionLinkageAttribute[],
  froms: string[],
  except_option_ids?: string[]
) => {
  const allOptions = await getAllBasisOptionValues();
  const tos = linkages
    .filter((item) => item.is_pair === true)
    .reduce((pre: any[], cur) => {
      const to = cur.pair.split(",").filter((item) => !froms.includes(item))[0];
      const toOption = allOptions.find((item) => item.id === to);
      if (!toOption) return pre;
      return pre.concat([
        {
          id: to,
          product_id: toOption.product_id,
          name: toOption.name,
          sub_id: toOption.sub_id,
          sub_name: toOption.sub_name,
          main_id: toOption.main_id,
          image: toOption.image,
          value_1: toOption.value_1,
          value_2: toOption.value_2,
          unit_1: toOption.unit_1,
          unit_2: toOption.unit_2,
        },
      ]);
    }, []);
  const uniqueTos = _.uniqBy(tos, "id");
  const groupedByMain = _.groupBy(uniqueTos, (item) => item.main_id);

  let mainIds = Object.keys(groupedByMain);
  if (except_option_ids) {
    const exceptMains = uniqueTos
      .filter((item) => except_option_ids.includes(item.id))
      .map((item) => item.main_id);
    mainIds = _.difference(mainIds, exceptMains);
  }
  const result = await Promise.all(
    mainIds.map(async (mainId) => {
      const groupedBySub = _.groupBy(
        groupedByMain[mainId],
        (item) => item.sub_id
      );
      const subIds = Object.keys(groupedBySub);
      const main = await basisOptionMainRepository.find(mainId);
      return {
        id: mainId,
        name: main?.name,
        subs: sortObjectArray(
          subIds.map((subId) => ({
            id: subId,
            name: groupedBySub[subId][0].sub_name,
            subs: sortObjectArray(
              groupedBySub[subId].map((item) => ({
                id: item.id,
                product_id: item.product_id,
                image: item.image,
                value_1: item.value_1,
                value_2: item.value_2,
                unit_1: item.unit_1,
                unit_2: item.unit_2,
              })),
              "value_1",
              "ASC"
            ),
          })),
          "name",
          "ASC"
        ),
      };
    })
  );
  return sortObjectArray(result, "name", "ASC");
};

export const mappingSteps = async (steps: SpecificationStepAttribute[]) => {
  const allPairs = await optionLinkageRepository.getAllBy({ is_pair: true });
  const allOptions = await getAllBasisOptionValues();
  return Promise.all(
    steps.map(async (step) => {
      const mappedPreOptions = await Promise.all(
        step.options.map(async (option) => {
          if (!option.pre_option) return option;
          const preOptions = option.pre_option.split(",");
          const preOptionNames = preOptions.map((pre) => {
            const found = allOptions.find((item) => item.id === pre);
            let temp = [
              found.value_1,
              found.unit_1,
              "-",
              found.value_2,
              found.unit_2,
            ];
            temp = temp.filter((item) => !_.isEmpty(item));
            if (temp[temp.length - 1] === "-") temp.pop();
            return temp.join(" ");
          });
          const optionIds = preOptions.concat([option.id]);

          if (optionIds.length >= 2) {
            for (let index = 0; index < optionIds.length - 1; index++) {
              const check = allPairs.find(
                (item) =>
                  item.pair.includes(optionIds[index]) &&
                  item.pair.includes(optionIds[index + 1])
              );
              if (!check) {
                return {
                  ...option,
                  is_deleted: true,
                  pre_option_name: preOptionNames.join(", "),
                };
              }
            }
          }
          return {
            ...option,
            pre_option_name: preOptionNames.join(", "),
          };
        })
      );

      return {
        ...step,
        options: mappedPreOptions.filter((item: any) => !item.is_deleted),
      };
    })
    // .filter((item: any) => item.options?.length > 0)
  );
};
export const filterUnpairLinkage = () => {};
