const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;

let autoEmailId = "";
describe("Auto Email API ", () => {
  beforeEach((done) => {
    done();
  });
  describe("Get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/email-auto/get-list")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          autoEmailId = res.body.data.auto_emails[0].id;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.auto_emails.should.be.an("array");
          res.body.data.auto_emails.map((item) => {
            item.should.have.keys(
              "id",
              "topic",
              "topic_key",
              "targeted_for",
              "targeted_for_key",
              "title",
              "message",
              "created_at"
            );
          });

          done();
        });
    });
  });
  describe("Update", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .put(`/email-auto/update/${autoEmailId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          topic: 2,
          targeted_for: 5,
          title: "Welcome to the team! unit test updated",
          message:
            "\n" +
            "        <!DOCTYPE html>\n" +
            '        <html lang="en" dir="ltr">\n' +
            "        \n" +
            "        <head>\n" +
            '            <meta charset="utf-8" />\n' +
            "            <title>Tisc</title>\n" +
            '            <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
            '            <style media="screen"></style>\n' +
            '            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />\n' +
            "            <style>\n" +
            "                body {\n" +
            '                    font-family: "Inter";\n' +
            "                }\n" +
            "        \n" +
            "                .pl-5 {\n" +
            "                    padding-left: 5px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-10 {\n" +
            "                    padding-bottom: 10px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-15 {\n" +
            "                    padding-bottom: 15px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-20 {\n" +
            "                    padding-bottom: 20px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-30 {\n" +
            "                    padding-bottom: 30px;\n" +
            "                }\n" +
            "        \n" +
            "                .text-bold {\n" +
            "                    font-weight: bold;\n" +
            "                }\n" +
            "        \n" +
            "                .text-bold-black {\n" +
            "                    font-weight: bold;\n" +
            "                    color: #1f2329;\n" +
            "                }\n" +
            "        \n" +
            "                .wrapper .content-email p,\n" +
            "                li {\n" +
            "                    color: #1f2329\n" +
            "                }\n" +
            "        \n" +
            "                .button-account-password {\n" +
            "                    background-color: #fff;\n" +
            "                    border: 2px solid #e6e6e6;\n" +
            "                    color: #33363c !important;\n" +
            "                    padding: 15px 15px;\n" +
            "                    text-align: center;\n" +
            "                    text-decoration: none;\n" +
            "                    display: inline-block;\n" +
            "                    font-size: 15px;\n" +
            "                    margin: 4px 2px;\n" +
            "                    cursor: pointer;\n" +
            "                    font-weight: bold;\n" +
            "                }\n" +
            "        \n" +
            "                .non-bullet {\n" +
            "                    list-style: none;\n" +
            "                }\n" +
            "        \n" +
            "                .text-blue-light {\n" +
            "                    color: #4f84ff !important;\n" +
            "                }\n" +
            "        \n" +
            "                .non-padding {\n" +
            "                    padding: 0;\n" +
            "                }\n" +
            "        \n" +
            "                .text-italic {\n" +
            "                    font-style: italic;\n" +
            "                }\n" +
            "        \n" +
            "                .content-email {\n" +
            "                    padding: 40px 40px;\n" +
            "                }\n" +
            "        \n" +
            "                .hr {\n" +
            "                    border: 1px solid #bbbfc4;\n" +
            "                }\n" +
            "        \n" +
            "                li::before {\n" +
            '                    content: ".";\n' +
            "                    color: #3370ff\n" +
            "                }\n" +
            "        \n" +
            "                .list-session-include {\n" +
            "                    padding-left: 10px;\n" +
            "                }\n" +
            "        \n" +
            "                .text-non-decoration {\n" +
            "                    text-decoration: none;\n" +
            "                }\n" +
            "            </style>\n" +
            "        </head>\n" +
            "        \n" +
            "        <body>\n" +
            '            <div class="wrapper">\n' +
            '                <div class="content-email">\n' +
            '                    <div class="title-email">\n' +
            "                        <h1>Welcome to the team!</h1>\n" +
            "                    </div>\n" +
            '                    <div class="message-email">\n' +
            "                        <p>Hi <%= firstname %>,</p>\n" +
            '                        <p style="line-height: 2;" class="pb-15"><span class="text-blue-light">{(sender firstname)}</span> has\n' +
            "                            invited you to join the TISC, a platform and tools dedicated to\n" +
            "                            improving operation and increasing productivity for the design and construction industry.</p>\n" +
            "        \n" +
            '                        <p class="text-bold-black">Your account name: <%= email %></p>\n' +
            '                        <p class="pb-15">Activate your account below.</p>\n' +
            '                        <div class="button pb-30">\n' +
            '                            <a href="#" class="button-account-password">Set Password</a>\n' +
            "                        </div>\n" +
            '                        <p class="pb-20">The <span class="text-italic">How-To</span> section at the top right corner will guide\n' +
            "                            you through\n" +
            "                            the features and\n" +
            "                            functions of\n" +
            "                            the platform. The information will update over time. Of course, you could always refer to\n" +
            '                            <span class="text-blue-light">Contact Support</span> if you have further questions.</p>\n' +
            "                        <p>TISC Team</p>\n" +
            '                        <p class="text-blue-light pb-15">tisc.global</p>\n' +
            '                        <div class="pb-15">\n' +
            '                            <div class="hr">\n' +
            "                            </div>\n" +
            "                        </div>\n" +
            "                        <p>If you're having trouble with the button, copy and paste the URL below into your web browser.\n" +
            "                        </p>\n" +
            '                        <a class="text-blue-light" href=" #"><%= url %>></a>\n' +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </body>\n" +
            "        \n" +
            "        </html>\n" +
            "        ",
          created_at: "2022-07-11T04:30:37.247Z",
        })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .put(`/email-auto/update/${autoEmailId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          topic: 2,
          targeted_for: 5,
          title: "Welcome to the team! unit test updated",
          message:
            "\n" +
            "        <!DOCTYPE html>\n" +
            '        <html lang="en" dir="ltr">\n' +
            "        \n" +
            "        <head>\n" +
            '            <meta charset="utf-8" />\n' +
            "            <title>Tisc</title>\n" +
            '            <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
            '            <style media="screen"></style>\n' +
            '            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />\n' +
            "            <style>\n" +
            "                body {\n" +
            '                    font-family: "Inter";\n' +
            "                }\n" +
            "        \n" +
            "                .pl-5 {\n" +
            "                    padding-left: 5px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-10 {\n" +
            "                    padding-bottom: 10px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-15 {\n" +
            "                    padding-bottom: 15px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-20 {\n" +
            "                    padding-bottom: 20px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-30 {\n" +
            "                    padding-bottom: 30px;\n" +
            "                }\n" +
            "        \n" +
            "                .text-bold {\n" +
            "                    font-weight: bold;\n" +
            "                }\n" +
            "        \n" +
            "                .text-bold-black {\n" +
            "                    font-weight: bold;\n" +
            "                    color: #1f2329;\n" +
            "                }\n" +
            "        \n" +
            "                .wrapper .content-email p,\n" +
            "                li {\n" +
            "                    color: #1f2329\n" +
            "                }\n" +
            "        \n" +
            "                .button-account-password {\n" +
            "                    background-color: #fff;\n" +
            "                    border: 2px solid #e6e6e6;\n" +
            "                    color: #33363c !important;\n" +
            "                    padding: 15px 15px;\n" +
            "                    text-align: center;\n" +
            "                    text-decoration: none;\n" +
            "                    display: inline-block;\n" +
            "                    font-size: 15px;\n" +
            "                    margin: 4px 2px;\n" +
            "                    cursor: pointer;\n" +
            "                    font-weight: bold;\n" +
            "                }\n" +
            "        \n" +
            "                .non-bullet {\n" +
            "                    list-style: none;\n" +
            "                }\n" +
            "        \n" +
            "                .text-blue-light {\n" +
            "                    color: #4f84ff !important;\n" +
            "                }\n" +
            "        \n" +
            "                .non-padding {\n" +
            "                    padding: 0;\n" +
            "                }\n" +
            "        \n" +
            "                .text-italic {\n" +
            "                    font-style: italic;\n" +
            "                }\n" +
            "        \n" +
            "                .content-email {\n" +
            "                    padding: 40px 40px;\n" +
            "                }\n" +
            "        \n" +
            "                .hr {\n" +
            "                    border: 1px solid #bbbfc4;\n" +
            "                }\n" +
            "        \n" +
            "                li::before {\n" +
            '                    content: ".";\n' +
            "                    color: #3370ff\n" +
            "                }\n" +
            "        \n" +
            "                .list-session-include {\n" +
            "                    padding-left: 10px;\n" +
            "                }\n" +
            "        \n" +
            "                .text-non-decoration {\n" +
            "                    text-decoration: none;\n" +
            "                }\n" +
            "            </style>\n" +
            "        </head>\n" +
            "        \n" +
            "        <body>\n" +
            '            <div class="wrapper">\n' +
            '                <div class="content-email">\n' +
            '                    <div class="title-email">\n' +
            "                        <h1>Welcome to the team!</h1>\n" +
            "                    </div>\n" +
            '                    <div class="message-email">\n' +
            "                        <p>Hi <%= firstname %>,</p>\n" +
            '                        <p style="line-height: 2;" class="pb-15"><span class="text-blue-light">{(sender firstname)}</span> has\n' +
            "                            invited you to join the TISC, a platform and tools dedicated to\n" +
            "                            improving operation and increasing productivity for the design and construction industry.</p>\n" +
            "        \n" +
            '                        <p class="text-bold-black">Your account name: <%= email %></p>\n' +
            '                        <p class="pb-15">Activate your account below.</p>\n' +
            '                        <div class="button pb-30">\n' +
            '                            <a href="#" class="button-account-password">Set Password</a>\n' +
            "                        </div>\n" +
            '                        <p class="pb-20">The <span class="text-italic">How-To</span> section at the top right corner will guide\n' +
            "                            you through\n" +
            "                            the features and\n" +
            "                            functions of\n" +
            "                            the platform. The information will update over time. Of course, you could always refer to\n" +
            '                            <span class="text-blue-light">Contact Support</span> if you have further questions.</p>\n' +
            "                        <p>TISC Team</p>\n" +
            '                        <p class="text-blue-light pb-15">tisc.global</p>\n' +
            '                        <div class="pb-15">\n' +
            '                            <div class="hr">\n' +
            "                            </div>\n" +
            "                        </div>\n" +
            "                        <p>If you're having trouble with the button, copy and paste the URL below into your web browser.\n" +
            "                        </p>\n" +
            '                        <a class="text-blue-light" href=" #"><%= url %>></a>\n' +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </body>\n" +
            "        \n" +
            "        </html>\n" +
            "        ",
          created_at: "2022-07-11T04:30:37.247Z",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "topic",
            "targeted_for",
            "title",
            "message",
            "created_at"
          );

          done();
        });
    });
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .put(`/email-auto/update/${autoEmailId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          targeted_for: 5,
          title: "Welcome to the team! unit test updated",
          message:
            "\n" +
            "        <!DOCTYPE html>\n" +
            '        <html lang="en" dir="ltr">\n' +
            "        \n" +
            "        <head>\n" +
            '            <meta charset="utf-8" />\n' +
            "            <title>Tisc</title>\n" +
            '            <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
            '            <style media="screen"></style>\n' +
            '            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />\n' +
            "            <style>\n" +
            "                body {\n" +
            '                    font-family: "Inter";\n' +
            "                }\n" +
            "        \n" +
            "                .pl-5 {\n" +
            "                    padding-left: 5px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-10 {\n" +
            "                    padding-bottom: 10px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-15 {\n" +
            "                    padding-bottom: 15px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-20 {\n" +
            "                    padding-bottom: 20px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-30 {\n" +
            "                    padding-bottom: 30px;\n" +
            "                }\n" +
            "        \n" +
            "                .text-bold {\n" +
            "                    font-weight: bold;\n" +
            "                }\n" +
            "        \n" +
            "                .text-bold-black {\n" +
            "                    font-weight: bold;\n" +
            "                    color: #1f2329;\n" +
            "                }\n" +
            "        \n" +
            "                .wrapper .content-email p,\n" +
            "                li {\n" +
            "                    color: #1f2329\n" +
            "                }\n" +
            "        \n" +
            "                .button-account-password {\n" +
            "                    background-color: #fff;\n" +
            "                    border: 2px solid #e6e6e6;\n" +
            "                    color: #33363c !important;\n" +
            "                    padding: 15px 15px;\n" +
            "                    text-align: center;\n" +
            "                    text-decoration: none;\n" +
            "                    display: inline-block;\n" +
            "                    font-size: 15px;\n" +
            "                    margin: 4px 2px;\n" +
            "                    cursor: pointer;\n" +
            "                    font-weight: bold;\n" +
            "                }\n" +
            "        \n" +
            "                .non-bullet {\n" +
            "                    list-style: none;\n" +
            "                }\n" +
            "        \n" +
            "                .text-blue-light {\n" +
            "                    color: #4f84ff !important;\n" +
            "                }\n" +
            "        \n" +
            "                .non-padding {\n" +
            "                    padding: 0;\n" +
            "                }\n" +
            "        \n" +
            "                .text-italic {\n" +
            "                    font-style: italic;\n" +
            "                }\n" +
            "        \n" +
            "                .content-email {\n" +
            "                    padding: 40px 40px;\n" +
            "                }\n" +
            "        \n" +
            "                .hr {\n" +
            "                    border: 1px solid #bbbfc4;\n" +
            "                }\n" +
            "        \n" +
            "                li::before {\n" +
            '                    content: ".";\n' +
            "                    color: #3370ff\n" +
            "                }\n" +
            "        \n" +
            "                .list-session-include {\n" +
            "                    padding-left: 10px;\n" +
            "                }\n" +
            "        \n" +
            "                .text-non-decoration {\n" +
            "                    text-decoration: none;\n" +
            "                }\n" +
            "            </style>\n" +
            "        </head>\n" +
            "        \n" +
            "        <body>\n" +
            '            <div class="wrapper">\n' +
            '                <div class="content-email">\n' +
            '                    <div class="title-email">\n' +
            "                        <h1>Welcome to the team!</h1>\n" +
            "                    </div>\n" +
            '                    <div class="message-email">\n' +
            "                        <p>Hi <%= firstname %>,</p>\n" +
            '                        <p style="line-height: 2;" class="pb-15"><span class="text-blue-light">{(sender firstname)}</span> has\n' +
            "                            invited you to join the TISC, a platform and tools dedicated to\n" +
            "                            improving operation and increasing productivity for the design and construction industry.</p>\n" +
            "        \n" +
            '                        <p class="text-bold-black">Your account name: <%= email %></p>\n' +
            '                        <p class="pb-15">Activate your account below.</p>\n' +
            '                        <div class="button pb-30">\n' +
            '                            <a href="#" class="button-account-password">Set Password</a>\n' +
            "                        </div>\n" +
            '                        <p class="pb-20">The <span class="text-italic">How-To</span> section at the top right corner will guide\n' +
            "                            you through\n" +
            "                            the features and\n" +
            "                            functions of\n" +
            "                            the platform. The information will update over time. Of course, you could always refer to\n" +
            '                            <span class="text-blue-light">Contact Support</span> if you have further questions.</p>\n' +
            "                        <p>TISC Team</p>\n" +
            '                        <p class="text-blue-light pb-15">tisc.global</p>\n' +
            '                        <div class="pb-15">\n' +
            '                            <div class="hr">\n' +
            "                            </div>\n" +
            "                        </div>\n" +
            "                        <p>If you're having trouble with the button, copy and paste the URL below into your web browser.\n" +
            "                        </p>\n" +
            '                        <a class="text-blue-light" href=" #"><%= url %>></a>\n' +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </body>\n" +
            "        \n" +
            "        </html>\n" +
            "        ",
          created_at: "2022-07-11T04:30:37.247Z",
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("error");
          res.body.should.have.property("message");

          done();
        });
    });
    it("correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .put(`/email-auto/update/${autoEmailId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          topic: 2,
          targeted_for: 5,
          title: "Welcome to the team! unit test updated",
          message:
            "\n" +
            "        <!DOCTYPE html>\n" +
            '        <html lang="en" dir="ltr">\n' +
            "        \n" +
            "        <head>\n" +
            '            <meta charset="utf-8" />\n' +
            "            <title>Tisc</title>\n" +
            '            <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n' +
            '            <style media="screen"></style>\n' +
            '            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter" />\n' +
            "            <style>\n" +
            "                body {\n" +
            '                    font-family: "Inter";\n' +
            "                }\n" +
            "        \n" +
            "                .pl-5 {\n" +
            "                    padding-left: 5px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-10 {\n" +
            "                    padding-bottom: 10px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-15 {\n" +
            "                    padding-bottom: 15px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-20 {\n" +
            "                    padding-bottom: 20px;\n" +
            "                }\n" +
            "        \n" +
            "                .pb-30 {\n" +
            "                    padding-bottom: 30px;\n" +
            "                }\n" +
            "        \n" +
            "                .text-bold {\n" +
            "                    font-weight: bold;\n" +
            "                }\n" +
            "        \n" +
            "                .text-bold-black {\n" +
            "                    font-weight: bold;\n" +
            "                    color: #1f2329;\n" +
            "                }\n" +
            "        \n" +
            "                .wrapper .content-email p,\n" +
            "                li {\n" +
            "                    color: #1f2329\n" +
            "                }\n" +
            "        \n" +
            "                .button-account-password {\n" +
            "                    background-color: #fff;\n" +
            "                    border: 2px solid #e6e6e6;\n" +
            "                    color: #33363c !important;\n" +
            "                    padding: 15px 15px;\n" +
            "                    text-align: center;\n" +
            "                    text-decoration: none;\n" +
            "                    display: inline-block;\n" +
            "                    font-size: 15px;\n" +
            "                    margin: 4px 2px;\n" +
            "                    cursor: pointer;\n" +
            "                    font-weight: bold;\n" +
            "                }\n" +
            "        \n" +
            "                .non-bullet {\n" +
            "                    list-style: none;\n" +
            "                }\n" +
            "        \n" +
            "                .text-blue-light {\n" +
            "                    color: #4f84ff !important;\n" +
            "                }\n" +
            "        \n" +
            "                .non-padding {\n" +
            "                    padding: 0;\n" +
            "                }\n" +
            "        \n" +
            "                .text-italic {\n" +
            "                    font-style: italic;\n" +
            "                }\n" +
            "        \n" +
            "                .content-email {\n" +
            "                    padding: 40px 40px;\n" +
            "                }\n" +
            "        \n" +
            "                .hr {\n" +
            "                    border: 1px solid #bbbfc4;\n" +
            "                }\n" +
            "        \n" +
            "                li::before {\n" +
            '                    content: ".";\n' +
            "                    color: #3370ff\n" +
            "                }\n" +
            "        \n" +
            "                .list-session-include {\n" +
            "                    padding-left: 10px;\n" +
            "                }\n" +
            "        \n" +
            "                .text-non-decoration {\n" +
            "                    text-decoration: none;\n" +
            "                }\n" +
            "            </style>\n" +
            "        </head>\n" +
            "        \n" +
            "        <body>\n" +
            '            <div class="wrapper">\n' +
            '                <div class="content-email">\n' +
            '                    <div class="title-email">\n' +
            "                        <h1>Welcome to the team!</h1>\n" +
            "                    </div>\n" +
            '                    <div class="message-email">\n' +
            "                        <p>Hi <%= firstname %>,</p>\n" +
            '                        <p style="line-height: 2;" class="pb-15"><span class="text-blue-light">{(sender firstname)}</span> has\n' +
            "                            invited you to join the TISC, a platform and tools dedicated to\n" +
            "                            improving operation and increasing productivity for the design and construction industry.</p>\n" +
            "        \n" +
            '                        <p class="text-bold-black">Your account name: <%= email %></p>\n' +
            '                        <p class="pb-15">Activate your account below.</p>\n' +
            '                        <div class="button pb-30">\n' +
            '                            <a href="#" class="button-account-password">Set Password</a>\n' +
            "                        </div>\n" +
            '                        <p class="pb-20">The <span class="text-italic">How-To</span> section at the top right corner will guide\n' +
            "                            you through\n" +
            "                            the features and\n" +
            "                            functions of\n" +
            "                            the platform. The information will update over time. Of course, you could always refer to\n" +
            '                            <span class="text-blue-light">Contact Support</span> if you have further questions.</p>\n' +
            "                        <p>TISC Team</p>\n" +
            '                        <p class="text-blue-light pb-15">tisc.global</p>\n' +
            '                        <div class="pb-15">\n' +
            '                            <div class="hr">\n' +
            "                            </div>\n" +
            "                        </div>\n" +
            "                        <p>If you're having trouble with the button, copy and paste the URL below into your web browser.\n" +
            "                        </p>\n" +
            '                        <a class="text-blue-light" href=" #"><%= url %>></a>\n' +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </body>\n" +
            "        \n" +
            "        </html>\n" +
            "        ",
          created_at: "2022-07-11T04:30:37.247Z",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "topic",
            "targeted_for",
            "title",
            "message",
            "created_at"
          );

          done();
        });
    });
  });
  describe("Get one", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/email-auto/get-one/${autoEmailId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/email-auto/get-one/${autoEmailId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "topic",
            "targeted_for",
            "title",
            "message",
            "created_at"
          );
          done();
        });
    });
  });

  describe("Get list targeted for", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/email-auto/get-list-targeted-for")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an("array");
          res.body.map((item) => {
            item.should.have.keys("key", "value");
          });

          done();
        });
    });
  });
  describe("Get list topic", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/email-auto/get-list-topic")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.an("array");
          res.body.map((item) => {
            item.should.have.keys("key", "value");
          });

          done();
        });
    });
  });
});
