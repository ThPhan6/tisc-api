import { ENVIROMENT } from "@/config";
import * as ejs from "ejs";
import os from "os";
import { TARGETED_FOR_TYPES } from "@/constants";
import { autoEmailRepository } from "@/repositories/auto_email.repository";
import { unescape } from "lodash";
import { UserAttributes, UserType } from "@/types";
const SibApiV3Sdk = require("sib-api-v3-sdk");

export default class MailService {
  private fromAddress: string;
  private frontpageURL: string;
  private apiInstance: any;
  private sendSmtpEmail: object;
  public constructor() {
    this.fromAddress = ENVIROMENT.SENDINBLUE_FROM || "";
    this.frontpageURL = ENVIROMENT.FE_URL || "";
    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      ENVIROMENT.SENDINBLUE_API_KEY;
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    this.sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  }
  private exeAfterSend = (resolve: any) => {
    return (
      resolve(true),
      (error: any) => {
        if (error.response) {
          return resolve(false);
        }
      }
    );
  };
  public getTargetedFor = (type: number) => {
    let result;
    switch (type) {
      case UserType.TISC:
        result = TARGETED_FOR_TYPES.TISC_TEAM;
        break;

      case UserType.Brand:
        result = TARGETED_FOR_TYPES.BRAND;
        break;

      default:
        result = TARGETED_FOR_TYPES.DESIGN_FIRM;
        break;
    }
    return result;
  };
  public async sendRegisterEmail(user: any): Promise<boolean> {
    return new Promise(async (resolve) => {
      const html = await ejs.renderFile(
        `${process.cwd()}/src/templates/register.ejs`,
        {
          email: user.email,
          firstname: user.firstname,
          verify_link: `${this.frontpageURL}/verify?verification_token=${user.verification_token}`,
        }
      );
      this.sendSmtpEmail = {
        sender: { email: this.fromAddress, name: "TISC Team" },
        to: [
          {
            email: user.email,
          },
        ],
        subject: "Successfully signed-up!",
        textContent: "and easy to do anywhere, even with Node.js",
        htmlContent: html,
      };
      this.apiInstance
        .sendTransacEmail(this.sendSmtpEmail)
        .then(() => this.exeAfterSend(resolve));
    });
  }

  public async sendInviteEmail(user: any): Promise<boolean> {
    return new Promise(async (resolve) => {
      const html = await ejs.renderFile(
        `${process.cwd()}/src/templates/invite.ejs`,
        {
          fullname: user.fullname,
          verify_link: `${this.frontpageURL}/create-password?verification_token=${user.verification_token}`,
        }
      );
      this.sendSmtpEmail = {
        sender: { email: this.fromAddress, name: "TISC Team" },
        to: [
          {
            email: user.email,
          },
        ],
        subject: "Tisc - Invitation",
        textContent: "and easy to do anywhere, even with Node.js",
        htmlContent: html,
      };
      this.apiInstance
        .sendTransacEmail(this.sendSmtpEmail)
        .then(() => this.exeAfterSend(resolve));
    });
  }

  public async sendResetPasswordEmail(
    user: UserAttributes,
    browserName: string
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const emailAutoResponder = await autoEmailRepository.findBy({
        title: "User password reset request.",
        targeted_for: this.getTargetedFor(user.type),
      });

      const userType =
        user.type === UserType.Designer
          ? "design-firms"
          : UserType[user.type].toLowerCase(); // 'design-firms' | 'tisc' | 'brand'
      const html = await ejs.render(
        unescape(emailAutoResponder?.message || ""),
        {
          operating_system: os.type(),
          browser_name: browserName,
          fullname:
            user.type === UserType.Designer
              ? user.firstname
              : user.firstname + " " + user.lastname,
          reset_link: `${this.frontpageURL}/reset-password?token=${user.reset_password_token}&email=${user.email}&redirect=/${userType}/dashboard`,
        },
        { async: true }
      );
      this.sendSmtpEmail = {
        sender: { email: this.fromAddress, name: "TISC Team" },
        to: [
          {
            email: user.email,
          },
        ],
        subject: emailAutoResponder?.title,
        textContent: "and easy to do anywhere, even with Node.js",
        htmlContent: html,
      };
      this.apiInstance
        .sendTransacEmail(this.sendSmtpEmail)
        .then(() => this.exeAfterSend(resolve));
    });
  }

  public async sendInviteEmailTeamProfile(
    inviteUser: any,
    senderUser: any
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const emailAutoResponder = await autoEmailRepository.findBy({
        title: "Welcome to the team!",
        targeted_for: this.getTargetedFor(inviteUser.type),
      });
      const html = await ejs.render(
        unescape(emailAutoResponder?.message || ""),
        {
          firstname: inviteUser.firstname,
          email: inviteUser.email,
          sender_first_name: senderUser.firstname + " " + senderUser.lastname,
          url: `${this.frontpageURL}/create-password?verification_token=${inviteUser.verification_token}&email=${inviteUser.email}`,
        },
        { async: true }
      );
      this.sendSmtpEmail = {
        sender: { email: this.fromAddress, name: "TISC Team" },
        to: [
          {
            email: inviteUser.email,
          },
        ],
        subject: emailAutoResponder?.title,
        textContent: "and easy to do anywhere, even with Node.js",
        htmlContent: html,
      };
      this.apiInstance
        .sendTransacEmail(this.sendSmtpEmail)
        .then(() => this.exeAfterSend(resolve));
    });
  }
  public async sendDesignRegisterEmail(user: any): Promise<boolean> {
    return new Promise(async (resolve) => {
      const emailAutoResponder = await autoEmailRepository.findBy({
        title: "Successfully signed-up!",
      });
      const html = await ejs.render(
        unescape(emailAutoResponder?.message || ""),
        {
          firstname: user.firstname,
          email: user.email,
          verify_link: `${this.frontpageURL}/verify?verification_token=${user.verification_token}&email=${user.email}`,
        },
        { async: true }
      );
      this.sendSmtpEmail = {
        sender: { email: this.fromAddress, name: "TISC Team" },
        to: [
          {
            email: user.email,
          },
        ],
        subject: emailAutoResponder?.title,
        textContent: "and easy to do anywhere, even with Node.js",
        htmlContent: html,
      };
      this.apiInstance
        .sendTransacEmail(this.sendSmtpEmail)
        .then(() => this.exeAfterSend(resolve));
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
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
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
      this.sendSmtpEmail = {
        sender: { email: this.fromAddress, name: "TISC Global" },
        to: [
          {
            email: to,
          },
        ],
        subject: subject,
        textContent: "and easy to do anywhere, even with Node.js",
        htmlContent: html,
      };
      this.apiInstance
        .sendTransacEmail(this.sendSmtpEmail)
        .then(() => this.exeAfterSend(resolve));
    });
  }

  public async sendBookingScheduleEmail(
    to: string,
    subject: string,
    first_name: string,
    start_time: string,
    conference_url: string,
    reschedule_url: string,
    cancel_url: string,
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const html = await ejs.renderFile(
        `${process.cwd()}/src/templates/booked.ejs`,
        {
          first_name,
          start_time,
          conference_url,
          reschedule_url,
          cancel_url
        }
      );
      this.sendSmtpEmail = {
        sender: { email: this.fromAddress, name: "TISC Global" },
        to: [
          {
            email: to,
          },
        ],
        subject: subject,
        textContent: "and easy to do anywhere, even with Node.js",
        htmlContent: html,
      };
      this.apiInstance
        .sendTransacEmail(this.sendSmtpEmail)
        .then(() => this.exeAfterSend(resolve));
    });
  }
}
export const mailService = new MailService();
