import { ENVIROMENT } from "@/config";
import * as ejs from "ejs";
import os from "os";
import { TARGETED_FOR_OPTIONS } from "@/constants";
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

export default class MailService {
  private frontpageURL: string;
  private apiInstance: AxiosInstance;

  private defaultSender: TransactionEmailPayload["sender"] = {
    email: ENVIROMENT.SENDINBLUE_FROM,
    name: "TISC Team",
  };

  public constructor() {
    this.frontpageURL = ENVIROMENT.FE_URL || "";
    this.apiInstance = Axios.create({
      baseURL: "https://api.sendinblue.com/v3/smtp",
      timeout: 10000,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": ENVIROMENT.SENDINBLUE_API_KEY,
      },
    });
  }

  private sendTransactionEmail = async (
    payload: Omit<TransactionEmailPayload, "sender">
  ) => {
    //
    if (ENVIROMENT.ALLOW_SEND_EMAIL !== "1") {
      return true;
    }
    //
    return this.apiInstance
      .post<TransactionEmailResponse>("/email", {
        ...payload,
        sender: this.defaultSender,
      })
      .then(() => true)
      .catch(() => false);
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
    return this.sendTransactionEmail({
      to: [{ email: user.email }],
      subject: template.subject,
      htmlContent: template.html,
    });
  }

  public async sendBrandInviteEmail(user: UserAttributes) {
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
    return this.sendTransactionEmail({
      to: [{ email: user.email }],
      subject: template.subject,
      htmlContent: template.html,
    });
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
        user_type:
          TARGETED_FOR_OPTIONS.find((item) => item.value === user.type)?.key ||
          "General",
      }
    );

    if (!template) {
      return false;
    }
    return this.sendTransactionEmail({
      to: [{ email: user.email }],
      subject: template.subject,
      htmlContent: template.html,
    });
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
    return this.sendTransactionEmail({
      to: [{ email: inviteUser.email }],
      subject: template.subject,
      htmlContent: template.html,
    });
  }

  public async sendInvoiceCreated(
    receiver_email: string,
    receiver_first_name: string,
    billing_amount: number,
    attachment_content: string,
    attachment_name: string
  ) {
    const template = await this.getEmailTemplate(
      EmailTemplateID.general.invoice_receipt,
      {
        receiver_first_name,
        billing_amount: `$${toUSMoney(billing_amount)}`,
        url: `${this.frontpageURL}`,
      }
    );
    if (!template) {
      return false;
    }
    return this.sendTransactionEmail({
      to: [{ email: receiver_email }],
      subject: template.subject,
      htmlContent: template.html,
      attachment: [
        {
          content: attachment_content,
          name: attachment_name,
        },
      ],
    });
  }

  public async sendInvoiceReminder(
    receiver_email: string,
    receiver_first_name: string,
    attachment_content: string,
    attachment_name: string,
    overdue?: boolean
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
    return this.sendTransactionEmail({
      to: [{ email: receiver_email }],
      subject: template.subject,
      htmlContent: template.html,
      attachment: [
        {
          content: attachment_content,
          name: attachment_name,
        },
      ],
    });
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
    const html = await ejs.renderFile(
      `${process.cwd()}/src/templates/product-share-by-email.ejs`,
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
    //
    return this.sendTransactionEmail({
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    });
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
    return this.sendTransactionEmail({
      to: [{ email: data.to }],
      subject: template.subject,
      htmlContent: template.html,
    });
  }
}

export const mailService = new MailService();
