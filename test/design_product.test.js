const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const helperCommon = require("./helper/common");
const uuid = require("uuid").v4;

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
let email = "unit-test-phase3@yopmail.com";
let password = "Unittest@123";

async function insertProduct() {
  const product = await db.query({
    query: `INSERT ({
      {
        "id": "${uuid()}",
        "brand_id": "ef890fd7-9af6-43cb-bd2c-7db5fd6ec492",
        "collection_id": "34e4e3be-72fb-4bbe-8220-462e953ee8a6",
        "category_ids": [
          "222e3a92-7718-4977-b9b4-7a4d2b964aeb",
          "29cc80fc-16c7-433c-9572-99e70dd327eb"
        ],
        "name": "Product Unit Test",
        "code": "random",
        "description": "product for green group ",
        "general_attribute_groups": [
          {
            "name": "Title ",
            "attributes": [
              {
                "id": "e14cfe5b-eeab-4826-b165-91c0c8f1341c",
                "basis_id": "66d7e3c1-1c8f-4743-99bf-f607d5379504",
                "basis_value_id": "",
                "type": "Text",
                "text": "Title 1",
                "conversion_value_1": "",
                "conversion_value_2": ""
              },
              {
                "id": "91a1546d-d4f8-4456-bcab-b930cccdb250",
                "basis_id": "5a7b6776-a3df-44ac-9ef9-11659d8bbfd3",
                "basis_value_id": "",
                "type": "Conversions",
                "text": "",
                "conversion_value_1": "1.00",
                "conversion_value_2": "0.39"
              },
              {
                "id": "b87cfad4-9b00-44c8-8807-1486cbed9904",
                "basis_id": "c9377c86-de6f-4393-b51c-00d161ebfb78",
                "basis_value_id": "",
                "type": "Presets",
                "text": "Basalt",
                "conversion_value_1": "",
                "conversion_value_2": ""
              }
            ],
            "id": "87de8c48-2f00-430c-a869-5fcda25deeb6"
          }
        ],
        "feature_attribute_groups": [
          {
            "name": "thread",
            "attributes": [
              {
                "id": "5e0863b8-25a3-4a3d-a39e-adc5aa1755b1",
                "basis_id": "66d7e3c1-1c8f-4743-99bf-f607d5379504",
                "basis_value_id": "",
                "type": "Text",
                "text": "tile 1",
                "conversion_value_1": "",
                "conversion_value_2": ""
              }
            ],
            "id": "19951863-8729-488a-a343-3a267e4eed89"
          }
        ],
        "specification_attribute_groups": [
          {
            "name": "Type",
            "attributes": [
              {
                "id": "8d98e128-8432-4713-bd8a-87092757d85a",
                "basis_id": "aa4d21fe-c19b-40e3-aeaa-27423d794e27",
                "type": "Text",
                "text": "Title 2",
                "conversion_value_1": "",
                "conversion_value_2": "",
                "basis_options": []
              }
            ],
            "id": "cdfd5167-1150-4042-b577-c24f95c36416"
          }
        ],
        "favorites": [],
        "images": [
          "/product/d74400fb-1f0f-4005-bd23-24883dcf76b9/green-group-Key-1Key-2key3copycopycopy-16582192185370_medium.webp",
          "/product/d74400fb-1f0f-4005-bd23-24883dcf76b9/green-group-Key-1Key-2key3copycopycopy-16582192185411_medium.webp",
          "/product/d74400fb-1f0f-4005-bd23-24883dcf76b9/green-group-Key-1Key-2key3copycopycopy-16582192185452_medium.webp"
        ],
        "keywords": [
          "Key 1",
          "Key 2",
          "key3",
          "",
          "copy",
          "copy",
          "copy"
        ],
        "created_at": "2022-07-19T08:26:58.558Z",
        "created_by": "4bfb9d26-1264-4c5a-a768-4146fc3bbfbc",
        "is_deleted": true
      }
    })`,
    bindVars: {
      "@model": "products",
    },
  });
}

describe("Design firms product", () => {
  let designAdminToken = "";
  beforeEach((done) => {
    designAdminToken = helperCommon
      .designBrandLogin(email, password)
      .then((token) => {
        designAdminToken = token;
        done();
      });
  });
  // describe("Share product information via email", () => {
  //   it("Incorrect payload inputs", (done) => {
  //     chai
  //       .request(HOST_URL)
  //       .post("/auth/brand-design/login")
  //       .send({
  //         product_id: "string",
  //         sharing_group: "string",
  //         sharing_purpose: "string",
  //         to_email: "string",
  //         title: "string",
  //         message: "string",
  //       })
  //       .end((_err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.have.property("statusCode", 200);
  //         res.body.should.have.property("message");
  //         res.body.should.have.property("type");
  //         res.body.should.have.property("token");
  //         done();
  //       });
  //   });
  // });
});
