const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;

let howToId = "";
describe("How to API ", () => {
  beforeEach((done) => {
    done();
  });
  describe("get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get(`/documentation/get-list`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .query({
          //type 2, 3, 4
          type: 2,
        })
        .end((_err, res) => {
          howToId = res.body.data.documentations[0].id;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys("documentations", "pagination");
          res.body.data.pagination.should.have.keys(
            "page",
            "page_size",
            "total",
            "page_count"
          );

          res.body.data.documentations.map((item) => {
            item.should.have.keys(
              "id",
              "logo",
              "type",
              "title",
              "document",
              "created_at",
              "created_by",
              "updated_at"
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
        .put(`/documentation/update/${howToId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          title: "Document updated",
          document: {
            document: "Document",
            question_and_answer: [
              {
                question: "question ?",
                answer: "string",
              },
            ],
          },
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
        .put(`/documentation/update/${howToId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          title: "Document updated",
          document: {
            document: "Document",
            question_and_answer: [
              {
                question: "question ?",
                answer: "string",
              },
            ],
          },
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "logo",
            "type",
            "title",
            "document",
            "created_at",
            "created_by",
            "updated_at"
          );
          res.body.data.document.should.have.keys(
            "question_and_answer",
            "document"
          );
          res.body.data.document.question_and_answer.map((item) => {
            item.should.have.keys("question", "answer");
          });
          done();
        });
    });
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .put(`/documentation/update/${howToId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          document: {
            document: "Document",
            question_and_answer: [
              {
                question: "question ?",
                answer: "string",
              },
            ],
          },
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
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .put(`/documentation/update/${howToId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          title: "Document updated",
          document: {
            document: "Document",
            question_and_answer: [
              {
                question: "question ?",
                answer: "string",
              },
            ],
          },
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "logo",
            "type",
            "title",
            "document",
            "created_at",
            "created_by",
            "updated_at"
          );
          res.body.data.document.should.have.keys(
            "question_and_answer",
            "document"
          );
          res.body.data.document.question_and_answer.map((item) => {
            item.should.have.keys("question", "answer");
          });
          done();
        });
    });
  });
  describe("Get one", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/documentation/get-one/${howToId}-123`)
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
        .get(`/documentation/get-one/${howToId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "logo",
            "type",
            "title",
            "document",
            "created_at",
            "created_by",
            "updated_at"
          );
          res.body.data.document.should.have.keys(
            "question_and_answer",
            "document"
          );
          res.body.data.document.question_and_answer.map((item) => {
            item.should.have.keys("question", "answer");
          });
          done();
        });
    });
  });
});
