import { DESIGN_STATUS_OPTIONS } from "@/constants";
import { ProjectStatus } from "@/types";
import { DesignerDataCustom } from "./designer.type";

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
      (projectStatus) => projectStatus == ProjectStatus.Archived
    ).length;
    return {
      id: designerData.designer.id,
      name: designerData.designer.name,
      logo: designerData.designer.logo,
      origin: designerData.origin_location[0]?.country_name || "",
      main_office: "",
      satellites: 1,
      designers: designerData.userCount,
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
