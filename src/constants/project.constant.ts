import { ProjectStatus, ProjectStatusValue } from "@/types";

export const PROJECT_STATUS_OPTIONS: {
  key: ProjectStatus;
  value: ProjectStatusValue;
}[] = [
  {
    key: ProjectStatus.Live,
    value: 0,
  },
  {
    key: ProjectStatus["On Hold"],
    value: 1,
  },
  {
    key: ProjectStatus.Archived,
    value: 2,
  },
];
