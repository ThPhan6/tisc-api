const {
  chaiResponse,
  chai,
  chaiHttp,
  should,
  HOST_URL,
  Database,
  db,
} = require("./utils/utils");
const helperCommon = require("./helper/common");

describe("Favorite products", () => {
  let token = "";
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
  describe("List", () => {
    let favorite_category = false;
    let favorite_brand_id = false;
    it("Get all", (done) => {
      chai
        .request(HOST_URL)
        .get("/favourite/product-list")
        .set({ Authorization: `Bearer ${token}` })
        .end((_err, res) =>
          chaiResponse(res, done, 200, ["data"], [], () => {
            if (res.body.data[0]) {
              favorite_category = res.body.data[0].id;
              favorite_brand_id = res.body.data[0].products[0].brand.id;
            }
            res.body.data.map((item) => {
              item.should.have.keys("id", "name", "count", "products");
            });
            done();
          })
        );
    });
    if (favorite_brand_id) {
      it("Get with brand_Id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/favourite/product-list?brand_id=${favorite_brand_id}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((_err, res) => chaiResponse(res, done, 200, ["data"]));
      });
    }
    if (favorite_category) {
      it("Get with category_id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/favourite/product-list?category_id=${favorite_category}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((_err, res) => chaiResponse(res, done, 200, ["data"]));
      });
    }
  });

  describe("Summary", () => {
    it("Get", async () => {
      const res = await chai
        .request(HOST_URL)
        .get("/favourite/product-summary")
        .set({ Authorization: `Bearer ${token}` });
      chaiResponse(
        res,
        null,
        200,
        ["data"],
        ["categories", "brands", "category_count", "brand_count", "card_count"],
        () => {
          res.body.data.categories.map((item) => {
            item.should.have.keys("id", "name");
          });
          res.body.data.brands.map((item) => {
            item.should.have.keys("id", "name", "logo");
          });
        }
      );
    });
  });
  describe("Skip", () => {
    it("skip to retrieve", async () => {
      await db.query({
        query: `FOR u IN users FILTER u.email == @email UPDATE u WITH { retrieve_favourite: false } IN users`,
        bindVars: {
          email: email,
        },
      });
      const res = await chai
        .request(HOST_URL)
        .post("/favourite/skip")
        .set({ Authorization: `Bearer ${token}` });
      chaiResponse(res, null, 200, ["message"]);
    });
    it("already skip to retrieve", async () => {
      const res = await chai
        .request(HOST_URL)
        .post("/favourite/skip")
        .set({ Authorization: `Bearer ${token}` });
      chaiResponse(res, null, 400, ["message"]);
    });
  });
  describe("Retrieve", () => {
    it("retrieve favourite", async () => {
      await db.query({
        query: `FOR u IN users FILTER u.email == @email UPDATE u WITH { retrieve_favourite: false } IN users`,
        bindVars: {
          email: email,
        },
      });
      try {
        await db.query({
          query: `FOR u IN users FILTER u.email == @email REMOVE u IN users`,
          bindVars: {
            email: "backup_unitest@gmail.com",
          },
        });
      } catch (e) {}
      const a = await db.query({
        query: `INSERT ({"id":"11dad5b4-78af-4a4f-80e0-a0ae7d15fbf4","role_id":"68fdf6d0-464e-404b-90e8-5d02a48ac498","access_level":"Design Admin","firstname":"Design Favourite","gender":null,"location_id":"f1e3fe07-6f9b-4052-8c4e-b455d01e54cc","work_location":null,"department_id":null,"position":null,"email":"backup_unitest@gmail.com","phone":null,"mobile":null,"password":"$2a$10$4DQ1DSOUCLBHc7sqt7Iw7udCoo5Dty.KmKnqu2TQZwg6mruDD6Bn6","avatar":null,"backup_email":"backup_unitest@gmail.com","personal_mobile":"98989898","linkedin":"string","is_verified":true,"verification_token":"a7937b6bd1d7eb9297d1bca68c360fccf5811baa8f8a01cccbc40f56da5c75069e78aad7c80e982c87c21a01faf559b90189564a667c489cac72ad8b82aed343","reset_password_token":null,"status":3,"created_at":"2022-08-19T04:48:13.130Z","type":3,"relation_id":"5d965933-2297-4be2-bc2a-023382aad018","is_deleted":true,"interested":[0],"retrieve_favourite":false}) INTO users RETURN NEW`,
        bindVars: {},
      });

      const res = await chai
        .request(HOST_URL)
        .post("/favourite/retrieve")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          personal_email: "backup_unitest@gmail.com",
          mobile: "98989898",
          phone_code: "84",
        });
      chaiResponse(res, null, 200, ["message"]);
    });
    it("already retrieve favourite", async () => {
      const res = await chai
        .request(HOST_URL)
        .post("/favourite/retrieve")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          personal_email: "backup_unitest@gmail.com",
          mobile: "98989898",
          phone_code: "84",
        });
      chaiResponse(res, null, 400, ["message"]);
    });
  });
});
