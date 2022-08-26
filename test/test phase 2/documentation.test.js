const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;

let documentId = "";
describe("Document API ", () => {
  beforeEach((done) => {
    done();
  });

  describe("Create", () => {
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/documentation/create`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          document: {
            document: "string",
            question_and_answer: [
              {
                question: "string",
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
        .post(`/documentation/create`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          title: "Document created",
          document: {
            document: "Document",
            question_and_answer: [
              {
                question: "Question",
                answer: "answer",
              },
            ],
          },
        })
        .end((_err, res) => {
          documentId = res.body.data.id;
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
            "number",
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

  describe("get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get(`/documentation/get-list`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .query({
          type: 1,
        })
        .end((_err, res) => {
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
            item.should.have.keys("id", "title", "updated_at", "author");
            item.author.should.have.keys("id", "firstname", "lastname");
          });
          done();
        });
    });
  });

  describe("Update", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .put(`/documentation/update/${documentId}-123`)
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
        .put(`/documentation/update/${documentId}`)
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
            "number",
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
        .put(`/documentation/update/${documentId}`)
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
        .put(`/documentation/update/${documentId}`)
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
            "number",
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
        .get(`/documentation/get-one/${documentId}-123`)
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
        .get(`/documentation/get-one/${documentId}`)
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
            "number",
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
  describe("Delete", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/documentation/delete/${documentId}-123`)
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
        .delete(`/documentation/delete/${documentId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message");
          done();
        });
    });
  });
});
