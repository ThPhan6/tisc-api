import { ActionTaskModelKey } from "@/types/action_task.type";
import { RespondedOrPendingStatus } from "@/types";

export interface ActionTaskRequestCreate {
  model_id: string;
  model_name: ActionTaskModelKey;
  common_type_ids: string[];
}

export interface ActionTaskRequestUpdateStatus {
  status: RespondedOrPendingStatus;
}
