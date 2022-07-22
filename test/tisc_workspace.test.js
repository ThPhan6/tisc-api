const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;
describe("Tisc workspace API ", () => {
  beforeEach((done) => {
    done();
  });
  describe("Get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/get-list-card")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.map((item) => {
            item.should.have.keys(
              "id",
              "name",
              "logo",
              "country",
              "category_count",
              "collection_count",
              "card_count",
              "teams"
            );
          });
          done();
        });
    });
  });
});
