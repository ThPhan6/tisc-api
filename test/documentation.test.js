const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
describe("Documentation API", () => {
  beforeEach((done) => {
    done();
  });
  describe("create", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .post("/documentation/create")
        .send({ title: "Privacy Policy test 1", document: "tien nguyen" })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.property("id");
          res.body.data.should.have.property("logo");
          res.body.data.should.have.property("type");
          res.body.data.should.have.property("title");
          res.body.data.should.have.property("document");
          res.body.data.should.have.property("created_at");
          res.body.data.should.have.property("created_by");
          res.body.data.should.have.property("updated_at");
          done();
        });
    });
    it("Miss field title", (done) => {
      chai
        .request(HOST_URL)
        .post("/documentation/create")
        .send({ document: "tien nguyen" })
        .end((_err, res) => {
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
    it("Miss field document", (done) => {
      chai
        .request(HOST_URL)
        .post("/documentation/create")
        .send({ title: "Privacy Policy test 1" })
        .end((_err, res) => {
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
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .post("/documentation/create/abc")
        .send({ title: "Privacy Policy test 1", document: "tien nguyen" })
        .end((_err, res) => {
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
  describe("get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/documentation/get-list")
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.forEach((element) => {
            element.should.be.a("object");
            element.should.have.property("id");
            element.should.have.property("created_at");
            element.should.have.property("created_by");
            element.should.have.property("document");
            element.should.have.property("logo");
            element.should.have.property("title");
            element.should.have.property("type");
            element.should.have.property("updated_at");
          });
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/documentation/get-list/abc")
        .end((_err, res) => {
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
  describe("get by id", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/documentation/get-one/6a84d381-c4c0-48e0-b95d-b9af024fba4e")
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.be.a("object");
          res.body.data.should.have.property("id");
          res.body.data.should.have.property("created_at");
          res.body.data.should.have.property("created_by");
          res.body.data.should.have.property("document");
          res.body.data.should.have.property("logo");
          res.body.data.should.have.property("title");
          res.body.data.should.have.property("type");
          res.body.data.should.have.property("updated_at");
          done();
        });
    });
    it("Not found ID", (done) => {
      chai
        .request(HOST_URL)
        .get("/documentation/get-one/6a84d381-c4c0-48e0-b95d-b9af024fba4e123")
        .end((_err, res) => {
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
        .get("/documentation/get-list/abc")
        .end((_err, res) => {
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
  describe("Update", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .put("/documentation/update/6a84d381-c4c0-48e0-b95d-b9af024fba4e")
        .send({ title: "Privacy Policy test 1", document: "tien nguyen" })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.be.a("object");
          res.body.data.should.have.property("id");
          res.body.data.should.have.property("created_at");
          res.body.data.should.have.property("created_by");
          res.body.data.should.have.property("document");
          res.body.data.should.have.property("logo");
          res.body.data.should.have.property("title");
          res.body.data.should.have.property("type");
          res.body.data.should.have.property("updated_at");
          done();
        });
    });
    it("Not found ID", (done) => {
      chai
        .request(HOST_URL)
        .put("/documentation/get-one/6a84d381-c4c0-48e0-b95d-b9af024fba4e123")
        .send({ title: "Privacy Policy test 1", document: "tien nguyen" })
        .end((_err, res) => {
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
        .put("/documentation/update/abc/123123")
        .send({ title: "Privacy Policy test 1", document: "tien nguyen" })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
    it("Miss field title", (done) => {
      chai
        .request(HOST_URL)
        .put("/documentation/update/6a84d381-c4c0-48e0-b95d-b9af024fba4e")
        .send({ document: "tien nguyen" })
        .end((_err, res) => {
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
    it("Miss field document", (done) => {
      chai
        .request(HOST_URL)
        .put("/documentation/update/6a84d381-c4c0-48e0-b95d-b9af024fba4e")
        .send({ title: "Privacy Policy test 1" })
        .end((_err, res) => {
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
  });
  describe("delete", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .delete("/documentation/delete/6a84d381-c4c0-48e0-b95d-b9af024fba4e")
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Not found ID", (done) => {
      chai
        .request(HOST_URL)
        .delete("/documentation/delete/6a84d381-c4c0-48e0-b95d-b9af024fba4e123")
        .end((_err, res) => {
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
        .delete("/documentation/delete/abc/123123")
        .send({ title: "Privacy Policy test 1", document: "tien nguyen" })
        .end((_err, res) => {
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
