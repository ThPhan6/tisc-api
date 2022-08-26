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

let email = "unit-test-phase3@yopmail.com";
let password = "Unittest@123";

describe("Design firms product", () => {
  let designAdminToken = "";
  let product;
  let sharingGroup;
  let sharingPurpose;
  let project;
  helperCommon.getUserUnitTest().then((user) => {
    helperCommon.insertProject(user.relation_id);
  });
  beforeEach((done) => {
    helperCommon.designBrandLogin(email, password).then((token) => {
      designAdminToken = token;
      done();
    });
  });
  beforeEach((done) => {
    helperCommon.insertCollection();
    done();
  });
  beforeEach((done) => {
    helperCommon.insertProduct();
    done();
  });
  beforeEach((done) => {
    helperCommon.getProduct().then((data) => {
      product = data;
      done();
    });
  });
  beforeEach((done) => {
    helperCommon.getSharing(1).then((sharing) => {
      sharingGroup = sharing;
      done();
    });
  });
  beforeEach((done) => {
    helperCommon.getSharing(2).then((sharing) => {
      sharingPurpose = sharing;
      done();
    });
  });
  // beforeEach((done) => {
  //   helperCommon.insertProject();
  //   done();
  // });
  beforeEach((done) => {
    helperCommon.getProject().then((data) => {
      project = data;
      done();
    });
  });
  describe("Share product information via email", () => {
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post("/product/share-via-email")
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          product_id: "wrong_id",
          sharing_group: "wrong_id",
          sharing_purpose: "wrong_id",
          to_email: "unittest_share@yopmail.com",
          title: "Unit test phase 3",
          message: "Unit test phase 3",
        })
        .end((_err, res) => {
          res.should.status(400);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post("/product/share-via-email")
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          product_id: product.id,
          sharing_group: sharingGroup.id,
          sharing_purpose: sharingPurpose.id,
          to_email: "unittest_share@yopmail.com",
          title: "Unit test phase 3",
          message: "Unit test phase 3",
        })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("Like product", () => {
    it("Incorrect product id", (done) => {
      chai
        .request(HOST_URL)
        .post(`/product/like/${product.id}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct product id", (done) => {
      chai
        .request(HOST_URL)
        .post(`/product/like/${product.id}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("Get one product", () => {
    it("Incorrect product id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/product/get-one/${product.id}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct product id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/product/get-one/${product.id}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.body.should.have.property("statusCode");
          done();
        });
    });
  });
  describe("Get list product of product collection", () => {
    it("Incorrect product id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/product/get-list-rest-collection-product/${product.id}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct product id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/product/get-list-rest-collection-product/${product.id}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.map((item) => {
            item.should.have.keys(
              "id",
              "collection_id",
              "name",
              "images",
              "created_at"
            );
          });
          done();
        });
    });
  });
  describe("Assign product to project", () => {
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/product/assign`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          is_entire: true,
          product_id: "string",
          project_id: "string",
          project_zone_ids: ["string"],
        })
        .end((_err, res) => {
          res.should.status(400);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/product/assign`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          is_entire: true,
          product_id: product.id,
          project_id: project.id,
          project_zone_ids: [],
        })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });

  describe("Get list product sharing group", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/product/sharing-groups`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.map((item) => {
            item.should.have.keys("id", "name");
          });
          done();
        });
    });
  });
  describe("Get list product sharing purpose", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/product/sharing-purposes`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.map((item) => {
            item.should.have.keys("id", "name");
          });
          done();
        });
    });
  });
  describe("Get list product of design", () => {
    it("correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/product/design/get-list`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.map((item) => {
            item.should.have.keys(
              "id",
              "name",
              "brand_logo",
              "count",
              "products"
            );
          });
          done();
        });
    });
  });
  describe("Get list product option", () => {
    it("Incorrect parameter inputs required", (done) => {
      chai
        .request(HOST_URL)
        .get(
          `/product/${product.id}/attribute/{missing_attribute_id}/get-options`
        )
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("data").that.eql([]);
          done();
        });
    });
    it("Correct parameter inputs required", (done) => {
      const attributeId = product.specification_attribute_groups.map((item) =>
        item.attributes.map((attribute) => attribute.id)
      );

      chai
        .request(HOST_URL)
        .get(`/product/${product.id}/attribute/${attributeId}/get-options`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });
});
