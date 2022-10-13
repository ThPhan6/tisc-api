export interface ActionTaskAttribute {
  id: string;
  model_name: string; /// project_tracking_notification, project_tracking_requests, // general_inquiries
  model_id: string; ///
  status: number; /// need to define type here --// Completed, Todo-list, In Progress, Cancelled // todo-list default
  created_at: string;
  common_type_id: string; //action_task_ids
  updated_at: null | string;
  created_by: string; // user_id
}

export enum ActionTaskModel {
  notification = "project_tracking_notifications",
  request = "project_requests",
  inquiry = "general_inquiries",
}

export enum ActionTaskModelName {
  "project_tracking_notifications",
  "project_requests",
  "general_inquiries",
}

export enum ActionTaskStatus {
  "To_do_list",
  "In_progress",
  "Canceled",
  "Completed",
}
