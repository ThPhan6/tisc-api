import sgMail from "@sendgrid/mail";
import * as DotEnv from "dotenv";
import * as ejs from "ejs";
import { IUserAttributes } from "../model/user.model";
import { IMessageResponse } from "../type/common.type";

export default class MailService {
  private fromAddress: string;
  private frontpageURL: string;
  public constructor() {
    DotEnv.config({ path: `${process.cwd()}/.env` });
    sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
    this.fromAddress = process.env.SENDGRID_FROM || "";
    this.frontpageURL = process.env.FE_URL || "";
  }

  public async sendRegisterEmail(
    user: IUserAttributes | any
  ): Promise<IMessageResponse | any> {
    return new Promise(async (resolve) => {
      const html = await ejs.renderFile(
        `${process.cwd()}/src/templates/register.ejs`,
        {
          fullname: user.fullname,
          verify_link: `${this.frontpageURL}/verify?verification_token=${user.verification_token}`,
        }
      );
      const msg = {
        from: {
          name: "Tisc Team",
          email: this.fromAddress,
        },
        to: user.email,
        subject: "Tisc - Registration",
        text: "and easy to do anywhere, even with Node.js",
        html,
      };
      sgMail.send(msg).then(
        () => {
          resolve({
            message: "Success",
            statusCode: 200,
          });
        },
        (error: any) => {
          if (error.response) {
            resolve({
              message: "An error occurred",
              statusCode: 400,
            });
          }
        }
      );
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
      const msg = {
        from: {
          name: "Tisc Team",
          email: this.fromAddress,
        },
        to: user.email,
        subject: "Tisc - Invitation",
        text: "and easy to do anywhere, even with Node.js",
        html,
      };
      sgMail.send(msg).then(
        () => {
          resolve({
            message: "Success",
            statusCode: 200,
          });
        },
        (error: any) => {
          if (error.response) {
            resolve({
              message: "An error occurred",
              statusCode: 400,
            });
          }
        }
      );
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
          reset_link: `${this.frontpageURL}/reset-password?token=${user.reset_password_token}`,
        }
      );
      const msg = {
        from: {
          name: "Tisc Team",
          email: this.fromAddress,
        },
        to: user.email,
        subject: "Tisc - Password Reset Request",
        text: "Click to reset your password",
        html,
      };
      sgMail.send(msg).then(
        () => {
          resolve({
            message: "Success",
            statusCode: 200,
          });
        },
        (error: any) => {
          if (error.response) {
            resolve({
              message: "An error occurred",
              statusCode: 400,
            });
          }
        }
      );
    });
  }
}
