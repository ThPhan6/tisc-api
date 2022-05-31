const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
describe("Contact API", () => {
  beforeEach((done) => {
    done();
  });
  describe("Create", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .post("/contact/create")
        .send({
          name: "Quang Tien",
          email: "quangtien@gmail.com",
          inquiry: "how to use?",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.property("name");
          res.body.data.should.have.property("email");
          res.body.data.should.have.property("inquiry");
          res.body.data.should.have.property("id");
          res.body.data.should.have.property("created_at");
          done();
        });
    });
    it("Miss field name", (done) => {
      chai
        .request(HOST_URL)
        .post("/contact/create")
        .send({
          email: "quangtien@gmail.com",
          inquiry: "how to use?",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          res.body.should.have.property("validation");
          res.body.validation.should.have.property("source");
          res.body.validation.should.have.property("keys");
          done();
        });
    });
    it("Miss field email", (done) => {
      chai
        .request(HOST_URL)
        .post("/contact/create")
        .send({
          name: "Quang Tien",
          inquiry: "how to use?",
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          res.body.should.have.property("validation");
          res.body.validation.should.have.property("source");
          res.body.validation.should.have.property("keys");
          done();
        });
    });
    it("Miss field inquiry", (done) => {
      chai
        .request(HOST_URL)
        .post("/contact/create")
        .send({
          name: "Quang Tien",
          email: "quangtien@gmail.com",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.property("name");
          res.body.data.should.have.property("email");
          res.body.data.should.have.property("inquiry");
          res.body.data.should.have.property("id");
          res.body.data.should.have.property("created_at");
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .post("/contact/create/abnc")
        .send({
          name: "Quang Tien",
          email: "quangtien@gmail.com",
          inquiry: "how to use?",
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("Get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/contact/list")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("data");
          res.body.data.forEach((element) => {
            element.should.be.a("object");
            element.should.have.property("name");
            element.should.have.property("email");
            element.should.have.property("inquiry");
            element.should.have.property("id");
            element.should.have.property("created_at");
          });
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/contact/list/abnc")
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("Get by ID", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/contact/get-one/2a3db1fd-5414-4635-adb0-2c6c3c9c5f74")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.property("name");
          res.body.data.should.have.property("email");
          res.body.data.should.have.property("inquiry");
          res.body.data.should.have.property("id");
          res.body.data.should.have.property("created_at");
          done();
        });
    });
    it("Not found ID", (done) => {
      chai
        .request(HOST_URL)
        .get("/contact/get-one/2a3db1fd-5414-4635-adb0-2c6c3c9c5f7123124")
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/contact/list/abnc")
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
  });
});
