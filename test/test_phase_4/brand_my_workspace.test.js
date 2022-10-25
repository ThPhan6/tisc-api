const {
  chaiResponse,
  chai,
  chaiHttp,
  should,
  HOST_URL,
  Database,
  db,
  brandToken,
} = require("./utils/utils");
const helperCommon = require("./helper/common");

describe("Brand My Workspace", () => {
  describe("Get list", () => {
    it("Get list with parameter ", (done) => {
      chai
        .request(HOST_URL)
        .get("/project-tracking/get-list")
        .set({ Authorization: `Bearer ${brandToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
    it("Get list without parameter ", (done) => {
      chai
        .request(HOST_URL)
        .get("/project-tracking/get-list")
        .set({ Authorization: `Bearer ${brandToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });
  describe("Get list summary", () => {
    it("Get summary", (done) => {
      chai
        .request(HOST_URL)
        .get("/project-tracking/summary")
        .set({ Authorization: `Bearer ${brandToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });
});
