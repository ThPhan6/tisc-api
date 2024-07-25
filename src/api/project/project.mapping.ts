import { PROJECT_STATUS_OPTIONS } from "@/constants";
import { sortObjectArray } from "@/helpers/common.helper";
import { ProjectWithLocation } from "@/repositories/project.repository";
import {  ProjectStatus } from "@/types";
import _ from "lodash";

export const mappingProjectGroupByStatus = (
  projects: ProjectWithLocation[]
) => {
  return sortObjectArray(
    PROJECT_STATUS_OPTIONS.map((projectStatus) => {
      const groupProjects = projects.filter(
        (project) => project.status === projectStatus.value
      );
      const removedFieldsOfProject = groupProjects.map((groupProject) => {
        const locationParts = [groupProject.location.address, groupProject.location.city_name, groupProject.location.state_name, groupProject.location.country_name]
        return {
          code: groupProject.code,
          name: groupProject.name,
          location: locationParts.filter(item => !_.isEmpty(item)).join(', '),
          building_type: groupProject.building_type,
          type: groupProject.project_type,
          measurement_unit: groupProject.measurement_unit,
          design_due: groupProject.design_due,
          construction_start: groupProject.construction_start,
        };
      });
      return {
        status_name: ProjectStatus[projectStatus.key],
        count: groupProjects.length,
        projects: sortObjectArray(removedFieldsOfProject, "code", "ASC"),
      };
    }),
    "status_name",
    "ASC"
  );
};
