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
describe("Design projects", () => {
  let design;
  let projectZoneId;
  let projectId;
  let product;
  let consideredProduct;
  let specifiedProductId;
  let designAdminToken;
  beforeEach((done) => {
    const email = "unit-test-phase3@yopmail.com";
    const password = "Unittest@123";
    helperCommon.designBrandLogin(email, password).then((token) => {
      designAdminToken = token;
      done();
    });
  });

  beforeEach((done) => {
    helperCommon.getDesign().then((data) => {
      design = data;
      done();
    });
  });

  beforeEach((done) => {
    helperCommon.getProduct().then((data) => {
      product = data;
      done();
    });
  });
  beforeEach((done) => {
    helperCommon.getConsideredProduct().then((data) => {
      consideredProduct = data;
      done();
    });
  });
  describe("Get list building types", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/building-types`)
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
  describe("Get all project", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/get-all`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.map((item) => {
            item.should.have.keys("id", "name", "code");
          });
          done();
        });
    });
  });
  describe("Create project", () => {
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/project/create`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          state_id: "Unit test",
          city_id: "Unit test",
          address: "Unit test",
          postal_code: "Unit test",
          project_type_id: "Unit test",
          building_type_id: "Unit test",
          measurement_unit: 2,
          design_due: "Unit test",
          construction_start: "Unit test",
          status: 1,
        })
        .end((_err, res) => {
          res.should.status(400);
          res.body.should.have.property("statusCode", 400);
          done();
        });
    });
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/project/create`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          code: `${Math.random()}`,
          name: `Project Unit Test ${Math.random()}`,
          country_id: "240",
          state_id: "3806",
          city_id: "130195",
          address: "Nui Thanh",
          postal_code: "55555",
          project_type_id: "978ad82a-6da3-4cbc-bf34-3802001586d3",
          building_type_id: "aa4cd798-ebb3-4d35-a19a-e27de439f498",
          measurement_unit: 2,
          design_due: "string",
          construction_start: "string",
          status: 1,
        })
        .end((_err, res) => {
          projectId = res.body.data.id;
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "code",
            "name",
            "location",
            "country_id",
            "state_id",
            "city_id",
            "country_name",
            "state_name",
            "city_name",
            "address",
            "phone_code",
            "postal_code",
            "project_type_id",
            "project_type",
            "building_type_id",
            "building_type",
            "measurement_unit",
            "design_due",
            "construction_start",
            "team_profile_ids",
            "product_ids",
            "status",
            "created_at"
          );
          done();
        });
    });
  });
  describe("Get list project", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/get-list`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.property("projects");
          res.body.data.should.have.property("pagination");
          done();
        });
    });
  });
  describe("Get list project group by status", () => {
    it("Incorrect design ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/get-list-group-by-status`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          design_id: "",
        })
        .end((_err, res) => {
          res.should.status(400);
          res.body.should.have.property("statusCode", 400);
          done();
        });
    });
    it("Correct design ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/get-list-group-by-status`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .query({
          design_id: design.id,
        })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });
  describe("Get project summary", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/get-summary`)
        .set({ Authorization: `Bearer ${designAdminToken}` })

        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.keys("projects", "live", "on_hold", "archived");
          done();
        });
    });
  });
  describe("Get Measurement unit", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/measurement-units`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.map((item) => {
            item.should.have.keys("key", "value");
          });
          done();
        });
    });
  });
  describe("Get project type", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/project-types`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.data.map((item) => {
            item.should.have.keys("id", "name");
          });
          done();
        });
    });
  });
  describe("Get project status", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/status`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.map((item) => {
            item.should.have.keys("key", "value");
          });
          done();
        });
    });
  });

  describe("Get one project", () => {
    it("Incorrect project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/get-one/${projectId}-1231`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Correct project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project/get-one/${projectId}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });

  describe("Update project", () => {
    it("Incorrect project ID", (done) => {
      chai
        .request(HOST_URL)
        .put(`/project/update/${projectId}-1231`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          code: `${Math.random()}`,
          name: `Project Unit Test ${Math.random()}`,
          country_id: "240",
          state_id: "3806",
          city_id: "130195",
          address: "Nui Thanh",
          postal_code: "55555",
          project_type_id: "978ad82a-6da3-4cbc-bf34-3802001586d3",
          building_type_id: "aa4cd798-ebb3-4d35-a19a-e27de439f498",
          measurement_unit: 2,
          design_due: "string",
          construction_start: "string",
          status: 1,
        })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Correct project ID", (done) => {
      chai
        .request(HOST_URL)
        .put(`/project/update/${projectId}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          code: `${Math.random()}`,
          name: `Project Unit Test ${Math.random()}`,
          country_id: "240",
          state_id: "3806",
          city_id: "130195",
          address: "Nui Thanh",
          postal_code: "55555",
          project_type_id: "978ad82a-6da3-4cbc-bf34-3802001586d3",
          building_type_id: "aa4cd798-ebb3-4d35-a19a-e27de439f498",
          measurement_unit: 2,
          design_due: "string",
          construction_start: "string",
          status: 1,
        })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "code",
            "name",
            "location",
            "country_id",
            "state_id",
            "city_id",
            "country_name",
            "state_name",
            "city_name",
            "address",
            "phone_code",
            "postal_code",
            "project_type_id",
            "project_type",
            "building_type_id",
            "building_type",
            "measurement_unit",
            "design_due",
            "construction_start",
            "team_profile_ids",
            "product_ids",
            "status",
            "created_at"
          );
          done();
        });
    });
  });

  describe("Create project zone", () => {
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/project-zone/create`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          name: "Unit Test",
          areas: [
            {
              name: "Unit Test areas",
              rooms: [
                {
                  room_name: "Unit Test rooms",
                  room_id: "R1",
                  room_size: 10,
                  quantity: 1,
                },
              ],
            },
          ],
        })
        .end((_err, res) => {
          res.should.status(400);
          res.body.should.have.property("statusCode", 400);
          done();
        });
    });
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/project-zone/create`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          project_id: projectId,
          name: "Unit Test",
          areas: [
            {
              name: "Unit Test areas",
              rooms: [
                {
                  room_name: "Unit Test rooms",
                  room_id: "R1",
                  room_size: 10,
                  quantity: 1,
                },
              ],
            },
          ],
        })
        .end((_err, res) => {
          projectZoneId = res.body.data.id;
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });

  describe("Get list project zone", () => {
    it("Incorrect project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project-zone/get-list`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .query({
          project_id: projectId + "123",
        })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Correct project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project-zone/get-list`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .query({
          project_id: projectId,
        })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });

  describe("Get one project zone", () => {
    it("Incorrect project zone ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project-zone/get-one/${projectZoneId}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Correct project zone ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/project-zone/get-one/${projectZoneId}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });
  describe("Update project zone", () => {
    it("Incorrect project zone ID", (done) => {
      chai
        .request(HOST_URL)
        .put(`/project-zone/update/${projectZoneId}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          name: "Unit Test",
          areas: [
            {
              name: "Unit Test areas",
              rooms: [
                {
                  room_name: "Unit Test rooms",
                  room_id: "R1",
                  room_size: 10,
                  quantity: 1,
                },
              ],
            },
          ],
        })
        .end((_err, res) => {
          res.should.status(400);
          res.body.should.have.property("statusCode", 400);
          done();
        });
    });
    it("Correct project zone ID", (done) => {
      chai
        .request(HOST_URL)
        .put(`/project-zone/update/${projectZoneId}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          project_id: projectId,
          name: "Unit Test",
          areas: [
            {
              name: "Unit Test areas",
              rooms: [
                {
                  room_name: "Unit Test rooms",
                  room_id: "R1",
                  room_size: 10,
                  quantity: 1,
                },
              ],
            },
          ],
        })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });
  describe("Get list considered product status", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/considered-product/status`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.map((item) => {
            item.should.have.keys("key", "value");
          });
          done();
        });
    });
  });
  describe("Get list considered product", () => {
    it("Incorrect project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/considered-product/get-list/${projectId}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);

          done();
        });
    });
    it("Correct project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/considered-product/get-list/${projectId}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys("considered_products", "summary");
          done();
        });
    });
  });
  describe("Get list assign by project and product", () => {
    it("Incorrect parameter", (done) => {
      chai
        .request(HOST_URL)
        .get(
          `/considered-product/get-list-assigned/${projectId}-123/${product.id}`
        )
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Correct parameter", (done) => {
      chai
        .request(HOST_URL)
        .get(`/considered-product/get-list-assigned/${projectId}/${product.id}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.keys("data", "statusCode");
          done();
        });
    });
  });
  describe("Update considered product status", () => {
    it("Incorrect considered product ID", (done) => {
      chai
        .request(HOST_URL)
        .patch(`/considered-product/update-status/${consideredProduct.id}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          status: 2,
        })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Correct considered product ID", (done) => {
      chai
        .request(HOST_URL)
        .patch(`/considered-product/update-status/${consideredProduct.id}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          status: 2,
        })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.keys("message", "statusCode");
          done();
        });
    });
  });
  describe("Get list instruction type", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/instruction-type/get-list`)
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
  describe("Get list requirement type", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/requirement-type/get-list`)
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
  describe("Get list unit type", () => {
    it("Correct response data", (done) => {
      chai
        .request(HOST_URL)
        .get(`/unit-type/get-list`)
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
  describe("Get list specified product group by brand", () => {
    it("Incorrect project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/specified-product/get-list-brand/${projectId}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/specified-product/get-list-brand/${projectId}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys("data", "summary");
          done();
        });
    });
  });
  describe("Get list specified product group by material", () => {
    it("Incorrect project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/specified-product/get-list-material/${projectId}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/specified-product/get-list-material/${projectId}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys("data", "summary");
          done();
        });
    });
  });
  describe("Get list specified product group by zone", () => {
    it("Incorrect project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/specified-product/get-list-zone/${projectId}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/specified-product/get-list-zone/${projectId}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys("data", "summary");
          done();
        });
    });
  });

  describe("Specify considered product", () => {
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/specified-product/specify`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          specification: {
            is_refer_document: true,
            specification_attribute_groups: [
              {
                id: "string",
                attributes: [
                  {
                    id: "string",
                    basis_option_id: "string",
                  },
                ],
              },
            ],
          },
          brand_location_id: "string",
          distributor_location_id: "string",
          is_entire: true,
          project_zone_ids: ["string"],
          material_code_id: "string",
          suffix_code: "string",
          description: "string",
          quantity: 1,
          unit_type_id: "string",
          order_method: 1,
          requirement_type_ids: ["string"],
          instruction_type_ids: ["string"],
          special_instructions: "string",
          variant: "string",
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
        .post(`/specified-product/specify`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          considered_product_id: consideredProduct.id,
          specification: {
            is_refer_document: true,
            specification_attribute_groups: [],
          },
          brand_location_id: "e1e3fe07-6f9b-4052-8c4e-b455d01e54cc",
          distributor_location_id: "6b896b5e-dd7e-41aa-917c-1b6ca9cc1e37",
          is_entire: true,
          project_zone_ids: [],
          material_code_id: "8f73f02a-ee5c-43c5-ab85-7bebb124b84f",
          suffix_code: "string",
          description: "string",
          quantity: 1,
          unit_type_id: "36bbfcc8-caf3-4dc6-b263-2c57d0b1b6f6",
          order_method: 1,
          requirement_type_ids: ["646b881f-3eb9-4ce2-9879-b96afe64c7d9"],
          instruction_type_ids: ["70975a46-dfef-416f-8a0e-db89bc427bad"],
          special_instructions: "string",
          variant: "string",
        })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("data");
          res.body.data.should.have.keys(
            "id",
            "considered_product_id",
            "product_id",
            "project_id",
            "specification",
            "brand_location_id",
            "distributor_location_id",
            "project_zone_id",
            "material_code_id",
            "material_code",
            "suffix_code",
            "description",
            "quantity",
            "unit_type_id",
            "order_method",
            "requirement_type_ids",
            "instruction_type_ids",
            "status",
            "special_instructions",
            "created_at",
            "variant",
            "is_deleted",
            "is_entire",
            "project_zone_ids"
          );
          done();
        });
    });
  });

  describe("Get one specified product", () => {
    it("Incorrect considered product ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/specified-product/get-one/${consideredProduct.id}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct project ID", (done) => {
      chai
        .request(HOST_URL)
        .get(`/specified-product/get-one/${consideredProduct.id}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          specifiedProductId = res.body.data.id;
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("data");
          res.body.data.should.have.keys(
            "id",
            "considered_product_id",
            "product_id",
            "project_id",
            "specification",
            "brand_location_id",
            "distributor_location_id",
            "project_zone_id",
            "material_code_id",
            "material_code",
            "suffix_code",
            "description",
            "quantity",
            "unit_type_id",
            "order_method",
            "requirement_type_ids",
            "instruction_type_ids",
            "status",
            "special_instructions",
            "created_at",
            "variant",
            "is_deleted",
            "is_entire",
            "project_zone_ids"
          );
          done();
        });
    });
  });

  describe("Specified product update status", () => {
    it("Incorrect parameter and product id", (done) => {
      chai
        .request(HOST_URL)
        .patch(`/specified-product/update-status/${specifiedProductId}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({})
        .end((_err, res) => {
          res.should.status(400);
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct parameter and product id", (done) => {
      chai
        .request(HOST_URL)
        .patch(`/specified-product/update-status/${specifiedProductId}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          status: 2,
        })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message");
          done();
        });
    });
  });

  describe("Delete project zone", () => {
    it("Incorrect project zone ID", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/project-zone/delete/${projectZoneId}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Incorrect project zone ID", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/project-zone/delete/${projectZoneId}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("Delete considered product", () => {
    it("Incorrect considered product ID", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/considered-product/delete/${consideredProduct.id}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct considered product ID", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/considered-product/delete/${consideredProduct.id}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("Delete specified product", () => {
    it("Incorrect specified product ID", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/specified-product/delete/${specifiedProductId}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct specified product ID", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/specified-product/delete/${specifiedProductId}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("Delete project", () => {
    it("Incorrect project ID", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/project/delete/${projectId}-123`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message");
          done();
        });
    });
    it("Correct project ID", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/project/delete/${projectId}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message");
          done();
        });
    });
  });
});
