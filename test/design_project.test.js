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
  let project;
  let projectZoneId;
  let projectId;
  beforeEach((done) => {
    const email = "unit-test-phase3@yopmail.com";
    const password = "Unittest@123";
    designAdminToken = helperCommon
      .designBrandLogin(email, password)
      .then((token) => {
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
    helperCommon.getProject().then((data) => {
      project = data;
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
        .get(`/project/get-one/${project.id}-1231`)
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
        .get(`/project/get-one/${project.id}`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
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
          code: "Unit Test",
          name: "Project Unit Test",
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

  describe("Update project", () => {
    it("Incorrect project ID", (done) => {
      chai
        .request(HOST_URL)
        .put(`/project/update/${projectId}-1231`)
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          code: "Unit Test",
          name: "Project Unit Test",
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
          code: "Unit Test",
          name: "Project Unit Test",
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
});
