const { Database } = require("arangojs");
const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;
const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
const uuid = require("uuid").v4;
let teamProfileId = "";
let permissionId = "";
let functionalTypeId = "";
let locationId = "";
let departmentId = "";
async function getFunctionalTypes() {
  const functionalType = await db.query({
    query: `FOR data in @@model return data`,
    bindVars: {
      "@model": "functional_types",
    },
  });
  return functionalType._result[0].id;
}

(async function insertLocation() {
  functionalTypeId = await getFunctionalTypes();
  const location = await db.query({
    query: `INSERT ({
      id : "${uuid()}",
      business_name: "business_name 1",
      business_number: "business_number2 ",
      functional_type_ids: "[${functionalTypeId}]",
      country_id: "233",
      state_id: "1456",
      city_id: "110968",
      address: "My tho",
      country_name : "United States",
      postal_code: "1234",
      general_phone: "0123456789",
      general_email: "0123456789"
    }) INTO @@model RETURN NEW`,
    bindVars: {
      "@model": "locations",
    },
  });
  locationId = location._result[0].id;
})();

(async function getDepartments() {
  const department = await db.query({
    query: `FOR data in @@model return data`,
    bindVars: {
      "@model": "departments",
    },
  });
  departmentId = department._result[0].id;
})();

describe("Tisc team profile API ", () => {
  beforeEach((done) => {
    done();
  });
  describe("Create", () => {
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post("/team-profile/create")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          lastname: "Test",
          gender: true,
          location_id: locationId,
          department_id: departmentId,
          position: "Position",
          email: "unittest2212@gmail.com",
          phone: "0123123123",
          mobile: "0123123123",
          role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("error", "Bad Request");
          res.body.should.have.property("message", "First name is required");

          done();
        });
    });
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post("/team-profile/create")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          firstname: "Unit",
          lastname: "Test",
          gender: true,
          location_id: locationId,
          department_id: departmentId,
          position: "Position",
          email: "unittest332311123@gmail.com",
          phone: "0123123123",
          mobile: "0123123123",
          role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
        })
        .end((_err, res) => {
          teamProfileId = res.body.data.id;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "role_id",
            "firstname",
            "lastname",
            "gender",
            "location_id",
            "work_location",
            "department_id",
            "position",
            "email",
            "phone",
            "mobile",
            "avatar",
            "backup_email",
            "personal_mobile",
            "linkedin",
            "created_at",
            "access_level",
            "status"
          );
          done();
        });
    });
  });
  describe("Get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/team-profile/get-list")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys("users", "pagination");
          res.body.data.pagination.should.have.keys(
            "page",
            "page_size",
            "total",
            "page_count"
          );
          res.body.data.users.map((item) => {
            item.should.have.property("id");
            item.should.have.property("firstname");
            item.should.have.property("lastname");
            item.should.have.property("position");
            item.should.have.property("email");
            item.should.have.property("phone");
            item.should.have.property("status");
            item.should.have.property("avatar");
            item.should.have.property("created_at");
          });
          done();
        });
    });
  });
  describe("Update", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .post(`/team-profile/update/${teamProfileId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          firstname: "Unit",
          lastname: "Test updated",
          gender: true,
          location_id: locationId,
          department_id: departmentId,
          position: "Position",
          email: "unittest2212123@gmail.com",
          phone: "0123123123",
          mobile: "0123123123",
          role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
        })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message", "User not found");
          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .post(`/team-profile/update/${teamProfileId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          firstname: "Unit",
          lastname: "Test updated",
          gender: true,
          location_id: locationId,
          department_id: departmentId,
          position: "Position",
          email: "unittest2212123@gmail.com",
          phone: "0123123123",
          mobile: "0123123123",
          role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "role_id",
            "firstname",
            "lastname",
            "gender",
            "location_id",
            "work_location",
            "department_id",
            "position",
            "email",
            "phone",
            "mobile",
            "avatar",
            "backup_email",
            "personal_mobile",
            "linkedin",
            "created_at",
            "access_level",
            "status"
          );
          done();
        });
    });
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/team-profile/update/${teamProfileId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          lastname: "Test updated",
          gender: true,
          location_id: locationId,
          department_id: departmentId,
          position: "Position",
          email: "unittest2212123@gmail.com",
          phone: "0123123123",
          mobile: "0123123123",
          role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "role_id",
            "firstname",
            "lastname",
            "gender",
            "location_id",
            "work_location",
            "department_id",
            "position",
            "email",
            "phone",
            "mobile",
            "avatar",
            "backup_email",
            "personal_mobile",
            "linkedin",
            "created_at",
            "access_level",
            "status"
          );
          done();
        });
    });
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/team-profile/update/${teamProfileId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          firstname: "Unit",
          lastname: "Test updated",
          gender: true,
          location_id: locationId,
          department_id: departmentId,
          position: "Position",
          email: "unittest2212123@gmail.com",
          phone: "0123123123",
          mobile: "0123123123",
          role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "role_id",
            "firstname",
            "lastname",
            "gender",
            "location_id",
            "work_location",
            "department_id",
            "position",
            "email",
            "phone",
            "mobile",
            "avatar",
            "backup_email",
            "personal_mobile",
            "linkedin",
            "created_at",
            "access_level",
            "status"
          );
          done();
        });
    });
  });
  describe("Get one", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/team-profile/get-one/${teamProfileId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          firstname: "Unit",
          lastname: "Test updated",
          gender: true,
          location_id: locationId,
          department_id: departmentId,
          position: "Position",
          email: "unittest2212123@gmail.com",
          phone: "0123123123",
          mobile: "0123123123",
          role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
        })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message", "User not found");
          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/team-profile/get-one/${teamProfileId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          firstname: "Unit",
          lastname: "Test updated",
          gender: true,
          location_id: locationId,
          department_id: departmentId,
          position: "Position",
          email: "unittest2212123@gmail.com",
          phone: "0123123123",
          mobile: "0123123123",
          role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "role_id",
            "firstname",
            "lastname",
            "gender",
            "location_id",
            "work_location",
            "department_id",
            "position",
            "email",
            "phone",
            "mobile",
            "avatar",
            "backup_email",
            "personal_mobile",
            "linkedin",
            "created_at",
            "access_level",
            "status"
          );
          done();
        });
    });
  });
  describe("Delete", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .post(`/team-profile/update/${teamProfileId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          firstname: "Unit",
          lastname: "Test updated",
          gender: true,
          location_id: locationId,
          department_id: departmentId,
          position: "Position",
          email: "unittest2212123@gmail.com",
          phone: "0123123123",
          mobile: "0123123123",
          role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
        })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message", "User not found");
          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .post(`/team-profile/update/${teamProfileId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          firstname: "Unit",
          lastname: "Test updated",
          gender: true,
          location_id: locationId,
          department_id: departmentId,
          position: "Position",
          email: "unittest2212123@gmail.com",
          phone: "0123123123",
          mobile: "0123123123",
          role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "role_id",
            "firstname",
            "lastname",
            "gender",
            "location_id",
            "work_location",
            "department_id",
            "position",
            "email",
            "phone",
            "mobile",
            "avatar",
            "backup_email",
            "personal_mobile",
            "linkedin",
            "created_at",
            "access_level",
            "status"
          );
          done();
        });
    });
  });
  describe("Get list permission", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/permission/get-list")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.map((item) => {
            permissionId = item.items[0].id;
            item.should.have.property("logo");
            item.should.have.property("name");
            item.should.have.property("items");
            item.should.have.property("number");
            item.should.have.property("parent_number");
          });
          done();
        });
    });
  });
  describe("Update permission", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .put(`/permission/open-close/${permissionId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("message", "Success.");
          done();
        });
    });
  });
});
