const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const { Database } = require("arangojs");
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;
const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
const uuid = require("uuid").v4;
const moment = require("moment");

let brandId = "";
let collectionId = "";
let categoryId = "";
let basisId = "";
let generalAttributeId = "";
let featureAttributeId = "";
let specificationAttributeId = "";
let productId = "";
(async function getBrandId() {
  const brand = await db.query({
    query: `FOR data in @@model return data`,
    bindVars: {
      "@model": "brands",
    },
  });
  brandId = brand._result[0].id;
  insertCollection(brandId);
  return true;
})();

async function insertCollection(brandId) {
  const collection = await db.query({
    query: `INSERT ({
                id : "${uuid()}",
                name: "Collection",
                brand_id: "${brandId}"
              }) INTO @@model RETURN NEW`,
    bindVars: {
      "@model": "collections",
    },
  });
  collectionId = collection._result[0].id;
}

(async function insertCategory() {
  const category = await db.query({
    query: `INSERT ({
      id : "${uuid()}",
      name: "Main Category test",
      subs: [
        {
          id : "${uuid()}",
          name: "Sub Category test",
          subs: [
            {
              id : "${uuid()}",
              name: "Category test"
            }
          ]
        }
      ],
      created_at : "${moment()}"
    }) INTO @@model RETURN NEW`,
    bindVars: {
      "@model": "categories",
    },
  });
  category._result[0].subs.forEach((subCategory) => {
    subCategory.subs.forEach((category) => {
      categoryId = category.id;
    });
  });
})();

(async function insertBasisConversion() {
  const basisConversion = await db.query({
    query: `INSERT ({
      id : "${uuid()}",
      name: "Basis Conversion",
      subs: [
        {
          id : "${uuid()}",
          name_1: "meter",
          name_2: "millimeter",
          formula_1: "1",
          formula_2: "10",
          unit_1: "m",
          unit_2: "mm",
          image : "/basis-option/e9ab4b81c35f9244.webp"
        }
      ]
    }) INTO @@model RETURN NEW`,
    bindVars: {
      "@model": "bases",
    },
  });
  basisConversion._result[0].subs.forEach((conversion) => {
    basisId = conversion.id;
  });
})();

async function insertAttribute(type) {
  const attribute = await db.query({
    query: `INSERT ({
      id : "${uuid()}",
      type: ${type},
      name: "Attribute ${type}",
      subs: [
        {
          id : "${uuid()}",
          name: "Attribute subs ${type}",
          basis_id: "string"
        }
      ]
    }) INTO @@model RETURN NEW`,
    bindVars: {
      "@model": "attributes",
    },
  });
  return attribute;
}
insertAttribute(1).then((res) => {
  generalAttributeId = res._result[0].id;
});
insertAttribute(2).then((res) => {
  featureAttributeId = res._result[0].id;
});
insertAttribute(3).then((res) => {
  specificationAttributeId = res._result[0].id;
});

(async function insertProduct() {
  const product = await db.query({
    query: `INSERT({
      id : "${uuid()}",
      brand_id: "${brandId}",
      collection_id:"${collectionId}",
      category_ids: "[${categoryId}]",
      name: "Product configuration Unit test 111",
      description: "Product configuration Unit test 1",
      general_attribute_groups: [
        {
          name: "general_attribute_groups",
          attributes: [
            {
              id: "${generalAttributeId}",
              basis_id: "${basisId}",
              type: "Text",
              text: "string",
              conversion_value_1: "string1",
              conversion_value_2: "string2",
            },
          ],
        },
      ],
      feature_attribute_groups: [
        {
          name: "feature_attribute_groups",
          attributes: [
            {
              id: "${featureAttributeId}",
              basis_id: "${basisId}",
              type: "Text",
              text: "string",
              conversion_value_1: "string1",
              conversion_value_2: "string2",
            },
          ],
        },
      ],
      specification_attribute_groups: [
        {
          name: "specification_attribute_groups",
          attributes: [
            {
              id: "${specificationAttributeId}",
              basis_id: "${basisId}",
              type: "Text",
              text: "string",
              conversion_value_1: "string1",
              conversion_value_2: "string2",
              basis_options: [
                {
                  id: "string",
                  option_code: "string",
                },
              ],
            },
          ],
        },
      ],
      images: [
        "/product/372af3e3-8732-4758-a433-fd7d3b540565/global-stone-string-16577693527660_medium.webp",
        "/product/372af3e3-8732-4758-a433-fd7d3b540565/global-stone-string-16577693527691_medium.webp",
        "/product/372af3e3-8732-4758-a433-fd7d3b540565/global-stone-string-16577693527692_medium.webp"
      ],
      keywords: ["string"],
    }) into @@model return NEW`,
    bindVars: {
      "@model": "products",
    },
  });
  productId = product._result[0].id;
})();

describe("Product catelogue and download API ", () => {
  beforeEach((done) => {
    done();
  });
  describe("create", () => {
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/product-catelogue-download/create`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          contents: [
            {
              title: "title 2",
              url: "url",
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("error", "Bad Request");
          res.body.should.have.property("message", "Product id is required");
          done();
        });
    });
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/product-catelogue-download/create`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          product_id: productId,
          contents: [
            {
              title: "title 2",
              url: "url",
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "product_id",
            "contents",
            "created_at"
          );
          res.body.data.contents.map((item) => {
            item.should.have.keys("id", "title", "url");
          });
          done();
        });
    });
  });
  describe("Update", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .put(`/product-catelogue-download/update/${productId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          product_id: productId,
          contents: [
            {
              title: "title 2",
              url: "url",
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property(
            "message",
            "Product download not found"
          );
          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .put(`/product-catelogue-download/update/${productId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          product_id: productId,
          contents: [
            {
              title: "title updated",
              url: "url",
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "product_id",
            "contents",
            "created_at"
          );
          res.body.data.contents.map((item) => {
            item.should.have.keys("id", "title", "url");
          });
          done();
        });
    });
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .put(`/product-catelogue-download/update/${productId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          contents: [
            {
              title: "title 2",
              url: "url",
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("error", "Bad Request");
          res.body.should.have.property("message", "Product id is required");
          done();
        });
    });
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .put(`/product-catelogue-download/update/${productId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          product_id: productId,
          contents: [
            {
              title: "title updated",
              url: "url",
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "product_id",
            "contents",
            "created_at"
          );
          res.body.data.contents.map((item) => {
            item.should.have.keys("id", "title", "url");
          });
          done();
        });
    });
  });
  describe("Get one", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/product-catelogue-download/get-one/${productId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          product_id: productId,
          contents: [
            {
              title: "title 2",
              url: "url",
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property(
            "message",
            "Product download not found"
          );
          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/product-catelogue-download/get-one/${productId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          product_id: productId,
          contents: [
            {
              title: "title updated",
              url: "url",
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "product_id",
            "contents",
            "created_at"
          );
          res.body.data.contents.map((item) => {
            item.should.have.keys("id", "title", "url");
          });
          done();
        });
    });
  });
});
