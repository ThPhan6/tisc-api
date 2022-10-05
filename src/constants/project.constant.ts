import { ProjectStatusKey, ProjectStatusValue } from "@/types";

export const PROJECT_STATUS: {
  ARCHIVE: ProjectStatusValue;
  LIVE: ProjectStatusValue;
  ON_HOLD: ProjectStatusValue;
} = {
  ARCHIVE: 1,
  LIVE: 2,
  ON_HOLD: 3,
};
export const PROJECT_STATUS_OPTIONS: {
  key: ProjectStatusKey;
  value: ProjectStatusValue;
}[] = [
  {
    key: "Live",
    value: PROJECT_STATUS.LIVE,
  },
  {
    key: "On Hold",
    value: PROJECT_STATUS.ON_HOLD,
  },
  {
    key: "Archive",
    value: PROJECT_STATUS.ARCHIVE,
  },
];
