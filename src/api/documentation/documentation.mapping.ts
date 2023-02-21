import { IDocumentationAttributes } from "@/types";
import { IDocumentPolicy } from "./documentation.type";
import { unescape } from "lodash";
import moment from "moment";
import { replaceTemplate } from "@/helpers/common.helper";

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
        privacyPolicy = {
          id: documentation.id,
          title: documentation.title,
          document: {
            ...documentation.document,
            document,
          },
        };
        break;
      case 2:
        termsOfServices = {
          id: documentation.id,
          title: documentation.title,
          document: {
            ...documentation.document,
            document,
          },
        };
        break;
      case 3:
        cookiePolicy = {
          id: documentation.id,
          title: documentation.title,
          document: {
            ...documentation.document,
            document,
          },
        };
        break;
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
