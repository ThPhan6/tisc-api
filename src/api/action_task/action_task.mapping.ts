import { ActionTaskModel, ActionTaskModelName } from "@/types/action_task.type";

export const parseActionTaskModelName = (modelName: string) => {
  switch (modelName) {
    case ActionTaskModelName[0]:
      return ActionTaskModel.notification;

    case ActionTaskModelName[1]:
      return ActionTaskModel.request;

    case ActionTaskModelName[2]:
      return ActionTaskModel.inquiry;

    default:
      return "";
  }
};
