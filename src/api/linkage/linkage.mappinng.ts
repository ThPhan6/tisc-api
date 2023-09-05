import { OptionLinkageAttribute } from "@/models/option_linkage.model";
import { basisOptionMainRepository } from "@/repositories/basis_option_main.repository";
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
      const toProductId = allOptions.find((item) => item.id === to).product_id;
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
      return pre.concat([
        {
          id: to,
          product_id: toOption.product_id,
          name: toOption.name,
          sub_id: toOption.sub_id,
          sub_name: toOption.sub_name,
          main_id: toOption.main_id,
          image: toOption.image,
        },
      ]);
    }, []);
  const groupedByMain = _.groupBy(tos, (item) => item.main_id);

  let mainIds = Object.keys(groupedByMain);
  if (except_option_ids) {
    const exceptMains = tos
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
        subs: subIds.map((subId) => ({
          id: subId,
          name: groupedBySub[subId][0].sub_name,
          subs: groupedBySub[subId].map((item) => ({
            id: item.id,
            product_id: item.product_id,
            image: item.image,
          })),
        })),
      };
    })
  );
  return result;
};
