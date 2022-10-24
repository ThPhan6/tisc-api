import { marketAvailabilityService } from "./../market_availability/market_availability.services";
import { REGION_KEY } from "@/constants";
import { getDistinctArray } from "@/helper/common.helper";
import {
  ActiveStatus,
  BrandAttributes,
  ICollectionAttributes,
  ILocationAttributes,
  IProductAttributes,
  SummaryInfo,
} from "@/types";
import { BrandDataSummary, ListBrandCustom } from "./brand.type";
import { v4 as uuidv4 } from "uuid";

export const getCountryName = (
  originLocation: ILocationAttributes | false | any,
  headquarterLocation: ILocationAttributes | false | any
) => {
  if (!originLocation) {
    return "N/A";
  }
  return headquarterLocation
    ? headquarterLocation.country_name
    : originLocation.country_name;
};

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

export const mappingBrandSummary = async (
  brandSummaryData: BrandDataSummary[],
  userCount: number
): Promise<SummaryInfo[]> => {
  let locations: ILocationAttributes[] = [];

  let countries: {
    id: string;
    name: string;
    phone_code: string;
    region: string;
  }[] = [];

  let collections: ICollectionAttributes[] = [];

  let cards: IProductAttributes[] = [];

  let categories: any[] = [];

  let products: number = 0;

  for (const data of brandSummaryData) {
    locations = locations.concat(data.locations);

    collections = collections.concat(data.collections);

    cards = cards.concat(data.products);

    const countryIds = locations.map((location) => {
      return location.country_id;
    });

    const distinctCountryIds = getDistinctArray(countryIds);
    countries = await marketAvailabilityService.getRegionCountries(
      distinctCountryIds
    );

    categories = getDistinctArray(
      cards.reduce((pre: string[], cur) => {
        return pre.concat(cur.category_ids);
      }, [])
    );

    products = cards.reduce((pre: number, cur) => {
      cur.specification_attribute_groups.forEach((group) => {
        group.attributes.forEach((attribute) => {
          if (attribute.type === "Options")
            pre = pre + (attribute.basis_options?.length || 0);
        });
      });
      return pre;
    }, 0);
  }

  return [
    {
      id: uuidv4(),
      quantity: brandSummaryData.length,
      label: "BRAND COMPANIES",
      subs: [
        {
          id: uuidv4(),
          quantity: locations.length,
          label: "Locations",
        },
        {
          id: uuidv4(),
          quantity: userCount,
          label: "Teams",
        },
      ],
    },
    {
      id: uuidv4(),
      quantity: countries.length,
      label: "COUNTRIES",
      subs: [
        {
          id: uuidv4(),
          quantity: countries.filter(
            (item) => item.region === REGION_KEY.AFRICA
          ).length,
          label: "Africa",
        },
        {
          id: uuidv4(),
          quantity: countries.filter((item) => item.region === REGION_KEY.ASIA)
            .length,
          label: "Asia",
        },
        {
          id: uuidv4(),
          quantity: countries.filter(
            (item) => item.region === REGION_KEY.EUROPE
          ).length,
          label: "Europe",
        },
        {
          id: uuidv4(),
          quantity: countries.filter(
            (item) => item.region === REGION_KEY.NORTH_AMERICA
          ).length,
          label: "N.America",
        },
        {
          id: uuidv4(),
          quantity: countries.filter(
            (item) => item.region === REGION_KEY.OCEANIA
          ).length,
          label: "Oceania",
        },
        {
          id: uuidv4(),
          quantity: countries.filter(
            (item) => item.region === REGION_KEY.SOUTH_AMERICA
          ).length,
          label: "S.America",
        },
      ],
    },
    {
      id: uuidv4(),
      quantity: products,
      label: "PRODUCTS",
      subs: [
        {
          id: uuidv4(),
          quantity: getDistinctArray(categories).length,
          label: "Categories",
        },
        {
          id: uuidv4(),
          quantity: collections.length,
          label: "Collections",
        },
        {
          id: uuidv4(),
          quantity: cards.length,
          label: "Cards",
        },
      ],
    },
  ];
};
