const {
  chaiResponse, chai, chaiHttp,
  should, HOST_URL,
  Database, db,
} = require("./utils/utils");
const helperCommon = require("./helper/common");

describe("Favorite products", () => {
  let token = '';
  let email = "unit-test-phase3@yopmail.com";
  let password = "Unittest@123";
  beforeEach((done) => {
    token = helperCommon
      .designBrandLogin(email, password)
      .then((authenToken) => {
        token = authenToken;
        done();
      });
  });

  describe("Design Firm How To", () => {
    it("Get", async () => {
      const res = await chai
        .request(HOST_URL)
        .get("/documentation/howto/get-current")
        .set({ Authorization: `Bearer ${token}` })
      chaiResponse(res, null, 200, ['data'], [], () => {
        res.body.data.forEach((item) => {
          item.should.have.keys('id', 'title', 'logo', 'document', 'created_at');
        });
      });
    });
  });
});
