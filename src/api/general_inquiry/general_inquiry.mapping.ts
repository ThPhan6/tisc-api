import { GeneralInquiryAttribute } from "@/types";
import { ListGeneralInquiryCustom } from "@/types/general_inquiry.type";
export const mappingGeneralInquiries = (
  generalInquiries: ListGeneralInquiryCustom[]
) => {
  return generalInquiries.map((inquiry) => {
    return {
      ...inquiry.general_inquiry,
      inquiry_for: inquiry.inquiry_for,
      inquirer: inquiry.inquirer,
      design_firm: inquiry.design_firm.name,
      firm_location:
        inquiry.design_firm.state_name && inquiry.design_firm.country_name
          ? `${inquiry.design_firm.state_name}, ${inquiry.design_firm.country_name}`
          : "",
    };
  });
};
