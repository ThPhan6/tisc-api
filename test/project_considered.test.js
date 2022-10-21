const {
  chaiResponse,
  chai,
  chaiHttp,
  should,
  HOST_URL,
  Database,
  db,
  designToken,
} = require("./utils/utils");
const helperCommon = require("./helper/common");

describe("Project Considered", () => {
  let project;
  beforeEach((done) => {
    helperCommon.getProject().then((data) => {
      project = data;
      done();
    });
  });

  describe("Get list project considered", () => {
    it("Incorrect project id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/${project.id}-123/considered-product/get-list`)
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Incorrect project id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/${project.id}/considered-product/get-list`)
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
    it("Get list with parameter ", (done) => {
      chai
        .request(HOST_URL)
        .get(
          `/project/${project.id}/considered-product/get-list?page=1&pageSize=10`
        )
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
    it("Get list without parameter ", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/${project.id}/considered-product/get-list`)
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });
});
