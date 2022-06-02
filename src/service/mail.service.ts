import * as DotEnv from "dotenv";
import * as ejs from "ejs";
import { IUserAttributes } from "../model/user.model";
import { IMessageResponse } from "../type/common.type";
const SibApiV3Sdk = require("sib-api-v3-sdk");

export default class MailService {
  private fromAddress: string;
  private frontpageURL: string;
  private apiInstance: any;
  private sendSmtpEmail: object;
  public constructor() {
    DotEnv.config({ path: `${process.cwd()}/.env` });
    this.fromAddress = process.env.SENDINBLUE_FROM || "";
    this.frontpageURL = process.env.FE_URL || "";
    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      process.env.SENDINBLUE_API_KEY;
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    this.sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  }
  public async sendRegisterEmail(
    user: IUserAttributes | any
  ): Promise<IMessageResponse | any> {
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
        subject: "Tisc - Registration",
        textContent: "and easy to do anywhere, even with Node.js",
        htmlContent: html,
      };
      this.apiInstance.sendTransacEmail(this.sendSmtpEmail).then(() => {
        return (
          resolve({
            message: "Success",
            statusCode: 200,
          }),
          (error: any) => {
            if (error.response) {
              return resolve({
                message: "An error occurred",
                statusCode: 400,
              });
            }
          }
        );
      });
    });
  }

  public async sendInviteEmail(
    user: IUserAttributes | any
  ): Promise<IMessageResponse | any> {
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
      this.apiInstance.sendTransacEmail(this.sendSmtpEmail).then(() => {
        return (
          resolve({
            message: "Success",
            statusCode: 200,
          }),
          (error: any) => {
            console.log(error);
            if (error.response) {
              return resolve({
                message: "An error occurred",
                statusCode: 400,
              });
            }
          }
        );
      });
    });
  }

  public async sendResetPasswordEmail(
    user: IUserAttributes
  ): Promise<IMessageResponse | any> {
    return new Promise(async (resolve) => {
      const html = await ejs.renderFile(
        `${process.cwd()}/src/templates/forgot-password.ejs`,
        {
          fullname: user.firstname + " " + user.lastname,
          reset_link: `${this.frontpageURL}/reset-password?token=${user.reset_password_token}&email=${user.email}`,
        }
      );
      this.sendSmtpEmail = {
        sender: { email: this.fromAddress, name: "TISC Team" },
        to: [
          {
            email: user.email,
          },
        ],
        subject: "Tisc - Password Reset Request",
        textContent: "and easy to do anywhere, even with Node.js",
        htmlContent: html,
      };
      this.apiInstance.sendTransacEmail(this.sendSmtpEmail).then(() => {
        return (
          resolve({
            message: "Success",
            statusCode: 200,
          }),
          (error: any) => {
            if (error.response) {
              return resolve({
                message: "An error occurred",
                statusCode: 400,
              });
            }
          }
        );
      });
    });
  }
}
