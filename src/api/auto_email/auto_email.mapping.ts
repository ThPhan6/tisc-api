import {
  TARGETED_FOR_OPTIONS,
  TOPIC_OPTIONS,
} from "@/constant/common.constant";
import { IAutoEmailAttributes } from "@/types/auto_email.type";

export const mappingAutoEmails = (autoEmails: IAutoEmailAttributes[]) => {
  return autoEmails.map((autoEmail: IAutoEmailAttributes) => {
    return {
      ...autoEmail,
      targeted_for_key: TARGETED_FOR_OPTIONS.find(
        (targetedFor) => targetedFor.value === autoEmail.targeted_for
      )?.key,
      topic_key: TOPIC_OPTIONS.find((topic) => topic.value === autoEmail.topic)
        ?.key,
    };
  });
};
