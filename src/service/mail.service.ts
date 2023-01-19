import { ENVIRONMENT } from "@/config";
import * as ejs from "ejs";
import os from "os";
import { autoEmailRepository } from "@/repositories/auto_email.repository";
import { unescape } from "lodash";
import {
  UserAttributes,
  UserType,
  BookingEmailPayload,
  TransactionEmailPayload,
  TransactionEmailResponse,
  EmailTemplateID,
} from "@/types";
import Axios, { AxiosInstance } from "axios";
import { toUSMoney } from "@/helper/common.helper";
import { emailQueue } from "@/queues/email.queue";
import { logRepository } from "@/repositories/log.repository";
import { IContactRequest } from "@/api/contact/contact.type";

export default class MailService {
  private frontpageURL: string;
  private apiInstance: AxiosInstance;

  private defaultSender: TransactionEmailPayload["sender"] = {
    email: ENVIRONMENT.SENDINBLUE_FROM,
    name: "TISC Team",
  };
  private getTargetedForFromUserType = (userType: UserType) => {
    if (UserType.TISC === userType) {
      return "TISC";
    }
    if (UserType.Brand === userType) {
      return "Brand";
    }
    return "Design Firm";
  };

  public constructor() {
    this.frontpageURL = ENVIRONMENT.FE_URL || "";
    this.apiInstance = Axios.create({
      baseURL: "https://api.sendinblue.com/v3/smtp",
      timeout: 10000,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": ENVIRONMENT.SENDINBLUE_API_KEY,
      },
    });
  }

  public sendTransactionEmail = async (
    payload: Omit<TransactionEmailPayload, "sender">,
    from?: string
  ) => {
    //
    if (ENVIRONMENT.ALLOW_SEND_EMAIL !== "1") {
      return true;
    }
    //
    return this.apiInstance
      .post<TransactionEmailResponse>("/email", {
        ...payload,
        sender: this.defaultSender,
      })
      .then(() => true)
      .catch(async (error) => {
        await logRepository.create({
          extra: {
            title: payload.subject,
            to: payload.to,
            from,
          },
          message: error.response?.data?.message,
        });
        return false;
      });
  };

  private getEmailTemplate = async (templateId: string, payload: object) => {
    const template = await autoEmailRepository.find(templateId);
    if (!template) {
      return false;
    }
    return {
      subject: template.title,
      html: await ejs.render(unescape(template.message), payload, {
        async: true,
      }),
    };
  };

  public async sendRegisterEmail(user: UserAttributes) {
    const template = await this.getEmailTemplate(
      EmailTemplateID.design.signup,
      {
        email: user.email,
        firstname: user.firstname,
        url: `${this.frontpageURL}/verify?verification_token=${user.verification_token}`,
      }
    );
    if (!template) {
      return false;
    }
    emailQueue.add({
      email: user.email,
      subject: template.subject,
      html: template.html,
    });
    return true;
  }

  public async sendBrandInviteEmail(user: UserAttributes, from?: string) {
    const template = await this.getEmailTemplate(
      EmailTemplateID.brand.invite_by_tisc,
      {
        firstname: user.firstname,
        email: user.email,
        url: `${this.frontpageURL}/create-password?verification_token=${user.verification_token}&email=${user.email}`,
      }
    );

    if (!template) {
      return false;
    }
    emailQueue.add({
      email: user.email,
      subject: template.subject,
      html: template.html,
      from,
    });
    return true;
  }

  public async sendResetPasswordEmail(
    user: UserAttributes,
    browserName: string
  ) {
    //
    const userType =
      user.type === UserType.Designer
        ? "design-firms"
        : UserType[user.type].toLowerCase(); // 'design-firms' | 'tisc' | 'brand'
    ///
    const template = await this.getEmailTemplate(
      EmailTemplateID.general.forgot_password,
      {
        operating_system: os.type(),
        browser_name: browserName,
        fullname:
          user.type === UserType.Designer
            ? user.firstname
            : user.firstname + " " + user.lastname,
        url: `${this.frontpageURL}/reset-password?token=${user.reset_password_token}&email=${user.email}&redirect=/${userType}/dashboard`,
        user_type: this.getTargetedForFromUserType(user.type),
      }
    );

    if (!template) {
      return false;
    }
    emailQueue.add({
      email: user.email,
      subject: template.subject,
      html: template.html,
    });
    return true;
  }

  public async sendInviteEmailTeamProfile(
    inviteUser: UserAttributes,
    senderUser: UserAttributes
  ) {
    let templateId = EmailTemplateID.design.invite_by_admin;
    if (inviteUser.type === UserType.TISC) {
      templateId = EmailTemplateID.tisc.invite_by_admin;
    }
    if (inviteUser.type === UserType.Brand) {
      templateId = EmailTemplateID.brand.invite_by_admin;
    }

    const template = await this.getEmailTemplate(templateId, {
      firstname: inviteUser.firstname,
      email: inviteUser.email,
      sender_first_name: senderUser.firstname + " " + senderUser.lastname,
      url: `${this.frontpageURL}/create-password?verification_token=${inviteUser.verification_token}&email=${inviteUser.email}`,
    });

    if (!template) {
      return false;
    }
    emailQueue.add({
      email: inviteUser.email,
      subject: template.subject,
      html: template.html,
      from: senderUser.email,
    });
    return true;
  }

  public async sendInvoiceCreated(
    receiver_email: string,
    receiver_first_name: string,
    billing_amount: number,
    attachment_content: string,
    attachment_name: string,
    from?: string
  ) {
    const template = await this.getEmailTemplate(
      EmailTemplateID.general.invoice_receipt,
      {
        receiver_first_name,
        billing_amount: toUSMoney(billing_amount),
        url: `${this.frontpageURL}`,
      }
    );
    if (!template) {
      return false;
    }
    emailQueue.add({
      email: receiver_email,
      subject: template.subject,
      html: template.html,
      attachment: [
        {
          content: attachment_content,
          name: attachment_name,
        },
      ],
      from,
    });
    return true;
  }

  public async sendInvoiceReminder(
    receiver_email: string,
    receiver_first_name: string,
    attachment_content: string,
    attachment_name: string,
    overdue?: boolean,
    from?: string
  ) {
    const emailTemplate = overdue
      ? EmailTemplateID.general.invoice_overdue
      : EmailTemplateID.general.invoice_reminder;

    const template = await this.getEmailTemplate(emailTemplate, {
      receiver_first_name,
      url: `${this.frontpageURL}`,
    });

    if (!template) {
      return false;
    }
    emailQueue.add({
      email: receiver_email,
      subject: template.subject,
      html: template.html,
      attachment: [
        {
          content: attachment_content,
          name: attachment_name,
        },
      ],
      from,
    });
    return true;
  }

  public async sendShareProductViaEmail(
    to: string,
    from: string,
    subject: string,
    message: string,
    product_image: string,
    brand_name: string,
    brand_logo: string,
    collection_name: string,
    product_description: string,
    sender: string,
    product_url: string
  ) {
    const template = await this.getEmailTemplate(
      EmailTemplateID.general.share_via_email,
      {
        to,
        from,
        subject,
        message,
        product_image,
        brand_name,
        brand_logo,
        collection_name,
        product_description,
        sender,
        product_url,
      }
    );
    if (!template) {
      return false;
    }

    //
    emailQueue.add({
      email: to,
      subject: subject,
      html: template.html,
    });
    return true;
  }

  public async sendBookingScheduleEmail(data: BookingEmailPayload) {
    const template = await this.getEmailTemplate(
      EmailTemplateID.brand.booking_demo,
      data
    );
    if (!template) {
      return false;
    }
    //
    emailQueue.add({
      email: data.to,
      subject: template.subject,
      html: template.html,
    });
    return true;
  }
  public async sendContactEmail(data: IContactRequest) {
    const template = await this.getEmailTemplate(
      EmailTemplateID.general.contact,
      {
        from: data.email,
        subject: "Contact",
        message: data.inquiry,
        sender: data.name,
      }
    );
    if (!template) {
      return false;
    }
    //
    emailQueue.add({
      email: ENVIRONMENT.CONTACT_RECEIVER,
      subject: template.subject,
      html: template.html,
    });
    return true;
  }
}

export const mailService = new MailService();
