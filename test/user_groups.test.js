const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;
let brandId = "";
let designId = "";
describe("Brand API ", () => {
  beforeEach((done) => {
    done();
  });
  describe("get all alphabet", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/get-all-alphabet")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "abc",
            "def",
            "ghi",
            "jkl",
            "mno",
            "pqr",
            "stuv",
            "wxyz"
          );
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/get-all-alphabet/asd")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Missing headers authorization ", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/get-all-alphabet")
        .end((_err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property("statusCode", 401);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/get-list")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          brandId = res.body.data.brands[0].id;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys("brands", "pagination");

          res.body.data.pagination.should.have.keys(
            "page",
            "page_size",
            "total",
            "page_count"
          );
          res.body.data.brands.should.be.a("array");
          res.body.data.brands.map((item) => {
            item.should.have.keys(
              "id",
              "name",
              "logo",
              "origin",
              "locations",
              "teams",
              "distributors",
              "coverages",
              "categories",
              "collections",
              "cards",
              "products",
              "assign_team",
              "status",
              "status_key",
              "created_at"
            );
          });
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/get-list/asd")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Missing headers authorization ", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/get-list")
        .end((_err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property("statusCode", 401);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("get statuses", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/statuses")
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("array");
          res.body.map((item) => {
            item.should.have.keys("key", "value");
          });
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/statuses/asd")
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
  });
  describe("get one", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/get-one/" + brandId)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);

          res.body.data.should.have.keys(
            "id",
            "name",
            "parent_company",
            "logo",
            "slogan",
            "mission_n_vision",
            "official_websites",
            "team_profile_ids",
            "location_ids",
            "status",
            "created_at",
            "updated_at",
            "is_deleted"
          );
          done();
        });
    });
    it("Brand not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/get-one/" + brandId + "123")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/get-one/asd")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Missing headers authorization ", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/get-one/" + brandId)
        .end((_err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property("statusCode", 401);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("invite", () => {
    // it("Success", (done) => {
    //   chai
    //     .request(HOST_URL)
    //     .get("/brand/invite/" + brandId)
    //     .set({ Authorization: `Bearer ${tiscAdminToken}` })
    //     .end((_err, res) => {
    //       res.should.have.status(200);
    //       res.should.be.json;
    //       res.body.should.be.a("object");
    //       res.body.should.have.property("statusCode", 200);
    //       res.body.should.have.property("message", "Success.");
    //       done();
    //     });
    // });
    it("Brand not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/invite/" + brandId + "123")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/brand/invite/asd")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Missing headers authorization ", (done) => {
      chai
        .request(HOST_URL)
        .post("/brand/invite/" + brandId)
        .end((_err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property("statusCode", 401);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
  });
});

describe("Design API", () => {
  beforeEach((done) => {
    done();
  });
  describe("get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/design/get-list")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          designId = res.body.data.designers[0].id;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys("pagination", "designers");
          res.body.data.pagination.should.have.keys(
            "page",
            "page_size",
            "total",
            "page_count"
          );
          res.body.data.designers.map((item) => {
            item.should.have.keys(
              "id",
              "name",
              "logo",
              "origin",
              "main_office",
              "satellites",
              "designers",
              "capacities",
              "projects",
              "live",
              "on_hold",
              "archived",
              "status",
              "status_key",
              "assign_team",
              "created_at"
            );
          });
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/design/get-list/asd")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Missing headers authorization ", (done) => {
      chai
        .request(HOST_URL)
        .get("/design/get-list")
        .end((_err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property("statusCode", 401);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
  });
  describe("get statuses", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/design/statuses")
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("array");
          res.body.map((item) => {
            item.should.have.keys("key", "value");
          });
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/design/statuses/asd")
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
  });
  describe("get one", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/design/get-one/" + designId)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "created_at",
            "design_capabilities",
            "id",
            "is_deleted",
            "location_ids",
            "logo",
            "material_code_ids",
            "mission_n_vision",
            "name",
            "official_website",
            "official_websites",
            "parent_company",
            "profile_n_philosophy",
            "project_ids",
            "slogan",
            "status",
            "team_profile_ids",
            "updated_at"
          );
          done();
        });
    });
    it("design not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/design/get-one/" + designId + "123")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/design/get-one/asd")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Missing headers authorization ", (done) => {
      chai
        .request(HOST_URL)
        .get("/design/get-one/" + designId)
        .end((_err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property("statusCode", 401);
          res.body.should.have.property("error");
          res.body.should.have.property("message");
          done();
        });
    });
  });
});
