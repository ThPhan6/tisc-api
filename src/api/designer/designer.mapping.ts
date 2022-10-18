import { DESIGN_STATUS_OPTIONS, REGION_KEY } from "@/constants";
import { getFileTypeFromBase64, randomName } from "@/helper/common.helper";
import { IProjectAttributes } from "@/model/project.model";
import { deleteFile, isExists } from "@/service/aws.service";
import {
  DesignerAttributes,
  ILocationAttributes,
  IRegionCountry,
  ProjectStatus,
} from "@/types";
import { v4 as uuidv4 } from "uuid";
import { DesignerDataCustom } from "./designer.type";

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
            (project) => project.status === ProjectStatus.Live
          ).length,
          label: "Live",
        },
        {
          id: uuidv4(),
          quantity: projects.filter(
            (project) => project.status === ProjectStatus["On Hold"]
          ).length,
          label: "On Hold",
        },
        {
          id: uuidv4(),
          quantity: projects.filter(
            (project) => project.status === ProjectStatus.Archive
          ).length,
          label: "Archived",
        },
      ],
    },
  ];
};

export const mappingGetListDesigner = (
  designerDataCustom: DesignerDataCustom[]
) => {
  return designerDataCustom.map((designerData) => {
    const foundStatus = DESIGN_STATUS_OPTIONS.find(
      (designStatus) => designStatus.value === designerData.designer.status
    );

    const countLive = designerData.projects.filter(
      (projectStatus) => projectStatus == ProjectStatus.Live
    ).length;
    const countOnHold = designerData.projects.filter(
      (projectStatus) => projectStatus == ProjectStatus["On Hold"]
    ).length;
    const countArchived = designerData.projects.filter(
      (projectStatus) => projectStatus == ProjectStatus.Archive
    ).length;
    return {
      id: designerData.designer.id,
      name: designerData.designer.name,
      logo: designerData.designer.logo,
      origin: designerData.origin_location[0]?.country_name || "",
      main_office: "",
      satellites: 1,
      designers: designerData.users,
      capacities: 1,
      projects: designerData.projects.length,
      live: countLive,
      on_hold: countOnHold,
      archived: countArchived,
      status: designerData.designer.status,
      status_key: foundStatus?.key,
      assign_team: designerData.assign_team,
      created_at: designerData.designer.created_at,
    };
  });
};
