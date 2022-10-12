import { ListGeneralInquiryCustom } from "@/types/general_inquiry.type";
export const mappingGeneralInquiries = (
  generalInquiries: ListGeneralInquiryCustom[]
) => {
  return generalInquiries.map((inquiry) => {
    return {
      ...inquiry.general_inquiry,
      inquirer: inquiry.inquirer,
      design_firm: inquiry.design_firm.name,
      inquiry_for: inquiry.inquiries_for[0].name,
      firm_location:
        inquiry.design_firm.state_name && inquiry.design_firm.country_name
          ? `${inquiry.design_firm.state_name}, ${inquiry.design_firm.country_name}`
          : "",
    };
  });
};
