import { logRepository } from "@/repositories/log.repository";
import { template } from "lodash";
export enum ActivityTypes {
  assign_product_to_project,
  create_inquiry_request,
  create_project_request,
  assign_member_to_project,
  create_project,
  update_project,
  delete_project,
  create_project_space,
  update_project_space,
  update_status_product_considered,
  remove_product_considered,
  specify_product_to_project,
  update_status_product_specified,
  remove_product_specified,
  respecified_product,
  create_action_task_general_inquiry,
  update_action_task_general_inquiry,
  create_action_task_project_request,
  update_action_task_project_request,
  create_action_task_notification,
  update_action_task_notification,
  assign_member_to_project_tracking,
  update_priority,
  create_team_profile,
  update_team_profile,
  delete_team_profile,
  enabled_permission,
}

class LogService {
  constructor() {}
  private toMessage = (type: ActivityTypes, data: any) => {
    let message = "";
    switch (type) {
      case ActivityTypes.assign_product_to_project:
        message =
          "Assigned product <%= product_id %> to project <%= project_id %>";
        break;
      case ActivityTypes.create_inquiry_request:
        message = "Created inquiry request of product <%= product_id %>";
        break;
      case ActivityTypes.create_project_request:
        message = "Created project request of product <%= product_id %>";
        break;
      case ActivityTypes.assign_member_to_project:
        message = "Assigned user <%= user_id %> to project <%= project_id %>";
        break;
      case ActivityTypes.create_project:
        message = "Created basic information of project <%= project_id %>";
        break;
      case ActivityTypes.update_project:
        message = "Updated basic information of project <%= project_id %>";
        break;
      case ActivityTypes.delete_project:
        message = "Deleted project <%= project_id %>";
        break;
      case ActivityTypes.create_project_space:
        message =
          "Created project space <%= id %> of project <%= project_id %>";
        break;
      case ActivityTypes.update_project_space:
        message =
          "Updated project space <%= id %> of project <%= project_id %>";
        break;
      case ActivityTypes.update_status_product_considered:
        message =
          "Updated status of product <%= product_id %> to <%= status_text %> in project <%= project_id %>";
        break;
      case ActivityTypes.remove_product_considered:
        message =
          "Removed product <%= product_id %> from project <%= project_id %>";
        break;
      case ActivityTypes.specify_product_to_project:
        message =
          "Specified product <%= product_id %> in project <%= project_id %>";
        break;
      case ActivityTypes.update_status_product_specified:
        message =
          "Updated status of product <%= product_id %> to <%= status_text %> in project <%= project_id %>";
        break;
      case ActivityTypes.remove_product_specified:
        message =
          "Removed product <%= product_id %> from project <%= project_id %>";
        break;
      case ActivityTypes.respecified_product:
        message =
          "Re-Specified product <%= product_id %> in project <%= project_id %>";
        break;
      case ActivityTypes.create_action_task_general_inquiry:
        message =
          "Created new task <%= task_name %> of inquiry <%= inquiry_id %>";
        break;
      case ActivityTypes.update_action_task_general_inquiry:
        message =
          "Updated status of task <%= task_name %> of inquiry <%= inquiry_id %>";
        break;
      case ActivityTypes.create_action_task_project_request:
        message =
          "Created new task <%= task_name %> of project request <%= project_request_id %>";
        break;
      case ActivityTypes.update_action_task_project_request:
        message =
          "Updated status of task <%= task_name %> of project request <%= project_request_id %>";
        break;
      case ActivityTypes.create_action_task_notification:
        message =
          "Created new task <%= task_name %> of notification <%= notification_id %>";
        break;
      case ActivityTypes.update_action_task_notification:
        message =
          "Updated status of task <%= task_name %> of notification <%= notification_id %>";
        break;
      case ActivityTypes.assign_member_to_project_tracking:
        message =
          "Assigned user <%= user_id %> to project_tracking <%= project_tracking_id %>";
        break;
      case ActivityTypes.update_priority:
        message =
          "Updated priority of project tracking <%= project_tracking_id %> to <%= priority_name %>";
        break;
      case ActivityTypes.create_team_profile:
        message = "Created user <%= user_id %>";
        break;
      case ActivityTypes.update_team_profile:
        message = "Updated user <%= user_id %>";
        break;
      case ActivityTypes.delete_team_profile:
        message = "Deleted user <%= user_id %>";
        break;
      case ActivityTypes.enabled_permission:
        message =
          "Enabled permission <%= permission_id %> of role <%= role_name %>";
        break;

      default:
        message = "Nothing to log";
        break;
    }
    return template(message)(data);
  };
  public create = async (
    type: ActivityTypes,
    options: {
      requested_time?: string;
      path?: string;
      user_id?: string;
      relation_id?: string;
      pre_data?: any;
      data?: any;
    }
  ) => {
    await logRepository.create({
      extra: {
        is_activity: true,
        requested_time: options.requested_time,
        path: options.path,
        user_id: options.user_id,
        relation_id: options.relation_id,
        pre_data: options.pre_data,
        data: options.data,
      },
      message: this.toMessage(type, {
        pre_data: options.pre_data,
        data: options.data,
      }),
    });
  };
}
export const logService = new LogService();
