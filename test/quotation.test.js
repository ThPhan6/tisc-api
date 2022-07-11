const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;

let quotationId = "";
describe("Quotation API ", () => {
  beforeEach((done) => {
    done();
  });
  describe("Create", () => {
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post("/quotation/create")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          identity: "ES",
          quotation: "Unit test",
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("error", "Bad Request");
          res.body.should.have.property("message", "Author is required");

          done();
        });
    });
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post("/quotation/create")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          author: "1110813b-8422-4e94-8d2a-8fdef644480e",
          identity: "ES",
          quotation: "Unit test",
        })
        .end((_err, res) => {
          quotationId = res.body.data.id;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "author",
            "identity",
            "quotation",
            "created_at"
          );
          done();
        });
    });
  });
  describe("Get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/quotation/get-list")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.be.an("array");
          res.body.data.map((item) => {
            item.should.have.keys(
              "id",
              "author",
              "identity",
              "quotation",
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
        .put(`/quotation/update/${quotationId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          author: "1110813b-8422-4e94-8d2a-8fdef644480e",
          identity: "ES",
          quotation: "Unit test",
        })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property(
            "message",
            "Inspirational quotation not found"
          );
          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .put(`/quotation/update/${quotationId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          author: "1110813b-8422-4e94-8d2a-8fdef644480e",
          identity: "ES",
          quotation: "Unit test updated",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "author",
            "identity",
            "quotation",
            "created_at"
          );
          done();
        });
    });
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .put(`/quotation/update/${quotationId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          identity: "ES",
          quotation: "Unit test",
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("message", "Author is required");
          res.body.should.have.property("error", "Bad Request");
          done();
        });
    });
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .put(`/quotation/update/${quotationId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          author: "1110813b-8422-4e94-8d2a-8fdef644480e",
          identity: "ES",
          quotation: "Unit test updated",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "author",
            "identity",
            "quotation",
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
        .get(`/quotation/get-one/${quotationId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property(
            "message",
            "Inspirational quotation not found"
          );
          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/quotation/get-one/${quotationId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "author",
            "identity",
            "quotation",
            "created_at"
          );
          done();
        });
    });
  });
  describe("Delete ", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/quotation/delete/${quotationId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property(
            "message",
            "Inspirational quotation not found"
          );
          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/quotation/delete/${quotationId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message", "Success.");

          done();
        });
    });
  });
});
