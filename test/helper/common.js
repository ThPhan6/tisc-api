const {
  chaiResponse,
  chai,
  chaiHttp,
  should,
  HOST_URL,
  Database,
  db,
} = require("../utils/utils");
const {
  imageTest_1,
  imageTest_2,
  imageTest_3,
  imageTest_4,
} = require("../test_files/image.test");
const uuid = require("uuid").v4;
let email = "unit-test-phase3@yopmail.com";
let password = "Unittest@123";
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

async function insertCollection() {
  const brand = await getBrand();
  const collection = await db.query({
    query: `INSERT ({
              id : "${uuid()}",
              name: "Collection",
              brand_id: "${brand.id}",
              created_at: "2022-07-08T03:42:03.042Z",
              deleted_at : null
            }) INTO @@model RETURN NEW`,
    bindVars: {
      "@model": "collections",
    },
  });
  return collection._result;
}
insertCollection();

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
    query: `FOR data in @@model
            FOR subCategory in data.subs
            FOR category in subCategory.subs
            RETURN category`,
    bindVars: {
      "@model": "categories",
    },
  });
  return category._result[0];
}

async function getBasis() {
  const basis = await db.query({
    query: `FOR basis in @@model
        FILTER basis.type == 1
        FOR sub in basis.subs
        RETURN sub
    `,
    bindVars: {
      "@model": "bases",
    },
  });
  return basis._result[0];
}

async function insertAttribute(type) {
  const basis = await getBasis();
  const attribute = await db.query({
    query: `INSERT ({
      id : "${uuid()}",
      type: ${type},
      name: "Attribute ${type}",
      subs: [
        {
          id : "${uuid()}",
          name: "Attribute subs ${type}",
          basis_id: "${basis.id}"
        }
      ]
    }) INTO @@model RETURN NEW`,
    bindVars: {
      "@model": "attributes",
    },
  });
  return attribute;
}

async function insertProduct() {
  const brand = await getBrand();
  const collection = await getCollection();
  const category = await getCategory();
  const basis = await getBasis();
  const product = await db.query({
    query: `INSERT ({
        id: "${uuid()}",
        brand_id: "${brand.id}",
        collection_id: "${collection.id}",
        category_ids: [
          "${category.id}"
        ],
        name: "Product Test 2 - copy",
        code: "random",
        description: "Product Test 3",
        general_attribute_groups: [
          {
            id: "${uuid()}",
            name: "Test general",
            attributes: [
              {
                id: "${uuid()}",
                basis_id: "${basis.id}",
                basis_value_id: "",
                type: "Presets",
                text: "Onyz",
                conversion_value_1: "",
                conversion_value_2: ""
              },

            ],
          },
        ],
        feature_attribute_groups: [],
        specification_attribute_groups: [
          {
            id: "${uuid()}",
            "name": "Options",
            "attributes": [
              {
                id: "${uuid()}",
                "basis_id": "${basis.id}",
                "type": "Options",
                "text": "Selected 2 items",
                "conversion_value_1": "",
                "conversion_value_2": "",
                "basis_options": []
              },
            ],
          }
        ],
        favorites: [],
        images: [
          "/product/daec92f7-2c03-43ea-b788-2f50daf0498a/global-stone-keyword1keyword2keyword3keyword4copy-16578785758660_medium.webp",
          "/product/daec92f7-2c03-43ea-b788-2f50daf0498a/global-stone-keyword1keyword2keyword3keyword4copy-16578785758651_medium.webp",
          "/product/daec92f7-2c03-43ea-b788-2f50daf0498a/global-stone-keyword1keyword2keyword3keyword4copy-16578785758432_medium.webp",
          "/product/daec92f7-2c03-43ea-b788-2f50daf0498a/global-stone-keyword1keyword2keyword3keyword4copy-16578785758553_medium.webp",
        ],
        keywords: ["keyword1", "keyword2", "keyword3", "keyword4", "copy"],
        created_at: "2022-07-15T09:49:35.891Z",
        created_by: "73c97863-299b-4a27-9b79-722cb5accad1",
        deleted_at: null,
      }) INTO @@model RETURN NEW`,
    bindVars: {
      "@model": "products",
    },
  });
}
insertProduct();

function getSharing(type) {
  return new Promise(async (resolve) => {
    const commonType = await db.query({
      query: `FOR data in @@model
        FILTER data.type == ${type}
      return data`,
      bindVars: {
        "@model": "common_types",
      },
    });
    resolve(commonType._result[0]);
  });
}

function getProduct() {
  return new Promise(async (resolve) => {
    const product = await db.query({
      query: `FOR data in @@model
        FILTER data.deleted_at == null
        limit 1
      return data`,
      bindVars: {
        "@model": "products",
      },
    });
    resolve((await response.all())[0]);
  });
}

function getUserUnitTest() {
  return new Promise(async (resolve) => {
    const user = await db.query({
      query: `FOR data in @@model
              FILTER data.deleted_at == null
              FILTER data.email == "${email}"
              return data`,
      bindVars: {
        "@model": "users",
      },
    });
    resolve(user._result[0]);
  });
}

// getUserUnitTest().then(async (user) => await insertProduct(user.relation_id));
async function insertProject(relationId = "") {
  const project = await db.query({
    query: `INSERT ({
      "code": "PJH789",
      "name": "Dự án công trình tiền tỷ, tỷ tỷ tỷ",
      "location": "Nīlī, Afghanistan",
      "country_id": "1",
      "state_id": "3892",
      "city_id": "102",
      "country_name": "Afghanistan",
      "state_name": "Daykundi",
      "city_name": "Nīlī",
      "address": "700 Nui Thanh",
      "phone_code": "93",
      "postal_code": "23232",
      "project_type_id": "63671922-a4eb-4b14-8a7f-187e35f0422d",
      "project_type": "Meetings, Incentives, Conferences, Exhibitions",
      "building_type_id": "debd8136-5086-4620-ba96-b078ce101b48",
      "building_type": "Conversation & Restoration",
      "measurement_unit": 1,
      "design_due": "2022-10-18",
      "construction_start": "2022-10-20",
      "team_profile_ids": [],
      "product_ids": [],
      "design_id": "f87d2892-ab8e-445a-a5dd-e39ba4d581b7",
      "status": 0,
      "created_at": "2022-10-19 07:42:43",
      "id": "b8a2c67c-570d-4e92-8ea5-4a582901b021",
      "updated_at": "2022-10-21 02:37:23",
      "deleted_at": null
    }
    ) INTO @@model RETURN NEW`,
    bindVars: {
      "@model": "projects",
    },
  });
}

function getProject() {
  return new Promise(async (resolve) => {
    const product = await db.query({
      query: `FOR data in @@model
        FILTER data.deleted_at == null
      return data`,
      bindVars: {
        "@model": "projects",
      },
    });

    const response = product._result.filter((item) => item.design_id !== "");
    resolve(response[0]);
  });
}
function getDesign(relationId) {
  return new Promise(async (resolve) => {
    const design = await db.query({
      query: `FOR data in @@model
              FOR design in designers
              FILTER data.relation_id == @relationId
              return design`,
      bindVars: {
        "@model": "users",
        "relationId": relationId
      },
    });
    resolve(design._result[0]);
  });
}

function getConsideredProduct() {
  return new Promise(async (resolve) => {
    const consideredProduct = await db.query({
      query: `FOR data in @@model
              FILTER data.deleted_at == null
              return data`,
      bindVars: {
        "@model": "considered_products",
      },
    });
    resolve(consideredProduct._result[0]);
  });
}

function verifyUser() {
  return new Promise(async (resolve) => {
    const user = await db.query({
      query: `FOR u IN @@model
      FILTER u.deleted_at == null
      FILTER u.email == "${email}"
      UPDATE u WITH {is_verified : true } IN @@model`,
      bindVars: {
        "@model": "users",
      },
    });
    resolve(user._result[0]);
  });
}

function getCommonType(type) {
  return new Promise(async (resolve) => {
    const commonType = await db.query({
      query: `FOR c IN @@model
      FILTER c.deleted_at == null
      FILTER c.type == "${type}"
    `,
      bindVars: {
        "@model": "common_types",
      },
    });
    resolve(commonType._result[0]);
  });
}

module.exports = {
  designBrandLogin,
  insertCollection,
  getBrand,
  insertProduct,
  getSharing,
  getProduct,
  insertProject,
  getProject,
  getDesign,
  randomName,
  getConsideredProduct,
  getUserUnitTest,
  verifyUser,
  getCommonType,
};
