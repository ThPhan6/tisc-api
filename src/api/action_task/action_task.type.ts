import { RespondedOrPendingStatus } from "@/types";

export enum ActionTaskModelEnum {
  notification = "project_tracking_notifications",
  request = "project_requests",
  inquiry = "general_inquiries",
}

export enum ActionTaskStatus {
  "To-Do-List",
  "In Progress",
  "Cancelled",
  "Completed",
}

export type ActionTaskModelKey = keyof typeof ActionTaskModelEnum;

export interface ActionTaskRequestCreate {
  model_id: string;
  model_name: ActionTaskModelKey;
  common_type_ids: string[];
}

export interface ActionTaskRequestUpdateStatus {
  status: RespondedOrPendingStatus;
}

export interface ActionTaskAttribute {
  id: string;
  model_name:
    | ActionTaskModelEnum.notification
    | ActionTaskModelEnum.inquiry
    | ActionTaskModelEnum.request; /// project_tracking_notification, project_tracking_requests, // general_inquiries
  model_id: string; ///
  status: number; /// need to define type here --// Completed, Todo-list, In Progress, Cancelled // todo-list default
  created_at: string;
  common_type_id: string; //action_task_ids
  updated_at: null | string;
  created_by: string; // user_id
}
