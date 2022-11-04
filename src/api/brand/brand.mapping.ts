import { getDistinctArray } from "@/helper/common.helper";
import { ActiveStatus, BrandAttributes } from "@/types";
import { ListBrandCustom } from "./brand.type";

export const mappingBrands = (dataBrandCustom: ListBrandCustom[]) => {
  return dataBrandCustom.map((dataBrand) => {
    const coverages = getDistinctArray(
      dataBrand.distributors.reduce((pre: string[], cur) => {
        const temp = [cur.country_id].concat(cur.authorized_country_ids);
        return pre.concat(temp);
      }, [])
    );

    const categories = getDistinctArray(
      dataBrand.cards.reduce((pre: string[], cur) => {
        return pre.concat(cur.category_ids);
      }, [])
    );

    const products = dataBrand.cards.reduce((pre: number, cur) => {
      cur.specification_attribute_groups.forEach((group) => {
        group.attributes.forEach((attribute) => {
          if (attribute.type === "Options")
            pre = pre + (attribute.basis_options?.length || 0);
        });
      });
      return pre;
    }, 0);

    return {
      ...dataBrand.brand,
      status_key: ActiveStatus[dataBrand.brand.status],
      coverages: coverages.length,
      categories: categories.length,
      products,
    };
  });
};

export const mappingBrandsAlphabet = (allBrand: BrandAttributes[]) => {
  return allBrand.reduce(
    (pre: any, cur: BrandAttributes) => {
      let returnedValue;
      let arr;
      switch (cur.name.slice(0, 1).toLowerCase()) {
        case "a":
        case "b":
        case "c":
          {
            arr = pre.abc;
            arr.push(cur);
            returnedValue = {
              ...pre,
              abc: arr,
            };
          }
          break;
        case "d":
        case "e":
        case "f":
          {
            arr = pre.def;
            arr.push(cur);
            returnedValue = {
              ...pre,
              def: arr,
            };
          }
          break;
        case "g":
        case "h":
        case "i":
          {
            arr = pre.ghi;
            arr.push(cur);
            returnedValue = {
              ...pre,
              ghi: arr,
            };
          }
          break;
        case "j":
        case "k":
        case "l":
          {
            arr = pre.jkl;
            arr.push(cur);
            returnedValue = {
              ...pre,
              jkl: arr,
            };
          }
          break;
        case "m":
        case "n":
        case "o":
          {
            arr = pre.mno;
            arr.push(cur);
            returnedValue = {
              ...pre,
              mno: arr,
            };
          }
          break;
        case "p":
        case "q":
        case "r":
          {
            arr = pre.pqr;
            arr.push(cur);
            returnedValue = {
              ...pre,
              pqr: arr,
            };
          }
          break;
        case "s":
        case "t":
        case "u":
        case "v":
          {
            arr = pre.stuv;
            arr.push(cur);
            returnedValue = {
              ...pre,
              stuv: arr,
            };
          }
          break;

        default:
          {
            arr = pre.wxyz;
            arr.push(cur);
            returnedValue = {
              ...pre,
              wxyz: arr,
            };
          }
          break;
      }
      return returnedValue;
    },
    {
      abc: [],
      def: [],
      ghi: [],
      jkl: [],
      mno: [],
      pqr: [],
      stuv: [],
      wxyz: [],
    }
  );
};
