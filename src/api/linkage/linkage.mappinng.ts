import { OptionLinkageAttribute } from "@/models/option_linkage.model";

export const toConnections = (
  linkages: OptionLinkageAttribute[],
  from: string
) => {
  return linkages.reduce((pre: any[], cur) => {
    return pre.concat([
      {
        from,
        to: cur.options.split(",").filter((item) => item !== from)[0],
        is_pair: cur.is_pair,
      },
    ]);
  }, []);
};
