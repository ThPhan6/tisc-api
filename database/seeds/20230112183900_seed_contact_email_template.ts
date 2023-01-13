import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";
import moment from "moment";
import { TOPIC_TYPES, TARGETED_FOR_TYPES } from "@/constants";
import { EmailTemplateID } from "@/types";

const template = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <title>Shared Product</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Inter"
    />
    <style></style>
    <style>
      .wrapper {
        font-family: "Inter";
        background-color: #f0f8ff;
        padding: 24px;
      }
      .wrapper p {
        font-size: 14px;
        margin: 0;
      }

      .content {
        width: 50%;
        max-width: 584px;
        background: #fff;
        min-height: 732px;
      }
      .message {
        padding: 0 16px 16px;
      }
      .tisc-table-content {
        width: 100%;
        border-spacing: 0;
      }
      .tisc-table-content td {
        height: 32px;
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
        padding-top: 16px;
        font-size: 14px;
      }
      .tisc-table-content td p {
        font-size: 12px;
      }
      .tisc-message-text {
        margin: 0;
        padding: 16px 16px 32px;
      }
      .tisc-table-product {
        width: 100%;
        border-spacing: 0;
        padding: 7px 0;
        border-bottom: 0.5px solid rgba(0, 0, 0, 0.3);
      }
      .tisc-table-product td {
        height: 28px;
      }
      .tisc-table-product td p {
        font-size: 12px;
      }
      .tisc-footer-text {
        padding: 8px 0px;
        font-size: 12px !important;
      }
      .tisc-footer-text-2 {
        padding: 0px 0px;
        font-size: 12px !important;
      }
      .tisc-footer-text a {
        color: #2b39d4;
        text-decoration: none;
      }
      .tisc-table-content td a {
        text-decoration: none;
        color: #000;
      }
      .tisc-image {
        border: 0.3px solid #000000;
        object-fit: cover;
      }
    </style>
  </head>

  <body>
    <div class="wrapper">
      <div class="content">
        <div class="message">
          <table class="tisc-table-content">
            <tbody>
              <tr>
                <td>From:</td>
                <td><a href="<%= from %>"><%= from %></a></td>
              </tr>
              <tr>
                <td>Subject:</td>
                <td><%= subject %></td>
              </tr>
              <tr>
                <td colspan="2">
                  <p class="tisc-message-text">
                    <%= message %>
                    <br />
                    <br />
                    <%= sender %>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
</html>

`;

export const up = (connection: ConnectionInterface) => {
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

  return connection.insert("email_autoresponders", {
    id: EmailTemplateID.general.contact,
    topic: TOPIC_TYPES.MESSAGES,
    targeted_for: TARGETED_FOR_TYPES.GENERAL,
    title: "Contact",
    message: template,
    deleted_at: null,
    updated_at: currentTime,
    created_at: currentTime,
  });
};
