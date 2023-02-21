import { logRepository } from "@/repositories/log.repository";
import { template } from "lodash";
import moment from "moment";
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
  update_product_specified,
  create_action_task,
  update_action_task,
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
          "Created project space <%= project_zone_id %> of project <%= project_id %>";
        break;
      case ActivityTypes.update_project_space:
        message =
          "Updated project space <%= project_zone_id %> of project <%= project_id %>";
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
      case ActivityTypes.update_product_specified:
        message =
          "Updated product specified <%= product_id %> from project <%= project_id %>";
        break;
      case ActivityTypes.create_action_task:
        message =
          "Created new task <%= task_name %> of <%= model_name %> <%= model_id %>";
        break;
      case ActivityTypes.update_action_task:
        message =
          "Updated status of task <%= task_name %> of <%= model_name %> <%= model_id %>";
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
          "<%= action %> permission <%= permission_id %> of role <%= role_name %>";
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
      path?: string;
      user_id?: string;
      relation_id?: string;
      data?: any;
      pre_data?: any;
      changed_data?: any;
    }
  ) => {
    await logRepository.create({
      extra: {
        is_activity: true,
        requested_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        path: options.path,
        user_id: options.user_id,
        relation_id: options.relation_id,
        data: {
          pre_data: options.pre_data,
          changed_data: options.changed_data,
        },
      },
      message: this.toMessage(type, options.data),
    });
  };
}
export const logService = new LogService();
