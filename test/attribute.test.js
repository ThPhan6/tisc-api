const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;
let id = "";
describe("Product attribute API", () => {
  beforeEach((done) => {
    done();
  });
  describe("Create", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .post("/attribute/create")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          type: 1,
          name: "string",
          subs: [
            {
              name: "string",
              basis_id: "string",
            },
          ],
        })
        .end((_err, res) => {
          id = res.body.data.id;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "name",
            "count",
            "subs",
            "created_at"
          );
          res.body.data.subs.should.be.a("array");
          res.body.data.subs.map((item) => {
            item.should.be.a("object");
            item.should.have.keys(
              "id",
              "name",
              "basis_id",
              "description",
              "content_type"
            );
          });
          done();
        });
    });
    it("Attribute exists", (done) => {
      chai
        .request(HOST_URL)
        .post("/attribute/create")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          type: 1,
          name: "string",
          subs: [
            {
              name: "string",
              basis_id: "string",
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 400);
          done();
        });
    });
    it("Duplicate attribute names", (done) => {
      chai
        .request(HOST_URL)
        .post("/attribute/create")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          type: 1,
          name: "string",
          subs: [
            {
              name: "string",
              basis_id: "string",
            },
            {
              name: "string",
              basis_id: "string",
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 400);
          done();
        });
    });
  });
  describe("Get one", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/attribute/get-one/" + id)
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
            "count",
            "subs",
            "created_at"
          );
          res.body.data.subs.should.be.a("array");
          res.body.data.subs.map((item) => {
            item.should.be.a("object");
            item.should.have.keys(
              "id",
              "name",
              "basis_id",
              "description",
              "content_type"
            );
          });
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/attribute/get-one/abc")
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
  });
  describe("Update", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .put("/attribute/update/" + id)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          type: 1,
          name: "string",
          subs: [
            {
              name: "string",
              basis_id: "string",
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys(
            "id",
            "name",
            "count",
            "subs",
            "created_at"
          );
          res.body.data.subs.should.be.a("array");
          res.body.data.subs.map((item) => {
            item.should.be.a("object");
            item.should.have.keys(
              "id",
              "name",
              "basis_id",
              "description",
              "content_type"
            );
          });
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .put("/attribute/update/abc")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          type: 1,
          name: "string",
          subs: [
            {
              name: "string",
              basis_id: "string",
            },
          ],
        })
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
  describe("Get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/attribute/get-list")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });
  describe("Get list content type", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/attribute/content-type/get-list")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });
  describe("Delete", () => {
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .delete("/attribute/delete/abc")
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
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .delete("/attribute/delete/" + id)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });
});
