import { PROJECT_STATUS } from "@/constant/common.constant";
import { REGION_KEY } from "@/constants";
import { IProjectAttributes } from "@/model/project.model";
import {
  DesignerAttributes,
  ILocationAttributes,
  IRegionCountry,
} from "@/types";
import { v4 as uuidv4 } from "uuid";

export const mappingCountDesigner = (designFirm: DesignerAttributes[]) => {
  return designFirm.reduce((pre: number, cur) => {
    return cur.team_profile_ids ? pre + cur.team_profile_ids.length : pre;
  }, 0);
};

export const mappingDesignSummary = (
  designFirms: DesignerAttributes[],
  locations: ILocationAttributes[],
  countDesigner: number,
  countries: IRegionCountry[],
  projects: IProjectAttributes[]
) => {
  return [
    {
      id: uuidv4(),
      quantity: designFirms.length,
      label: "DESIGN FIRMS",
      subs: [
        {
          id: uuidv4(),
          quantity: locations.length,
          label: "Locations",
        },
        {
          id: uuidv4(),
          quantity: countDesigner,
          label: "Designers",
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
      quantity: projects.length,
      label: "PROJECTS",
      subs: [
        {
          id: uuidv4(),
          quantity: projects.filter(
            (project) => project.status === PROJECT_STATUS.LIVE
          ).length,
          label: "Live",
        },
        {
          id: uuidv4(),
          quantity: projects.filter(
            (project) => project.status === PROJECT_STATUS.ON_HOLD
          ).length,
          label: "On Hold",
        },
        {
          id: uuidv4(),
          quantity: projects.filter(
            (project) => project.status === PROJECT_STATUS.ARCHIVE
          ).length,
          label: "Archived",
        },
      ],
    },
  ];
};
