const {
  chaiResponse,
  chai,
  chaiHttp,
  should,
  HOST_URL,
  Database,
  db,
  tiscAdminToken,
} = require("./utils/utils");
const helperCommon = require("./helper/common");

describe("user group", () => {
  let token = tiscAdminToken;
  // let email = "unit-test-phase3@yopmail.com";
  // let password = "Unittest@123";
  // beforeEach((done) => {
  //   token = helperCommon
  //     .designBrandLogin(email, password)
  //     .then((authenToken) => {
  //       token = authenToken;
  //       done();
  //     });
  // });
  describe("Brands", () => {
    it("Get List", async () => {
      const res = await chai
        .request(HOST_URL)
        .get("/brand/get-list?page=1&pageSize=10&sort=origin&order=ASC")
        .set({ Authorization: `Bearer ${token}` });
      chaiResponse(res, null, 200, ["data"], ["brands", "pagination"], () => {
        res.body.data.brands.forEach((brand) => {
          brand.should.have.keys(
            "assign_team",
            "cards",
            "categories",
            "collections",
            "coverages",
            "created_at",
            "distributors",
            "id",
            "locations",
            "logo",
            "name",
            "origin",
            "products",
            "status",
            "status_key",
            "teams"
          );
        });
      });
    }).timeout(5000);
    it("Get Summary", async () => {
      const res = await chai
        .request(HOST_URL)
        .get("/brand/summary")
        .set({ Authorization: `Bearer ${token}` });
      chaiResponse(res, null, 200, ["data"], [], () => {
        res.body.data.forEach((item) => {
          item.should.have.keys("id", "label", "quantity", "subs");
          item.subs.forEach((sub) => {
            sub.should.have.keys("id", "label", "quantity");
          });
        });
      });
    }).timeout(5000);
  });

  describe("Design Firms", () => {
    it("Get List", async () => {
      const res = await chai
        .request(HOST_URL)
        .get("/design/get-list?page=1&pageSize=10&sort=origin&order=ASC")
        .set({ Authorization: `Bearer ${token}` });
      chaiResponse(
        res,
        null,
        200,
        ["data"],
        ["designers", "pagination"],
        () => {
          res.body.data.designers.forEach((designer) => {
            designer.should.have.keys(
              "archived",
              "assign_team",
              "capacities",
              "created_at",
              "designers",
              "id",
              "live",
              "logo",
              "main_office",
              "name",
              "on_hold",
              "origin",
              "projects",
              "satellites",
              "status",
              "status_key"
            );
          });
        }
      );
    }).timeout(5000);
    it("Get Summary", async () => {
      const res = await chai
        .request(HOST_URL)
        .get("/design/summary")
        .set({ Authorization: `Bearer ${token}` });
      chaiResponse(res, null, 200, ["data"], [], () => {
        res.body.data.forEach((item) => {
          item.should.have.keys("id", "label", "quantity", "subs");
          item.subs.forEach((sub) => {
            sub.should.have.keys("id", "label", "quantity");
          });
        });
      });
    }).timeout(5000);
  });
});
