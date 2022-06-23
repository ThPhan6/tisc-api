const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;
let id = "";
describe("Product Categories API", () => {
  beforeEach((done) => {
    done();
  });
  describe("Create", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .post("/category/create")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          name: "Main Category",
          subs: [
            {
              name: "SubCategory",
              subs: [
                {
                  name: "Category",
                },
              ],
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
          res.body.data.should.have.keys("id", "subs", "name", "created_at");

          res.body.data.subs.map((subCategory) => {
            subCategory.should.have.keys("id", "name", "subs");
            subCategory.subs.map((category) => {
              category.should.have.keys("id", "name");
            });
          });
          done();
        });
    });
    it("Category exists", (done) => {
      chai
        .request(HOST_URL)
        .post("/category/create")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          name: "Main Category",
          subs: [
            {
              name: "SubCategory",
              subs: [
                {
                  name: "Category",
                },
              ],
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
    it("Duplicate Sub category", (done) => {
      chai
        .request(HOST_URL)
        .post("/category/create")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          name: "Main Category 1",
          subs: [
            {
              name: "SubCategory",
              subs: [
                {
                  name: "Category 1",
                },
              ],
            },
            {
              name: "SubCategory",
              subs: [
                {
                  name: "Category 2",
                },
              ],
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message", "Duplicated sub category");
          res.body.should.have.property("statusCode", 400);
          done();
        });
    });
    it("Duplicate category", (done) => {
      chai
        .request(HOST_URL)
        .post("/category/create")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          name: "Main Category 1",
          subs: [
            {
              name: "SubCategory",
              subs: [
                {
                  name: "Category",
                },
                {
                  name: "Category",
                },
              ],
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message", "Duplicated category");
          res.body.should.have.property("statusCode", 400);
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .post("/category/create/asd")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          name: "Main Category 1",
          subs: [
            {
              name: "SubCategory",
              subs: [
                {
                  name: "Category",
                },
                {
                  name: "Category",
                },
              ],
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
    it("Missing headers authorization ", (done) => {
      chai
        .request(HOST_URL)
        .post("/category/create")
        .send({
          name: "Main Category 1",
          subs: [
            {
              name: "SubCategory",
              subs: [
                {
                  name: "Category",
                },
                {
                  name: "Category",
                },
              ],
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property("statusCode", 401);
          res.body.should.have.property("error", "Unauthorized");
          res.body.should.have.property("message", "Invalid token signature");
          done();
        });
    });
  });

  describe("Get one", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/category/get-one/" + id)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys("id", "name", "subs", "created_at");
          res.body.data.subs.map((subCategory) => {
            subCategory.should.have.keys("id", "name", "subs");
            subCategory.subs.map((category) => {
              category.should.have.keys("id", "name");
            });
          });
          done();
        });
    });
    it("Category not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/category/get-one/" + id + "123")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message", "Category not found");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/category/get-one/abc")
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
        .get("/category/get-one/" + id)
        .end((_err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property("statusCode", 401);
          res.body.should.have.property("error", "Unauthorized");
          res.body.should.have.property("message", "Invalid token signature");
          done();
        });
    });
  });
  describe("Get list", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .get("/category/get-list")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.keys("categories", "summary", "pagination");
          res.body.data.categories.should.be.a("array");
          res.body.data.categories.map((item) => {
            item.should.have.keys("id", "name", "subs", "count", "created_at");
            item.subs.map((subCategory) => {
              subCategory.should.have.keys("id", "name", "subs", "count");
              subCategory.subs.map((category) => {
                category.should.have.keys("id", "name");
              });
            });
          });

          res.body.data.summary.should.be.a("array");
          res.body.data.summary.map((item) => {
            item.should.have.keys("name", "value");
          });
          res.body.data.pagination.should.have.keys(
            "page",
            "page_size",
            "total",
            "page_count"
          );
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .get("/category/get-list/abc")
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
        .get("/category/get-list")
        .end((_err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property("statusCode", 401);
          res.body.should.have.property("error", "Unauthorized");
          res.body.should.have.property("message", "Invalid token signature");
          done();
        });
    });
  });

  describe("Update", () => {
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .put("/category/update/" + id)
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          name: "string 1",
          subs: [
            {
              id: "string",
              name: "string",
              subs: [
                {
                  id: "string",
                  name: "string",
                },
              ],
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("data");
          res.body.should.have.property("statusCode", 200);
          res.body.data.should.have.property("id");
          res.body.data.should.have.property("name");
          res.body.data.should.have.property("subs");
          res.body.data.subs.map((subCategory) => {
            subCategory.should.have.property("id");
            subCategory.should.have.property("name");
            subCategory.should.have.property("subs");
            subCategory.subs.map((category) => {
              category.should.have.property("id");
              category.should.have.property("name");
            });
          });
          res.body.data.should.have.property("created_at");
          done();
        });
    });
    it("category not found", (done) => {
      chai
        .request(HOST_URL)
        .put("/category/update/" + id + "123")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          name: "string 1",
          subs: [
            {
              id: "string",
              name: "string",
              subs: [
                {
                  id: "string",
                  name: "string",
                },
              ],
            },
          ],
        })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message", "Category not found");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .put("/category/update/" + id + "/zxc")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .send({
          name: "string1",
          subs: [
            {
              name: "string",
              subs: [
                {
                  value_1: "string",
                  value_2: "string",
                  unit_1: "string",
                  unit_2: "string",
                },
              ],
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
    it("Missing headers authorization ", (done) => {
      chai
        .request(HOST_URL)
        .put("/category/update/" + id)
        .end((_err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property("statusCode", 401);
          res.body.should.have.property("error", "Unauthorized");
          res.body.should.have.property("message", "Invalid token signature");
          done();
        });
    });
  });
  describe("Delete", () => {
    it("category not found", (done) => {
      chai
        .request(HOST_URL)
        .delete("/category/delete/" + id + "123")
        .set({ Authorization: `Bearer ${tiscAdminToken}` })
        .end((_err, res) => {
          res.should.have.status(404);
          res.should.be.json;
          res.body.should.be.a("object");
          res.body.should.have.property("message", "Category not found");
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Not found", (done) => {
      chai
        .request(HOST_URL)
        .delete("/category/delete/" + id + "/zxc")
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
        .delete("/category/delete/" + id)
        .end((_err, res) => {
          res.should.have.status(401);
          res.should.be.json;
          res.body.should.have.property("statusCode", 401);
          res.body.should.have.property("error", "Unauthorized");
          res.body.should.have.property("message", "Invalid token signature");
          done();
        });
    });
    it("Success", (done) => {
      chai
        .request(HOST_URL)
        .delete("/category/delete/" + id)
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
