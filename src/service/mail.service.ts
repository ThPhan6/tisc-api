import { ISystemType } from "./../type/common.type";
import * as DotEnv from "dotenv";
import * as ejs from "ejs";
import { IUserAttributes } from "../model/user.model";
import os from "os";
import { SYSTEM_TYPE, TARGETED_FOR_TYPES } from "./../constant/common.constant";
import EmailAutoResponderModel from "../model/auto_email.model";
const SibApiV3Sdk = require("sib-api-v3-sdk");
export default class MailService {
  private fromAddress: string;
  private frontpageURL: string;
  private apiInstance: any;
  private sendSmtpEmail: object;
  private emailAutoResponderModel: EmailAutoResponderModel;
  public constructor() {
    DotEnv.config({ path: `${process.cwd()}/.env` });
    this.fromAddress = process.env.SENDINBLUE_FROM || "";
    this.frontpageURL = process.env.FE_URL || "";
    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      process.env.SENDINBLUE_API_KEY;
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    this.sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    this.emailAutoResponderModel = new EmailAutoResponderModel();
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
  public async sendRegisterEmail(
    user: IUserAttributes | any
  ): Promise<boolean> {
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

  public async sendInviteEmail(user: IUserAttributes | any): Promise<boolean> {
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
    user: IUserAttributes,
    browserName: string
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const emailAutoResponder = await this.emailAutoResponderModel.findBy({
        title: "User password reset request.",
        targeted_for:
          user.type === SYSTEM_TYPE.TISC
            ? TARGETED_FOR_TYPES.TISC_TEAM
            : user.type === SYSTEM_TYPE.BRAND
            ? TARGETED_FOR_TYPES.BRAND
            : TARGETED_FOR_TYPES.DESIGN_FIRM,
      });
      const userType = Object.keys(SYSTEM_TYPE)
        .find((key) => SYSTEM_TYPE[key as keyof ISystemType] === user.type)
        ?.toLowerCase();
      const html = await ejs.render(emailAutoResponder?.message || "", {
        operating_system: os.type(),
        browser_name: browserName,
        fullname: user.firstname + " " + user.lastname,
        reset_link: `${this.frontpageURL}/reset-password?token=${user.reset_password_token}&email=${user.email}&redirect=/${userType}/dashboard`,
      });
      this.sendSmtpEmail = {
        sender: { email: this.fromAddress, name: "TISC Team" },
        to: [
          {
            email: user.email,
          },
        ],
        subject: "User password reset request.",
        textContent: "and easy to do anywhere, even with Node.js",
        htmlContent: html,
      };
      this.apiInstance
        .sendTransacEmail(this.sendSmtpEmail)
        .then(() => this.exeAfterSend(resolve));
    });
  }

  public async sendInviteEmailTeamProfile(
    inviteUser: IUserAttributes | any,
    senderUser: IUserAttributes
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const emailAutoResponder = await this.emailAutoResponderModel.findBy({
        title: "Welcome to the team!",
        targeted_for:
          inviteUser.type === SYSTEM_TYPE.TISC
            ? TARGETED_FOR_TYPES.TISC_TEAM
            : inviteUser.type === SYSTEM_TYPE.BRAND
            ? TARGETED_FOR_TYPES.BRAND
            : TARGETED_FOR_TYPES.DESIGN_FIRM,
      });
      const html = await ejs.render(emailAutoResponder?.message || "", {
        firstname: inviteUser.firstname,
        email: inviteUser.email,
        sender_first_name: senderUser.firstname,
        url: `${this.frontpageURL}/create-password?verification_token=${inviteUser.verification_token}&email=${inviteUser.email}`,
      });
      this.sendSmtpEmail = {
        sender: { email: this.fromAddress, name: "TISC Team" },
        to: [
          {
            email: inviteUser.email,
          },
        ],
        subject: "Welcome to the team!",
        textContent: "and easy to do anywhere, even with Node.js",
        htmlContent: html,
      };
      this.apiInstance
        .sendTransacEmail(this.sendSmtpEmail)
        .then(() => this.exeAfterSend(resolve));
    });
  }
}
