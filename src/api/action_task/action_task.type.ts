import { RespondedOrPendingStatus } from "@/types";

export interface ActionTaskRequestCreate {
  model_id: string;
  model_name: string;
  common_type_ids: string[];
}

export interface ActionTaskRequestUpdateStatus {
  status: RespondedOrPendingStatus;
}
