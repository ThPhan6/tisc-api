export interface BookingEmailPayload {
  to: string;
  timezone: string;
  first_name: string;
  start_time: string;
  conference_url: string;
  reschedule_url: string;
  cancel_url: string;
}
export interface TransactionEmailPayload {
  sender: {
    email: string;
    name: string;
  };
  to: {
    email: string;
    name?: string;
  }[];
  subject: string;
  htmlContent: string;
  attachment?: {
    content: string; // base64 of buffer file data
    name: string;
  }[];
}
export interface TransactionEmailResponse {
  messageId: string;
}

export const EmailTemplateID = {
  tisc: {
    welcome_to_team: "e3627a80-eafc-4371-9778-051e1929b849",
    invite_by_admin: "c47b653a-ce8d-4a8b-868d-3b8f4bbb5325",
  },
  brand: {
    booking_demo: "3e402ec2-69ec-4d73-9bc2-3b975cc9ac04",
    invite_by_tisc: "ea15a0dd-c340-4dea-af9b-3ba2837721d1",
    invite_by_admin: "9073c613-304d-4e69-86cc-3d054c9ce27f",
  },
  design: {
    signup: "f45ca8c0-7997-4eaa-bada-e8ca05444572",
    invite_by_admin: "74c6d397-996c-4dbc-b181-0fe306aa65f3",
  },
  general: {
    project_added: "9196aa7d-cbc3-4b2f-8a29-48f64ef56c2d",
    project_removed: "670ddee8-90ac-498a-b07d-cdb7177ad3e0",
    forgot_password: "7136a2aa-0ae8-4176-910e-ee2611b40b02",
    inquiry: "30777330-a82f-40fe-af90-e5b77186177f",
    feedback: "0024c8cc-15ad-4256-8241-531c661fb39e",
    recommendation: "3a3930cb-d4e6-45de-86c9-6273b8130ec6",
    suspended_account: "384d4053-c6a0-4fe3-8e96-2c9816189edd",
    reinstated_account: "b74f74df-b8d0-4dc2-a58a-d00dcb0cd610",
    closed_account: "87486b18-7e38-427f-a7e0-66c3e2ed5ce7",
    brand_design_withdrew: "a1b03252-9178-4b23-bbc3-318bb184738a",
    maintenance: "94fd4181-aec2-4acb-8792-f55d6eb61eeb",
    invoice_receipt: "47154d35-b95e-4c5d-b402-02b4bbce3d2b",
    invoice_reminder: "ad92e211-a516-417b-ac23-9eff7495b7f0",
    invoice_overdue: "3eef39cb-2eeb-405f-ae39-850146325a34",
    share_via_email: "5883807e-cba4-4109-9245-78d378be3999",
    contact: "1dad2313-b422-47f4-aa6f-f4aea15586e7",
  },
};
