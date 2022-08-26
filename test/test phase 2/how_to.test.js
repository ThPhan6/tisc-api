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
        .get(`/documentation/howto/get-all`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          howToId = res.body.data.tisc[0].id;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys("tisc", "brand", "design");
          done();
        });
    });
  });

  describe("Update", () => {
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .put(`/documentation/howto/update`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          data: [
            {
              id: howToId,
              title: "string",
              document: {
                document: "string",
                question_and_answer: [
                  {
                    question: "string",
                    answer: "string",
                  },
                ],
              },
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          done();
        });
    });
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .put(`/documentation/howto/update`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          data: [
            {
              id: howToId + "123",
              title: "string",
              document: {
                document: "string",
                question_and_answer: [
                  {
                    question: "string",
                    answer: "string",
                  },
                ],
              },
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
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
