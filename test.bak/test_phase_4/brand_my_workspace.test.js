const {
  chaiResponse,
  chai,
  chaiHttp,
  should,
  HOST_URL,
  Database,
  db,
  brandToken,
  insertTempData,
  removeByKeys,
  signJwtToken,
} = require("./utils/utils");
const {brand, userBrand, brandLocation} = require("./temp-data/brand.js");


describe("Brand My Workspace", () => {
  let brandToken;
  let brandData;
  let brandLocation;
  let userData;

  before((done) => {
    insertTempData('brands', brand).then((res) => {
      brandData = res.new;
      insertTempData('locations', brandLocation).then((res) => {
        brandLocation = res.new
        insertTempData('users', userBrand).then((res) => {
          userData = res.new;
          brandToken = signJwtToken(userData.id);
          done();
        });
      });
    });
  });

  after((done) => {
    removeByKeys('brands', [brandData._key]).then(() => {
      removeByKeys('locations', [brandLocation._key]).then(() => {
        removeByKeys('users', [userData._key]).then(() => {
          done()
        });
      });
    });
  });

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
