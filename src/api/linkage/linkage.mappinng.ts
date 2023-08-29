import { OptionLinkageAttribute } from "@/models/option_linkage.model";
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
