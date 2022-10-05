import { IDocumentationAttributes } from "@/types";
import { IDocumentPolicy } from "./documentation.type";
import { unescape } from "lodash";
import moment from "moment";
import { replaceTemplate } from "@/helper/common.helper";

export const mappingGroupGeneralDocumentation = (
  documentations: IDocumentationAttributes[]
) => {
  const defaultDocumentation = {
    id: "",
    title: "",
    document: {},
  };

  let termsOfServices: IDocumentPolicy = defaultDocumentation;
  let privacyPolicy: IDocumentPolicy = defaultDocumentation;
  let cookiePolicy: IDocumentPolicy = defaultDocumentation;

  documentations.forEach((documentation) => {
    const document = replaceTemplate(
      unescape(documentation.document.document),
      "last_revised",
      moment(documentation.updated_at).format("YYYY-MM-DD") || ""
    );
    switch (documentation.number) {
      case 1:
        return (privacyPolicy = {
          id: documentation.id,
          title: documentation.title,
          document: {
            ...documentation.document,
            document,
          },
        });
      case 2:
        return (termsOfServices = {
          id: documentation.id,
          title: documentation.title,
          document: {
            ...documentation.document,
            document,
          },
        });
      case 3:
        return (cookiePolicy = {
          id: documentation.id,
          title: documentation.title,
          document: {
            ...documentation.document,
            document,
          },
        });
      default:
        break;
    }
  });

  return [
    {
      terms_of_services: termsOfServices,
    },
    {
      privacy_policy: privacyPolicy,
    },
    {
      cookie_policy: cookiePolicy,
    },
  ];
};
