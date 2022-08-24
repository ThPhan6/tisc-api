const {
  chaiResponse,
  chai,
  chaiHttp,
  should,
  HOST_URL,
  Database,
  db,
} = require("./utils/utils");
const uuid = require("uuid").v4;

function randomName(n) {
  return randomBytes(n).toString("hex");
}

function designBrandLogin(email, password) {
  return new Promise((resolve) => {
    chai
      .request(HOST_URL)
      .post("/auth/brand-design/login")
      .send({
        email: email,
        password: password,
      })
      .end((_err, res) => {
        resolve(res.body.token);
      });
  });
}

(async function insertCollection() {
  const brand = await getBrandId();
  const collection = await db.query({
    query: `INSERT ({
                  id : "${uuid()}",
                  name: "Collection ${randomName(4)}",
                  brand_id: "${brand.id}"
                }) INTO @@model RETURN NEW`,
    bindVars: {
      "@model": "collections",
    },
  });
  return collection._result;
})();

async function getCollection() {
  const collection = await db.query({
    query: `FOR data in @@model return data`,
    bindVars: {
      "@model": "collections",
    },
  });
  return collection._result[0];
}

async function getBrand() {
  const brand = await db.query({
    query: `FOR data in @@model return data`,
    bindVars: {
      "@model": "brands",
    },
  });
  return brand._result[0];
}

async function getCategory() {
  const category = await db.query({
    query: `FOR data in @@model return data`,
    bindVars: {
      "@model": "categories",
    },
  });
  return category._result[0];
}

async function insertProduct() {
  const brand = await getBrand();
  const collection = await getCollection();
  const category = await getCategory();
  const product = await db.query({
    bindVars: {
      "@model": "brands",
    },
    query: `INSERT ({
      id : "${uuid()}"
      brand_id : "${brand.id}",
      collection_id : "${collection.id}",
      category_ids : "[${category.id}]",
      name : "product ${randomName(4)}",
      code : "random",
      description: "product description",
      general_attribute_groups : "[
        {
          id : "${uuid()}",
          name : "general attribute groups ${randomName(4)}",
          attributes : "[
            {
              id : "${uuid()}",
              basis_id : ""
            }
          ]"

        }
      ]"
    })`,
  });
}

module.exports = {
  designBrandLogin,
  insertCollection,
  getBrandId,
};
