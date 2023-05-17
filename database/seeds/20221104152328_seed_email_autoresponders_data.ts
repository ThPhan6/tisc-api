import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";
import moment from "moment";
import { TOPIC_TYPES, TARGETED_FOR_TYPES } from "@/constants";
import { EmailTemplateID } from "@/types";

const style = `
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
        color: #000000 !important;
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
    .mr-3 {
      margin-right: 3px;
    }
</style>
`;
const newProjectAddedMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>Hi <%= receiver_first_name %>,</p>
                <p style="line-height: 2;" class="pb-15"><span class="text-blue-light"><%= sender_first_name %> <%= sender_last_name %></span> has
                    invited you collaborate on a new project.</p>

                <p class="text-bold-black">Project name: <%= project_name %></p>
                <p class="pb-15">For detail, click the below button to log in to your account.</p>
                <div class="button pb-30">
                    <a href="<%= url %>" class="button-account-password">Log in</a>
                </div>

                <p>TISC Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                    <div class="hr">
                    </div>
                </div>
                <p>“The strength of the team is each individual member. The strength of each member is the team.”– Phil Jackson
                </p>
            </div>
        </div>
    </div>
</body>

</html>
`;
const projectRemovedMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>Hi <%= receiver_first_name %>,</p>
                <p style="line-height: 2;" class="pb-15"><span class="text-blue-light"><%= sender_first_name %> <%= sender_last_name %></span> has released you from the below project.</p>

                <p class="text-bold-black">Project name: <%= project_name %></p>

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
`;
const welcomeToTheTeamMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
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
`;
const liveDemoMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>Hi <span class="text-blue-light"><%= first_name %></span>,</p>
                <p class="pb-30">Thanks for taking an interest in our service. We are excited to learn more about your
                    brand and
                    product line while introducing our platform.</p>
                <p>This 60mins demo session includes:</p>
                <ul class="list-session-include pb-30">
                    <li class="dot-blue-light pb-10"><span class="pl-5"> Introduce the TISC platform and its features
                            (30 mins)</span></li>
                    <li class="dot-blue-light pb-10"><span class="pl-5"> Question and Answers (15 mins) </span></li>
                    <li class="dot-blue-light pb-10"><span class="pl-5"> How can we assist your brand and the operation
                            team
                            (15 mins)</span></li>
                </ul>
                <p>Your session is confirmed at:</p>
                <p><%= timezone %> </p>
                <p class="text-blue-light text-bold pb-30"><%= start_time %></p>

                <p>Location:</p>
                <p class="text-bold-black pb-30">Lark Meeting web conference.
                    <a class="text-blue-light text-non-decoration" href="<%= conference_url %>">Join now</a>
                </p>
                <div class="pb-30">
                    <p>To change event, click the below button:</p>
                    <a class="text-blue-light text-non-decoration mr-3" href="<%= reschedule_url %>">Reschedule</a>
                    <a class="text-blue-light text-non-decoration" href="<%= cancel_url %>">Cancel</a>
                </div>
                <p class="pb-30">Thank you and talk to you soon.</p>

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
`;
const resetPasswordMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
  <meta charset="utf-8" />
  <title>Tisc</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style media="screen"></style>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
  ${style}
</head>
<body>
  <div class="wrapper">
    <div class="content-email">
      <div class="message-email">
        <p>Hi <%= fullname %>,</p>
        <p style="line-height: 2;" class="pb-15">You recently requested to reset your password for your <%= user_type %>
          account. Use the button below to reset it. This password
          reset is only valid for the next 24 hours</p>
        <div class="button pb-30">
          <a href="<%= url %>" class="button-account-password">Reset password</a>
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
          <%= url %>
        </span>
      </div>
    </div>
  </div>
</body>
</html>
`;
const signedUpMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
  <meta charset="utf-8" />
  <title>Tisc</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style media="screen"></style>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
  ${style}
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
          <a href="<%= url %>" class="button-account-password">Log in</a>
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
        <p> <%= url %></p>
      </div>
    </div>
  </div>
</body>

</html>
`;
const activatedAccountMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
  <meta charset="utf-8" />
  <title>Tisc</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style media="screen"></style>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
  ${style}
</head>

<body>
  <div class="wrapper">
    <div class="content-email">
      <div class="message-email">
        <p>Hi <%= firstname %>,</p>
        <p class="pb-30">Thanks for taking the time to attend the demo session. We are delighted to have you on board.</p>
        <p class="text-bold-black">Your account name: <%= email %></p>
        <p class="pb-15">Click the below button to set your password and log in.</p>
        <div class="button pb-30">
          <a href="<%= url %>" class="button-account-password">Set account password</a>
        </div>
        <p>As a <span class="text-bold-black"> Brand Admin </span> user, it is essential to complete the
          following after logging in for the first
          time.</p>
        <div class="pb-30">
          <ul class="non-padding">
            <li class="non-bullet pb-10"><span class="text-blue-light">1.</span> Brand Profile: including logo and company statement
            </li>
            <li class="non-bullet pb-10"><span class="text-blue-light">2.</span> Locations: at least one address is required
            </li>
            <li class="non-bullet pb-10"><span class="text-blue-light">3.</span> Team Profiles: create team profiles and invite them to join
            </li>
            <li class="non-bullet pb-10"><span class="text-blue-light">4.</span> Distributors: add distributors & define their coverage
            </li>
          </ul>
        </div>
        <p class="pb-30">The TISC team will assist with the product line conversion to our database at your pace. Your team can monitor the progress and review the accuracy. Once the product lines are listed, your team can use the Market Availability function to define the territory accessibility.</p>
        <p class="pb-30">The <span class="text-italic">How-To</span> section at the top right corner will guide
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
`;
const inquiryMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>Hi <%= receiver_first_name %>,</p>
                <p>Thank you for reaching out to TISC. We have received your message and will be in touch. In the meantime, we encourage you to book a demo, sign up for an account, and explore the platform features if you have not gotten a chance. </p>
                <p class="pb-30">Click the button below.</p>
                <div class="button pb-30">
                    <a href="<%= url %>" class="button-account-password">Explore the platform</a>
                </div>

                <p class="pb-20">Have a pleasant day!</p>
                <p>TISC Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                    <div class="hr">
                    </div>
                </div>
                <p>This is an auto-reply message.
                </p>
            </div>
        </div>
    </div>
</body>

</html>
`;
const feedbackMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>Hi <%= receiver_first_name %>,</p>
                <p class="pb-20">Thank you for sharing your feedback. Such feedback helps the team improve the features, enhance the experiences, and result in a better product. We value your input and encourage you to let us know more details about your experience with us in the future.</p>

                <p class="pb-20">Have a pleasant day!</p>
                <p>TISC Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                    <div class="hr">
                    </div>
                </div>
                <p>This is an auto-reply message.
                </p>
            </div>
        </div>
    </div>
</body>

</html>
`;
const recommendationMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>Hi <%= receiver_first_name %>,</p>
                <p class="pb-20">We truly appreciate your recommendation. Your reference helps us build a stronger community where everyone benefits. We will follow up with the lead shortly. Thank you again for your support. </p>

                <p class="pb-20">Have a pleasant day!</p>
                <p>TISC Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                    <div class="hr">
                    </div>
                </div>
                <p>This is an auto-reply message.
                </p>
            </div>
        </div>
    </div>
</body>

</html>
`;
const suspendedMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>Hi all,</p>
                <p class="pb-20">Due to the recent Agreement and Policy violation event, we have temporarily suspended the services. Your teams are not able to log in to their account. Our customer support team are working hard to resolve the issue and will inform you once the account is reinstated.</p>

                <p class="pb-20">Thank you for your patience.</p>
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
`;
const reinstatedMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>Hi all,</p>
                <p>Good news, we have resolved the issue, and now the service is reinstated.</p>
                <p class="pb-30">Click the below button to log in and be productive.</p>
                <div class="button pb-30">
                    <a href="<%= url %>" class="button-account-password">Log in</a>
                </div>
                <p class="pb-20">Please refer to
                <span class="text-blue-light">Contact Support</span> if you have further questions.</p>
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
`;
const closedMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p class="text-bold">IMPORTANT MESSAGE!</p>
                <p class="pb-30">We are sorry to see you go. We have closed your account upon your request. The account information is saved and backed up on our archive server. If you have changed your mind, please click the below button to reactivate the account.</p>
                <div class="button pb-30">
                    <a href="<%= url %>" class="button-account-password">Reactive</a>
                </div>
                <p class="pb-20">It's always been a pleasure to collaborate with you, and thank you for your support.</p>
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
`;
const withdrewMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p class="text-bold">IMPORTANT MESSAGE!</p>
                <p class="pb-20"><%= company_name %>is no longer available on the TISC platform upon their request.
                We are uncertain when they reactivated the account again.</p>
                <p class="pb-20">We are apologising for interrupting your operation and causing inconvenience. Please inform the rest of the team members and take necessary project actions accordingly.</p>

                <p class="pb-20">Refer to
                <span class="text-blue-light">Contact Support</span> if you have further questions.</p>
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
`;
const maintenanceMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p class="text-bold pb-20">IMPORTANT MESSAGE!</p>
                <p>Attention to TISC account user:</p>
                <p class="pb-20">Please be aware that our service will be unavailable at <%= from%> to <%= to%> as our tech team will be performing scheduled maintenance at this time. During this time, you will be unable to log in your account. Before maintenance takes place, please make sure you have inform your operation team and associated parties.</p>
                <p class="pb-20">This maintenance is necessary to improve product performance and platform servebility. We apologize for any inconvenience. For more information, or if you have any questions, please refer to our <span class="text-blue-light">Contact Support</span>.</p>

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
`;
const invoiceSupportMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>Hi <%= receiver_first_name %>,</p>
                <p>An invoice has been prepared for the recent service for a total amount of <%= billing_amount %>.</p>
                <p class="pb-20">Please beware of the payment due date since there will be fines for overdue payments.</p>

                <p class="pb-10">Log into your account for payment details.</p>
                <div class="button pb-10">
                    <a href="<%= url %>" class="button-account-password">Log in</a>
                </div>
                <p class="pb-20">Have a pleasant day!</p>
                <p>TISC Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                    <div class="hr">
                    </div>
                </div>
                <p>This is an auto-generated message.</p>
            </div>
        </div>
    </div>
</body>

</html>
`;
const invoiceReminderMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>Hi <%= receiver_first_name %>,</p>
                <p class="pb-20">We noticed you have not made the payment for the service. This is a friendly reminder of the last day of the payment without any overdue penalty.</p>

                <p class="pb-10">Log into your account for payment details.</p>
                <div class="button pb-10">
                    <a href="<%= url %>" class="button-account-password">Log in</a>
                </div>
                <p class="pb-20">Have a pleasant day!</p>
                <p>TISC Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                    <div class="hr">
                    </div>
                </div>
                <p>This is an auto-generated message.</p>
            </div>
        </div>
    </div>
</body>

</html>
`;
const invoiceOverdueMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>Hi <%= receiver_first_name %>,</p>
                <p class="pb-20">Unfortunately, we have started to charge fines for your overdue payment. Please make payment now without any further penalty.</p>

                <p class="pb-10">Log into your account for payment details.</p>
                <div class="button pb-10">
                    <a href="<%= url %>" class="button-account-password">Log in</a>
                </div>
                <p class="pb-20">Have a pleasant day!</p>
                <p>TISC Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                    <div class="hr">
                    </div>
                </div>
                <p>This is an auto-generated message.</p>
            </div>
        </div>
    </div>
</body>

</html>
`;
const invoicePaymentSuccessMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>Hi <%= receiver_first_name %>,</p>
                <p class="pb-20">We have just received your payment! You can find more details and download PDF receipt by visiting <%= url %></p>

                <p class="pb-20">Have a pleasant day!</p>
                <p>TISC Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                    <div class="hr">
                    </div>
                </div>
                <p>This is an auto-generated message.</p>
            </div>
        </div>
    </div>
</body>

</html>
`;
const invoicePaymentReceivedMessage = `
<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8" />
    <title>Tisc</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style media="screen"></style>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />
    ${style}
</head>

<body>
    <div class="wrapper">
        <div class="content-email">
            <div class="message-email">
                <p>From: <%= first_name %> <%= last_name %> of <%= brand_name %></p>
                <p>Invoice number: <%= invoice_id %></p>
                <p>Payment amount: <%= amount %></p>

                <p>TISC Team</p>
                <p class="text-blue-light pb-15">tisc.global</p>
                <div class="pb-15">
                    <div class="hr">
                    </div>
                </div>
                <p>This is an auto-generated message.</p>
            </div>
        </div>
    </div>
</body>

</html>
`;
export const up = (connection: ConnectionInterface) => {
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
  return connection.insert("email_autoresponders", [
    {
      id: EmailTemplateID.brand.booking_demo,
      topic: TOPIC_TYPES.MARKETING,
      targeted_for: TARGETED_FOR_TYPES.BRAND,
      title: "TISC live demo session is booked!",
      message: liveDemoMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.brand.invite_by_tisc,
      topic: TOPIC_TYPES.ONBOARD,
      targeted_for: TARGETED_FOR_TYPES.BRAND,
      title: "Congratulations, the account is activated!",
      message: activatedAccountMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.forgot_password,
      topic: TOPIC_TYPES.OPERATION,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "User password reset request",
      message: resetPasswordMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.design.signup,
      topic: TOPIC_TYPES.ONBOARD,
      targeted_for: TARGETED_FOR_TYPES.DESIGN_FIRM,
      title: "Successfully signed-up!",
      message: signedUpMessage,
      deleted_at: null,
      updated_at: null,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.tisc.invite_by_admin,
      topic: TOPIC_TYPES.ONBOARD,
      targeted_for: TARGETED_FOR_TYPES.TISC_TEAM,
      title: "Welcome to the team!",
      message: welcomeToTheTeamMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.brand.invite_by_admin,
      topic: TOPIC_TYPES.ONBOARD,
      targeted_for: TARGETED_FOR_TYPES.BRAND,
      title: "Welcome aboard!",
      message: welcomeToTheTeamMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.design.invite_by_admin,
      topic: TOPIC_TYPES.ONBOARD,
      targeted_for: TARGETED_FOR_TYPES.DESIGN_FIRM,
      title: "Welcome aboard!",
      message: welcomeToTheTeamMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.project_added,
      topic: TOPIC_TYPES.ONBOARD,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "My Workspace Notice: New project added",
      message: newProjectAddedMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.project_removed,
      topic: TOPIC_TYPES.ONBOARD,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "My Workspace Notice: Project removed",
      message: projectRemovedMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.inquiry,
      topic: TOPIC_TYPES.MESSAGES,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "Thank you for your inquiry.",
      message: inquiryMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.feedback,
      topic: TOPIC_TYPES.MESSAGES,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "Thank you for your feedback",
      message: feedbackMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.recommendation,
      topic: TOPIC_TYPES.MESSAGES,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "Thank you for your recommendation",
      message: recommendationMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.suspended_account,
      topic: TOPIC_TYPES.OPERATION,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "ACCOUNT SUSPENDED!",
      message: suspendedMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.reinstated_account,
      topic: TOPIC_TYPES.OPERATION,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "ACCOUNT REINSTATED!",
      message: reinstatedMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.closed_account,
      topic: TOPIC_TYPES.OPERATION,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "ACCOUNT CLOSED!",
      message: closedMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.brand_design_withdrew,
      topic: TOPIC_TYPES.OPERATION,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "Service member withdrew from TISC account!",
      message: withdrewMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.maintenance,
      topic: TOPIC_TYPES.OPERATION,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "Scheduled maintenance notice",
      message: maintenanceMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.invoice_receipt,
      topic: TOPIC_TYPES.OTHER,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "Invoice - Thank you for your support",
      message: invoiceSupportMessage,
      deleted_at: null,
      updated_at: null,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.invoice_reminder,
      topic: TOPIC_TYPES.OTHER,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "Invoice - Reminder",
      message: invoiceReminderMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.invoice_overdue,
      topic: TOPIC_TYPES.OTHER,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "Invoice - Overdue Payment Notice",
      message: invoiceOverdueMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.invoice_payment_success,
      topic: TOPIC_TYPES.MESSAGES,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "TISC - Payment successful, thank you!",
      message: invoicePaymentSuccessMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
    {
      id: EmailTemplateID.general.invoice_payment_received,
      topic: TOPIC_TYPES.MESSAGES,
      targeted_for: TARGETED_FOR_TYPES.GENERAL,
      title: "TISC - Payment received!",
      message: invoicePaymentReceivedMessage,
      deleted_at: null,
      updated_at: currentTime,
      created_at: currentTime,
    },
  ]);
};
