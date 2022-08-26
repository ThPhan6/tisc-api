const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
let id = "";
describe("Authentication API", () => {
  beforeEach((done) => {
    done();
  });
  describe("Register", () => {
    it("Missing field require", (done) => {
      chai
        .request(HOST_URL)
        .post("/auth/register")
        .send({
          company_name: "string",
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .post("/auth/register/asd")
        .send({
          email: "unit-test@yopmail.com",
          firstname: "Unit",
          lastname: "Test",
          company_name: "ES",
          password: "ES@123123",
        })
        .end((_err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .post("/auth/register")
        .send({
          email: "unit-test-123@yopmail.com",
          firstname: "Unit",
          lastname: "Test",
          company_name: "ES",
          password: "ES@123123",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Email is already used", (done) => {
      chai
        .request(HOST_URL)
        .post("/auth/register")
        .send({
          email: "unit-test@yopmail.com",
          firstname: "Unit",
          lastname: "Test",
          company_name: "ES",
          password: "ES@123123",
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("Login", () => {
    it("Missing field require", (done) => {
      chai
        .request(HOST_URL)
        .post("/auth/login")
        .send({})
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .post("/auth/login/asd")
        .send({ email: "unit-test@yopmail.com", password: "ES@123123" })
        .end((_err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
    it("Not verify", (done) => {
      chai
        .request(HOST_URL)
        .post("/auth/login")
        .send({ email: "unit-test@yopmail.com", password: "ES@123123" })
        .end((_err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message");
          done();
        });
    });

    // it("Success", (done) => {
    //   chai
    //     .request(HOST_URL)
    //     .post("/auth/login")
    //     .send({ email: "unit-test@yopmail.com", password: "ES@123123" })
    //     .end((_err, res) => {
    //       res.should.have.status(200);
    //       res.body.should.have.property("statusCode", 200);
    //       res.body.should.have.property("message");
    //       done();
    //     });
    // });
  });
});
