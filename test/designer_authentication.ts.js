const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;

let email = "unit-test-phase3@yopmail.com";
let password = "Unittest@123";
describe("Design authentication", () => {
  beforeEach((done) => {
    done();
  });
  describe("Sign up", () => {
    it("Design sign up account", (done) => {
      chai
        .request(HOST_URL)
        .post("/auth/register")
        .send({
          email: email,
          firstname: "Unit test",
          company_name: "ES",
          password: password,
          confirmed_password: password,
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("Login", () => {
    it("Login with account sign up", (done) => {
      chai
        .request(HOST_URL)
        .post("/auth/brand-design/login")
        .send({
          email: email,
          password: password,
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message");
          res.body.should.have.property("type");
          res.body.should.have.property("token");
          done();
        });
    });
    it("Login with wrong password", (done) => {
      chai
        .request(HOST_URL)
        .post("/auth/brand-design/login")
        .send({
          email: email,
          password: password + "wrong",
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("Reset password", () => {
    it("Design forgot password with correct work email", (done) => {
      chai
        .request(HOST_URL)
        .post("/auth/forgot-password")
        .send({
          email: email,
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Design forgot password with incorrect work email", (done) => {
      chai
        .request(HOST_URL)
        .post("/auth/forgot-password")
        .send({
          email: email + "wrong",
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("message");
          done();
        });
    });
  });
});
