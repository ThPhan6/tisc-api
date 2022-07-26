const { TOPIC_TYPES, TARGETED_FOR_TYPES } = require("./constant");
const uuid = require("uuid").v4;
const moment = require("moment");

const seed = async (db) => {
  const autoEmailCollection = await db.collection("email_autoresponders");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        id: uuid(),
        topic: TOPIC_TYPES.MESSAGES,
        targeted_for: TARGETED_FOR_TYPES.TISC_TEAM,
        title: "TISC live demo session is booked",
        message: `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">

        <head>
            <meta charset="utf-8" />
            <title>Tisc</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style media="screen"></style>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
            <style>
                body {
                    font-family: "Inter";
                }

                .pl-5 {
                    padding-left: 5px;
                }

                .pb-10 {
                    padding-bottom: 10px;
                }

                .pb-15 {
                    padding-bottom: 15px;
                }

                .pb-20 {
                    padding-bottom: 20px;
                }

                .pb-30 {
                    padding-bottom: 30px;
                }

                .text-bold {
                    font-weight: bold;
                }

                .text-bold-black {
                    font-weight: bold;
                    color: #1f2329;
                }

                .button-account-password {
                    background-color: #fff;
                    border: 2px solid #e6e6e6;
                    color: #33363c !important;
                    padding: 15px 15px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 15px;
                    margin: 4px 2px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .non-bullet {
                    list-style: none;
                }

                .text-blue-light {
                    color: #4f84ff !important;
                }

                .non-padding {
                    padding: 0;
                }

                .text-italic {
                    font-style: italic;
                }

                .content-email {
                    padding: 40px 40px;
                }

                .hr {
                    border: 1px solid #bbbfc4;
                }

                li::before {
                    content: ".";
                    color: #3370ff
                }

                .list-session-include {
                    padding-left: 10px;
                }

                .text-non-decoration {
                    text-decoration: none;
                }

                .wrapper .content-email p,
                li {
                    color: #1f2329
                }
            </style>
        </head>

        <body>
            <div class="wrapper">
                <div class="content-email">
                    <div class="message-email">
                        <p>Hi <%= firstname %>,</p>
                        <p class="pb-30">Thanks for taking an interest in our service. We are excited to learn more about your
                            brand and
                            product line while introducing our platform.</p>
                        <p>This 60mins session includes:</p>
                        <ul class="non-bullet list-session-include pb-30">
                            <li class="dot-blue-light pb-10"><span class="pl-5"> Introduce the TISC platform and its features
                                    (30
                                    mins) </span>s</li>
                            <li class="dot-blue-light pb-10"><span class="pl-5"> Question and Answers (15 mins) </span>s</li>
                            <li class="dot-blue-light pb-10"><span class="pl-5"> How can we assist your brand and the operation
                                    team
                                    (15 mins) </span>s</li>
                        </ul>
                        <p>The session is confirmed at:</p>
                        <p class="text-blue-light text-bold">{(11:00 on Tuesday, December 14, 2021)}</p>
                        <p class="pb-30">(Singapore Standard Time)</p>

                        <p>Location:</p>
                        <p class="text-bold-black pb-30">Online Virtual Meeting</p>
                        <p>You can join in with</p>
                        <p class="text-bold-black pb-30">Lark Meeting web conference.
                            <a class="text-blue-light text-non-decoration " href=" #">(Join now)</a>
                        </p>
                        <div class="pb-30">
                            <p>Need to reschedule? You can do so at:</p>
                            <a class="text-blue-light text-non-decoration " href="#"><%= {(url)} %></a>
                        </div>
                        <p class="pb-30">Thank you and talk to you soon</p>

                        <p>TISC Team</p>
                        <p class="text-blue-light pb-15">tisc.global</p>
                        <div class="pb-15">
                            <div class="hr">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>

        </html>
        `,
        is_deleted: true,
        created_at: moment(),
      },
      {
        id: uuid(),
        topic: TOPIC_TYPES.OPERATION,
        targeted_for: TARGETED_FOR_TYPES.TISC_TEAM,
        title: "User password reset request.",
        message: `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">

        <head>
          <meta charset="utf-8" />
          <title>Tisc</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style media="screen"></style>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
          <style>
            body {
              font-family: "Inter";
            }
            .pl-5 {
              padding-left: 5px;
            }
            .pb-10 {
              padding-bottom: 10px;
            }
            .pb-15 {
              padding-bottom: 15px;
            }
            .pb-20 {
              padding-bottom: 20px;
            }
            .pb-30 {
              padding-bottom: 30px;
            }
            .text-bold {
              font-weight: bold;
            }
            .text-bold-black {
              font-weight: bold;
              color: #1f2329;
            }
            .wrapper .content-email p,
            li {
              color: #1f2329
            }
            .button-account-password {
              background-color: #fff;
              border: 2px solid #e6e6e6;
              color: #33363c !important;
              padding: 15px 15px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 15px;
              margin: 4px 2px;
              cursor: pointer;
              font-weight: bold;
            }
            .non-bullet {
              list-style: none;
            }
            .text-blue-light {
              color: #4f84ff !important;
            }
            .non-padding {
              padding: 0;
            }
            .text-italic {
              font-style: italic;
            }
            .content-email {
              padding: 40px 40px;
            }
            .hr {
              border: 1px solid #bbbfc4;
            }
            li::before {
              content: ".";
              color: #3370ff
            }
            .list-session-include {
              padding-left: 10px;
            }
            .text-non-decoration {
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="content-email">
              <div class="message-email">
                <p>Hi <%= fullname %>,</p>
                <p style="line-height: 2;" class="pb-15">You recently requested to reset your password for your TISC
                  account. Use the button below to reset it. This password
                  reset is only valid for the next 24 hours</p>
                <div class="button pb-30">
                  <a href="<%= reset_link %>" class="button-account-password">Reset password</a>
                </div>
                <p class="pb-30">For security, this request was received from a <span
                    class="text-blue-light"><%=operating_system %> operating system</span>
                  device using <span class="text-blue-light"><%=browser_name%></span>. If you did not request a
                  password
                  reset, please ignore this email or <span class="text-blue-light">Contact Support</span> if you have
                  questions.</p>

                <p>TISC Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                  <div class="hr">
                  </div>
                </div>
                <p>If you're having trouble with the button, copy and paste the URL below into your web browser.
                </p>
                <span class="text-blue-light">
                  <%= reset_link %>
                </span>
              </div>
            </div>
          </div>
        </body>
        </html>
        `,
        is_deleted: false,
        created_at: moment(),
      },
      {
        id: uuid(),
        topic: TOPIC_TYPES.OPERATION,
        targeted_for: TARGETED_FOR_TYPES.BRAND,
        title: "User password reset request.",
        message: `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">

        <head>
          <meta charset="utf-8" />
          <title>Tisc</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style media="screen"></style>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
          <style>
            body {
              font-family: "Inter";
            }
            .pl-5 {
              padding-left: 5px;
            }
            .pb-10 {
              padding-bottom: 10px;
            }
            .pb-15 {
              padding-bottom: 15px;
            }
            .pb-20 {
              padding-bottom: 20px;
            }
            .pb-30 {
              padding-bottom: 30px;
            }
            .text-bold {
              font-weight: bold;
            }
            .text-bold-black {
              font-weight: bold;
              color: #1f2329;
            }
            .wrapper .content-email p,
            li {
              color: #1f2329
            }
            .button-account-password {
              background-color: #fff;
              border: 2px solid #e6e6e6;
              color: #33363c !important;
              padding: 15px 15px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 15px;
              margin: 4px 2px;
              cursor: pointer;
              font-weight: bold;
            }
            .non-bullet {
              list-style: none;
            }
            .text-blue-light {
              color: #4f84ff !important;
            }
            .non-padding {
              padding: 0;
            }
            .text-italic {
              font-style: italic;
            }
            .content-email {
              padding: 40px 40px;
            }
            .hr {
              border: 1px solid #bbbfc4;
            }
            li::before {
              content: ".";
              color: #3370ff
            }
            .list-session-include {
              padding-left: 10px;
            }
            .text-non-decoration {
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="content-email">
              <div class="message-email">
                <p>Hi <%= fullname %>,</p>
                <p style="line-height: 2;" class="pb-15">You recently requested to reset your password for your BRAND
                  account. Use the button below to reset it. This password
                  reset is only valid for the next 24 hours</p>
                <div class="button pb-30">
                  <a href="<%= reset_link %>" class="button-account-password">Reset password</a>
                </div>
                <p class="pb-30">For security, this request was received from a <span
                    class="text-blue-light"><%=operating_system %> operating system</span>
                  device using <span class="text-blue-light"><%=browser_name%></span>. If you did not request a
                  password
                  reset, please ignore this email or <span class="text-blue-light">Contact Support</span> if you have
                  questions.</p>

                <p>BRAND Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                  <div class="hr">
                  </div>
                </div>
                <p>If you're having trouble with the button, copy and paste the URL below into your web browser.
                </p>
                <span class="text-blue-light">
                <%= reset_link %>
              </span>
              </div>
            </div>
          </div>
        </body>
        </html>
        `,
        is_deleted: false,
        created_at: moment(),
      },
      {
        id: uuid(),
        topic: TOPIC_TYPES.OPERATION,
        targeted_for: TARGETED_FOR_TYPES.DESIGN_FIRM,
        title: "User password reset request.",
        message: `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">

        <head>
          <meta charset="utf-8" />
          <title>Tisc</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style media="screen"></style>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
          <style>
            body {
              font-family: "Inter";
            }
            .pl-5 {
              padding-left: 5px;
            }
            .pb-10 {
              padding-bottom: 10px;
            }
            .pb-15 {
              padding-bottom: 15px;
            }
            .pb-20 {
              padding-bottom: 20px;
            }
            .pb-30 {
              padding-bottom: 30px;
            }
            .text-bold {
              font-weight: bold;
            }
            .text-bold-black {
              font-weight: bold;
              color: #1f2329;
            }
            .wrapper .content-email p,
            li {
              color: #1f2329
            }
            .button-account-password {
              background-color: #fff;
              border: 2px solid #e6e6e6;
              color: #33363c !important;
              padding: 15px 15px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 15px;
              margin: 4px 2px;
              cursor: pointer;
              font-weight: bold;
            }
            .non-bullet {
              list-style: none;
            }
            .text-blue-light {
              color: #4f84ff !important;
            }
            .non-padding {
              padding: 0;
            }
            .text-italic {
              font-style: italic;
            }
            .content-email {
              padding: 40px 40px;
            }
            .hr {
              border: 1px solid #bbbfc4;
            }
            li::before {
              content: ".";
              color: #3370ff
            }
            .list-session-include {
              padding-left: 10px;
            }
            .text-non-decoration {
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="content-email">
              <div class="message-email">
                <p>Hi <%= fullname %>,</p>
                <p style="line-height: 2;" class="pb-15">You recently requested to reset your password for your DESIGN FIRM
                  account. Use the button below to reset it. This password
                  reset is only valid for the next 24 hours</p>
                <div class="button pb-30">
                  <a href="<%= reset_link %>" class="button-account-password">Reset password</a>
                </div>
                <p class="pb-30">For security, this request was received from a <span
                    class="text-blue-light"><%=operating_system %> operating system</span>
                  device using <span class="text-blue-light"><%=browser_name%></span>. If you did not request a
                  password
                  reset, please ignore this email or <span class="text-blue-light">Contact Support</span> if you have
                  questions.</p>

                <p>DESIGN FIRM Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                  <div class="hr">
                  </div>
                </div>
                <p>If you're having trouble with the button, copy and paste the URL below into your web browser.
                </p>
                <span class="text-blue-light">
                  <%= reset_link %>
                </span>
              </div>
            </div>
          </div>
        </body>
        </html>
        `,
        is_deleted: false,
        created_at: moment(),
      },
      {
        id: uuid(),
        topic: TOPIC_TYPES.MESSAGES,
        targeted_for: TARGETED_FOR_TYPES.TISC_TEAM,
        title: "Successfully signed-up!",
        message: `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">

        <head>
          <meta charset="utf-8" />
          <title>Tisc</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style media="screen"></style>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
          <style>
            body {
              font-family: "Inter";
            }

            .pb-10 {
              padding-bottom: 10px;
            }

            .pb-15 {
              padding-bottom: 15px;
            }

            .pb-20 {
              padding-bottom: 20px;
            }

            .pb-30 {
              padding-bottom: 30px;
            }

            .text-bold-black {
              font-weight: bold;
              color: #1f2329;
            }

            .button-account-password {
              background-color: #fff;
              border: 2px solid #e6e6e6;
              color: #33363c !important;
              padding: 15px 15px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 15px;
              margin: 4px 2px;
              cursor: pointer;
              font-weight: bold;
            }

            .non-bullet {
              list-style: none;
            }

            .text-blue-light {
              color: #4f84ff;
            }

            .non-padding {
              padding: 0;
            }

            .text-italic {
              font-style: italic;
            }

            .content-email {
              padding: 40px 40px;
            }

            .hr {
              border: 1px solid #bbbfc4;
            }

            .wrapper .content-email p,
            li {
              color: #1f2329
            }
          </style>
        </head>

        <body>
          <div class="wrapper">
            <div class="content-email">
              <div class="message-email">
                <p>Hi <%= firstname %>,</p>
                <p>Thank you for signing up.</p>
                <p class="pb-30">We built the TISC platform to manage your material library and resource room while
                  automating the manual work and eliminating human errors. So your team could save precious
                  time and re-focus on what they do best, creative design for the clients.</p>
                <p class="text-bold-black">Your account name: <%= email %></p>
                <p class="pb-15">Click the below button and be productive.</p>
                <div class="button pb-30">
                  <a href="<%= verify_link %>" class="button-account-password">Log in</a>
                </div>
                <p>As a <span class="text-bold-black"> Design Admin </span> user, it is essential to complete the
                  following after logging in for the first
                  time.</p>
                <div class="pb-10">
                  <ul class="non-padding">
                    <li class="non-bullet pb-10"><span class="text-blue-light">1.</span> Office Profile: including
                      logo, website and firm capacity</li>
                    <li class="non-bullet pb-10"><span class="text-blue-light">2.</span> Locations: at least one
                      address is required</li>
                    <li class="non-bullet pb-10"><span class="text-blue-light">3.</span> Team Profiles: create team
                      profiles and invite them to join</li>
                    <li class="non-bullet pb-10"><span class="text-blue-light">4.</span> Material/product code: your
                      custom code system
                    </li>
                  </ul>
                </div>
                <p class="pb-20">That is it. Now you could create the first project, assign team members, and search,
                  select &
                  specify the products.</p>
                <p class="pb-20">The <span class="text-italic">How-To</span> section at the top right corner will guide
                  you through
                  the features and
                  functions of
                  the platform. The information will update over time. Of course, you could always refer to
                  <span class="text-blue-light">Contact Support</span> if you have further questions.</p>
                <p>TISC Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                  <div class="hr">
                  </div>
                </div>
                <p>If you're having trouble with the button, copy and paste the URL below into your web browser.
                </p>
                <p> <%= verify_link %></p>
              </div>
            </div>
          </div>
        </body>

        </html>
        `,
        is_deleted: true,
        created_at: moment(),
      },
      {
        id: uuid(),
        topic: TOPIC_TYPES.MESSAGES,
        targeted_for: TARGETED_FOR_TYPES.TISC_TEAM,
        title: "Congratulations, the account is activated!",
        message: `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">

        <head>
            <meta charset="utf-8" />
            <title>Tisc</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style media="screen"></style>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
            <style>
                body {
                    font-family: "Inter";
                }

                .pb-10 {
                    padding-bottom: 10px;
                }

                .pb-15 {
                    padding-bottom: 15px;
                }

                .pb-20 {
                    padding-bottom: 20px;
                }

                .pb-30 {
                    padding-bottom: 30px;
                }

                .text-bold-black {
                    font-weight: bold;
                    color: #1f2329;
                }

                .button-account-password {
                    background-color: #fff;
                    border: 2px solid #e6e6e6;
                    color: #33363c !important;
                    padding: 15px 15px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 15px;
                    margin: 4px 2px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .wrapper .content-email p,
                li {
                    color: #1f2329
                }

                .non-bullet {
                    list-style: none;
                }

                .text-blue-light {
                    color: #4f84ff !important;
                }

                .non-padding {
                    padding: 0;
                }

                .text-italic {
                    font-style: italic;
                }

                .content-email {
                    padding: 40px 40px;
                }

                .hr {
                    border: 1px solid #bbbfc4;
                }
            </style>
        </head>

        <body>
            <div class="wrapper">
                <div class="content-email">
                    <div class="message-email">
                        <p>Hi <%= firstname %>,</p>
                        <p class="pb-30">Thanks for taking the time to attend the demo session. We are delighted to have you on
                            board.</p>
                        <p class="text-bold-black">Your account name: <%= email %></p>
                        <p class="pb-15">Click the below button to set your password and log in.</p>
                        <div class="button pb-30">
                            <a href="<%= url %>" class="button-account-password">Account password</a>
                        </div>
                        <p>As a <span class="text-bold-black">Brand Admin</span> user, it is essential to complete the
                            following after logging in for
                            the first
                            time.</p>
                        <div class="pb-20">
                            <ul class="non-padding">
                                <li class="non-bullet pb-10"><span class="text-blue-light">1.</span> Brand Profile: including
                                    logo and
                                    company statement</li>
                                <li class="non-bullet pb-10"><span class="text-blue-light">2.</span> Locations: at least one
                                    address
                                    is required</li>
                                <li class="non-bullet pb-10"><span class="text-blue-light">3.</span> Team Profiles: create team
                                    profiles and invite them to
                                    join</li>
                                <li class="non-bullet pb-10"><span class="text-blue-light">4.</span> Distributors: add
                                    distributors &
                                    define their coverage
                                </li>
                            </ul>
                        </div>
                        <p class="pb-20">The TISC team will assist with the product line conversion to our database at your
                            pace. Your
                            team can monitor the progress and review the accuracy. Once the product lines are listed, your
                            team can use the Market Availability function to define the territory accessibility</p>
                        <p class="pb-20">The <span class="text-italic">How-To</span> section at the top right corner will guide
                            you through
                            the features and
                            functions of
                            the platform. The information will update over time. Of course, you could always refer to
                            <span class="text-blue-light">Contact Support</span> if you have further questions.</p>
                        <p>TISC Team</p>
                        <p class="text-blue-light pb-15">tisc.global</p>
                        <div class="pb-15">
                            <div class="hr">
                            </div>
                        </div>
                        <p>If you're having trouble with the button, copy and paste the URL below into your web browser.
                        </p>
                        <p> <%= url %></p>
                    </div>
                </div>
            </div>
        </body>

        </html>
        `,
        is_deleted: true,
        created_at: moment(),
      },
      {
        id: uuid(),
        topic: TOPIC_TYPES.MESSAGES,
        targeted_for: TARGETED_FOR_TYPES.TISC_TEAM,
        title: "Welcome aboard!",
        message: `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">

        <head>
            <meta charset="utf-8" />
            <title>Tisc</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style media="screen"></style>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
            <style>
                body {
                    font-family: "Inter";
                }

                .pl-5 {
                    padding-left: 5px;
                }

                .pb-10 {
                    padding-bottom: 10px;
                }

                .pb-15 {
                    padding-bottom: 15px;
                }

                .pb-20 {
                    padding-bottom: 20px;
                }

                .pb-30 {
                    padding-bottom: 30px;
                }

                .text-bold {
                    font-weight: bold;
                }

                .text-bold-black {
                    font-weight: bold;
                    color: #1f2329;
                }

                .wrapper .content-email p,
                li {
                    color: #1f2329
                }

                .button-account-password {
                    background-color: #fff;
                    border: 2px solid #e6e6e6;
                    color: #33363c !important;
                    padding: 15px 15px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 15px;
                    margin: 4px 2px;
                    cursor: pointer;
                    font-weight: bold;
                }

                .non-bullet {
                    list-style: none;
                }

                .text-blue-light {
                    color: #4f84ff !important;
                }

                .non-padding {
                    padding: 0;
                }

                .text-italic {
                    font-style: italic;
                }

                .content-email {
                    padding: 40px 40px;
                }

                .hr {
                    border: 1px solid #bbbfc4;
                }

                li::before {
                    content: ".";
                    color: #3370ff
                }

                .list-session-include {
                    padding-left: 10px;
                }

                .text-non-decoration {
                    text-decoration: none;
                }
            </style>
        </head>

        <body>
            <div class="wrapper">
                <div class="content-email">
                    <div class="message-email">
                        <p>Hi <%= firstname %>,</p>
                        <p style="line-height: 2;" class="pb-15"><span class="text-blue-light"><%= sender_first_name %></span> has
                            invited you to join the TISC, a
                            platform and tools dedicated to
                            improving operation and increasing productivity for the design and construction industry.</p>

                        <p class="text-bold-black">Your account name: <%= email %></p>
                        <p class="pb-15">Activate your account below.</p>
                        <div class="button pb-30">
                            <a href="<%= url %>" class="button-account-password">Set Password</a>
                        </div>
                        <p class="pb-20">The <span class="text-italic">How-To</span> section at the top right corner will guide
                            you through
                            the features and
                            functions of
                            the platform. The information will update over time. Of course, you could always refer to
                            <span class="text-blue-light">Contact Support</span> if you have further questions.</p>
                        <p>TISC Team</p>
                        <p class="text-blue-light pb-15">tisc.global</p>
                        <div class="pb-15">
                            <div class="hr">
                            </div>
                        </div>
                        <p>If you're having trouble with the button, copy and paste the URL below into your web browser.
                        </p>
                        <a class="text-blue-light" href="<%= url %>"><%= url %>></a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `,
        is_deleted: true,
        created_at: moment(),
      },
      {
        id: uuid(),
        topic: TOPIC_TYPES.ONBOARD,
        targeted_for: TARGETED_FOR_TYPES.TISC_TEAM,
        title: "Welcome to the team!",
        message: `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
        
        <head>
            <meta charset="utf-8" />
            <title>Tisc</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style media="screen"></style>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
            <style>
                body {
                    font-family: "Inter";
                }
        
                .pl-5 {
                    padding-left: 5px;
                }
        
                .pb-10 {
                    padding-bottom: 10px;
                }
        
                .pb-15 {
                    padding-bottom: 15px;
                }
        
                .pb-20 {
                    padding-bottom: 20px;
                }
        
                .pb-30 {
                    padding-bottom: 30px;
                }
        
                .text-bold {
                    font-weight: bold;
                }
        
                .text-bold-black {
                    font-weight: bold;
                    color: #1f2329;
                }
        
                .wrapper .content-email p,
                li {
                    color: #1f2329
                }
        
                .button-account-password {
                    background-color: #fff;
                    border: 2px solid #e6e6e6;
                    color: #33363c !important;
                    padding: 15px 15px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 15px;
                    margin: 4px 2px;
                    cursor: pointer;
                    font-weight: bold;
                }
        
                .non-bullet {
                    list-style: none;
                }
        
                .text-blue-light {
                    color: #4f84ff !important;
                }
        
                .non-padding {
                    padding: 0;
                }
        
                .text-italic {
                    font-style: italic;
                }
        
                .content-email {
                    padding: 40px 40px;
                }
        
                .hr {
                    border: 1px solid #bbbfc4;
                }
        
                li::before {
                    content: ".";
                    color: #3370ff
                }
        
                .list-session-include {
                    padding-left: 10px;
                }
        
                .text-non-decoration {
                    text-decoration: none;
                }
            </style>
        </head>
        
        <body>
            <div class="wrapper">
                <div class="content-email">
                    <div class="message-email">
                        <p>Hi <%= firstname %>,</p>
                        <p style="line-height: 2;" class="pb-15"><span class="text-blue-light"><%= sender_first_name %></span> has
                            invited you to join the TISC, a platform and tools dedicated to
                            improving operation and increasing productivity for the design and construction industry.</p>
        
                        <p class="text-bold-black">Your account name: <%= email %></p>
                        <p class="pb-15">Activate your account below.</p>
                        <div class="button pb-30">
                            <a href="<%= url %>" class="button-account-password">Set Password</a>
                        </div>
                        <p class="pb-20">The <span class="text-italic">How-To</span> section at the top right corner will guide
                            you through
                            the features and
                            functions of
                            the platform. The information will update over time. Of course, you could always refer to
                            <span class="text-blue-light">Contact Support</span> if you have further questions.</p>
                        <p>TISC Team</p>
                        <p class="text-blue-light pb-15">tisc.global</p>
                        <div class="pb-15">
                            <div class="hr">
                            </div>
                        </div>
                        <p>If you're having trouble with the button, copy and paste the URL below into your web browser.
                        </p>
                        <span class="text-blue-light"><%= url %></span>
                    </div>
                </div>
            </div>
        </body>
        
        </html>
        `,
        is_deleted: false,
        created_at: moment(),
      },
      {
        id: uuid(),
        topic: TOPIC_TYPES.ONBOARD,
        targeted_for: TARGETED_FOR_TYPES.BRAND,
        title: "Welcome to the team!",
        message: `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
        
        <head>
            <meta charset="utf-8" />
            <title>Tisc</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style media="screen"></style>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
            <style>
                body {
                    font-family: "Inter";
                }
        
                .pl-5 {
                    padding-left: 5px;
                }
        
                .pb-10 {
                    padding-bottom: 10px;
                }
        
                .pb-15 {
                    padding-bottom: 15px;
                }
        
                .pb-20 {
                    padding-bottom: 20px;
                }
        
                .pb-30 {
                    padding-bottom: 30px;
                }
        
                .text-bold {
                    font-weight: bold;
                }
        
                .text-bold-black {
                    font-weight: bold;
                    color: #1f2329;
                }
        
                .wrapper .content-email p,
                li {
                    color: #1f2329
                }
        
                .button-account-password {
                    background-color: #fff;
                    border: 2px solid #e6e6e6;
                    color: #33363c !important;
                    padding: 15px 15px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 15px;
                    margin: 4px 2px;
                    cursor: pointer;
                    font-weight: bold;
                }
        
                .non-bullet {
                    list-style: none;
                }
        
                .text-blue-light {
                    color: #4f84ff !important;
                }
        
                .non-padding {
                    padding: 0;
                }
        
                .text-italic {
                    font-style: italic;
                }
        
                .content-email {
                    padding: 40px 40px;
                }
        
                .hr {
                    border: 1px solid #bbbfc4;
                }
        
                li::before {
                    content: ".";
                    color: #3370ff
                }
        
                .list-session-include {
                    padding-left: 10px;
                }
        
                .text-non-decoration {
                    text-decoration: none;
                }
            </style>
        </head>
        
        <body>
            <div class="wrapper">
                <div class="content-email">
                    <div class="message-email">
                        <p>Hi <%= firstname %>,</p>
                        <p style="line-height: 2;" class="pb-15"><span class="text-blue-light"><%= sender_first_name %></span> has
                            invited you to join the BRAND, a platform and tools dedicated to
                            improving operation and increasing productivity for the design and construction industry.</p>
        
                        <p class="text-bold-black">Your account name: <%= email %></p>
                        <p class="pb-15">Activate your account below.</p>
                        <div class="button pb-30">
                            <a href="<%= url %>" class="button-account-password">Set Password</a>
                        </div>
                        <p class="pb-20">The <span class="text-italic">How-To</span> section at the top right corner will guide
                            you through
                            the features and
                            functions of
                            the platform. The information will update over time. Of course, you could always refer to
                            <span class="text-blue-light">Contact Support</span> if you have further questions.</p>
                        <p>BRAND Team</p>
                        <p class="text-blue-light pb-15">tisc.global</p>
                        <div class="pb-15">
                            <div class="hr">
                            </div>
                        </div>
                        <p>If you're having trouble with the button, copy and paste the URL below into your web browser.
                        </p>
                        <span class="text-blue-light"><%= url %></span>
                    </div>
                </div>
            </div>
        </body>
        
        </html>
        `,
        is_deleted: false,
        created_at: moment(),
      },
      {
        id: uuid(),
        topic: TOPIC_TYPES.ONBOARD,
        targeted_for: TARGETED_FOR_TYPES.DESIGN_FIRM,
        title: "Welcome to the team!",
        message: `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
        
        <head>
            <meta charset="utf-8" />
            <title>Tisc</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style media="screen"></style>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
            <style>
                body {
                    font-family: "Inter";
                }
        
                .pl-5 {
                    padding-left: 5px;
                }
        
                .pb-10 {
                    padding-bottom: 10px;
                }
        
                .pb-15 {
                    padding-bottom: 15px;
                }
        
                .pb-20 {
                    padding-bottom: 20px;
                }
        
                .pb-30 {
                    padding-bottom: 30px;
                }
        
                .text-bold {
                    font-weight: bold;
                }
        
                .text-bold-black {
                    font-weight: bold;
                    color: #1f2329;
                }
        
                .wrapper .content-email p,
                li {
                    color: #1f2329
                }
        
                .button-account-password {
                    background-color: #fff;
                    border: 2px solid #e6e6e6;
                    color: #33363c !important;
                    padding: 15px 15px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 15px;
                    margin: 4px 2px;
                    cursor: pointer;
                    font-weight: bold;
                }
        
                .non-bullet {
                    list-style: none;
                }
        
                .text-blue-light {
                    color: #4f84ff !important;
                }
        
                .non-padding {
                    padding: 0;
                }
        
                .text-italic {
                    font-style: italic;
                }
        
                .content-email {
                    padding: 40px 40px;
                }
        
                .hr {
                    border: 1px solid #bbbfc4;
                }
        
                li::before {
                    content: ".";
                    color: #3370ff
                }
        
                .list-session-include {
                    padding-left: 10px;
                }
        
                .text-non-decoration {
                    text-decoration: none;
                }
            </style>
        </head>
        
        <body>
            <div class="wrapper">
                <div class="content-email">
                    <div class="message-email">
                        <p>Hi <%= firstname %>,</p>
                        <p style="line-height: 2;" class="pb-15"><span class="text-blue-light"><%= sender_first_name %></span> has
                            invited you to join the DESIGN FIRM, a platform and tools dedicated to
                            improving operation and increasing productivity for the design and construction industry.</p>
        
                        <p class="text-bold-black">Your account name: <%= email %></p>
                        <p class="pb-15">Activate your account below.</p>
                        <div class="button pb-30">
                            <a href="<%= url %>" class="button-account-password">Set Password</a>
                        </div>
                        <p class="pb-20">The <span class="text-italic">How-To</span> section at the top right corner will guide
                            you through
                            the features and
                            functions of
                            the platform. The information will update over time. Of course, you could always refer to
                            <span class="text-blue-light">Contact Support</span> if you have further questions.</p>
                        <p>DESIGN FIRM Team</p>
                        <p class="text-blue-light pb-15">tisc.global</p>
                        <div class="pb-15">
                            <div class="hr">
                            </div>
                        </div>
                        <p>If you're having trouble with the button, copy and paste the URL below into your web browser.
                        </p>
                        <span class="text-blue-light"><%= url %></span>
                    </div>
                </div>
            </div>
        </body>
        
        </html>
        `,
        is_deleted: false,
        created_at: moment(),
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "email_autoresponders",
        },
      });
    });
    console.log("success seed email auto data");
  };
  try {
    await createAndSeed(autoEmailCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await autoEmailCollection.drop();
      await createAndSeed(autoEmailCollection);
    }
  }
};
module.exports = {
  seed,
};
