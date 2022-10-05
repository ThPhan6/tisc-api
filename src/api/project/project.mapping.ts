import { PROJECT_STATUS_OPTIONS } from "@/constants";
import { ProjectAttributes } from "@/types";
export const mappingProjectGroupByStatus = (projects: ProjectAttributes[]) => {
  return PROJECT_STATUS_OPTIONS.map((projectStatus) => {
    const groupProjects = projects.filter(
      (project) => project.status === projectStatus.value
    );
    const removedFieldsOfProject = groupProjects.map((groupProject) => {
      return {
        code: groupProject.code,
        name: groupProject.name,
        location: groupProject.location,
        building_type: groupProject.building_type,
        type: groupProject.project_type,
        measurement_unit: groupProject.measurement_unit,
        design_due: groupProject.design_due,
        construction_start: groupProject.construction_start,
      };
    });
    return {
      status_name: projectStatus.key,
      count: groupProjects.length,
      projects: removedFieldsOfProject,
    };
  });
};
