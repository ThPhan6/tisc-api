const {
  chaiResponse,
  chai,
  chaiHttp,
  should,
  HOST_URL,
  tiscAdminToken,
  Database,
  db,
} = require("./utils/utils");

describe("Favorite products", () => {
  beforeEach((done) => {
    done();
  });
  describe("List", () => {
    let favorite_category = '';
    let favorite_brand_id = '';
    it("Get all", (done) => {
      chai
        .request(HOST_URL)
        .get("/favourite/product-list")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => chaiResponse(res, done, 200, ['data'], [], () => {
          favorite_category = res.body.data[0].id;
          favorite_brand_id = res.body.data[0].products[0].brand.id;
          res.body.data.map((item) => {
            item.should.have.keys('id', 'name', 'count', 'products');
          });
          done();
        }));
    });
    it("Get with brand_Id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/favourite/product-list?brand_id=${favorite_brand_id}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => chaiResponse(res, done, 200, ['data']));
    });
    it("Get with category_id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/favourite/product-list?category_id=${favorite_category}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => chaiResponse(res, done, 200, ['data']));
    });
  });

  describe("Summary", () => {
    it("Get", (done) => {
      chai
        .request(HOST_URL)
        .get("/favourite/product-summary")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => chaiResponse(
          res, done, 200, ['data'],
          [
            'categories', 'brands', 'category_count',
            'brand_count', 'card_count'
          ], () => {
          res.body.data.categories.map((item) => {
            item.should.have.keys('id', 'name');
          });
          res.body.data.brands.map((item) => {
            item.should.have.keys('id', 'name', 'logo');
          });
          done();
        }));
    });
  // describe("Skip", () => {
  //   it("already skip to retrieve", (done) => {
  //     chai
  //       .request(HOST_URL)
  //       .post("/favourite/skip")
  //       .set({ Authorization: `Bearer ${tiscAdminToken}` })
  //       .end((_err, res) => chaiResponse(
  //         res, done, 400, ['message'],
  //         [], () => {
  //         done();
  //       }));
  //   });
  });

});
