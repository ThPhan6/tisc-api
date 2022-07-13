const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;
const { Database } = require("arangojs");
const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
let functionalTypeId = "";
(async function getFunctionalTypes() {
  const functionalType = await db.query({
    query: `FOR data in @@model return data`,
    bindVars: {
      "@model": "functional_types",
    },
  });
  functionalTypeId = functionalType._result[0].id;
})();
let locationId = "";
describe("Location API ", () => {
  beforeEach((done) => {
    done();
  });
  describe("Create", () => {
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/location/create`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          business_number: "43",
          functional_type_ids: [functionalTypeId],
          country_id: "233",
          state_id: "1456",
          city_id: "110968",
          address: "string",
          postal_code: "5000",
          general_phone: "0123123123",
          general_email: "unittest@gmail.com",
          country_name: "United States",
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("error", "Bad Request");
          res.body.should.have.property("message", "Business name is required");
          done();
        });
    });
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post(`/location/create`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          business_name: "Business Name",
          business_number: "43",
          functional_type_ids: [functionalTypeId],
          country_id: "233",
          state_id: "1456",
          city_id: "110968",
          address: "string",
          postal_code: "5000",
          general_phone: "0123123123",
          general_email: "unittest@gmail.com",
          country_name: "United States",
        })
        .end((_err, res) => {
          locationId = res.body.data.id;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "business_name",
            "business_number",
            "functional_types",
            "country_id",
            "state_id",
            "city_id",
            "address",
            "postal_code",
            "general_phone",
            "general_email",
            "created_at",
            "phone_code",
            "city_name",
            "country_name",
            "state_name"
          );
          done();
        });
    });
  });
  describe("Get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get(`/location/get-list`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys("locations", "pagination");
          res.body.data.locations.map((item) => {
            item.should.have.keys(
              "id",
              "business_name",
              "general_phone",
              "general_email",
              "created_at",
              "country_name",
              "state_name",
              "city_name",
              "phone_code",
              "functional_types",
              "teams"
            );
          });
          done();
        });
    });
  });

  describe("Update", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .put(`/location/update/${locationId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          business_name: "Business Name updated",
          business_number: "43",
          functional_type_ids: [functionalTypeId],
          country_id: "233",
          state_id: "1456",
          city_id: "110968",
          address: "string",
          postal_code: "5000",
          general_phone: "0123123123",
          general_email: "unittest@gmail.com",
          country_name: "United States",
        })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message", "Not found location");

          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .put(`/location/update/${locationId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          business_name: "Business Name updated",
          business_number: "43",
          functional_type_ids: [functionalTypeId],
          country_id: "233",
          state_id: "1456",
          city_id: "110968",
          address: "string",
          postal_code: "5000",
          general_phone: "0123123123",
          general_email: "unittest@gmail.com",
          country_name: "United States",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "business_name",
            "business_number",
            "functional_types",
            "country_id",
            "state_id",
            "city_id",
            "address",
            "postal_code",
            "general_phone",
            "general_email",
            "created_at",
            "phone_code",
            "city_name",
            "country_name",
            "state_name"
          );
          done();
        });
    });
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .put(`/location/update/${locationId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          business_number: "43",
          functional_type_ids: [functionalTypeId],
          country_id: "233",
          state_id: "1456",
          city_id: "110968",
          address: "string",
          postal_code: "5000",
          general_phone: "0123123123",
          general_email: "unittest@gmail.com",
          country_name: "United States",
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 400);
          res.body.should.have.property("error", "Bad Request");
          res.body.should.have.property("message", "Business name is required");
          done();
        });
    });
    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .put(`/location/update/${locationId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          business_name: "Business Name updated",
          business_number: "43",
          functional_type_ids: [functionalTypeId],
          country_id: "233",
          state_id: "1456",
          city_id: "110968",
          address: "string",
          postal_code: "5000",
          general_phone: "0123123123",
          general_email: "unittest@gmail.com",
          country_name: "United States",
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "business_name",
            "business_number",
            "functional_types",
            "country_id",
            "state_id",
            "city_id",
            "address",
            "postal_code",
            "general_phone",
            "general_email",
            "created_at",
            "phone_code",
            "city_name",
            "country_name",
            "state_name"
          );
          done();
        });
    });
  });
  describe("Get one", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/location/get-one/${locationId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message", "Not found location");

          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .get(`/location/get-one/${locationId}`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "business_name",
            "business_number",
            "functional_types",
            "country_id",
            "state_id",
            "city_id",
            "address",
            "postal_code",
            "general_phone",
            "general_email",
            "created_at",
            "phone_code",
            "city_name",
            "country_name",
            "state_name"
          );
          done();
        });
    });
  });
  describe("Delete", () => {
    it("Incorrect id", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/location/delete/${locationId}-123`)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("statusCode", 404);
          res.body.should.have.property("message", "Not found location");
          done();
        });
    });
    it("Correct id", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/location/delete/${locationId}`)
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
