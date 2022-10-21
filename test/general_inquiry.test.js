const {
  chaiResponse,
  chai,
  chaiHttp,
  should,
  HOST_URL,
  Database,
  db,
  designToken,
} = require("./utils/utils");
const helperCommon = require("./helper/common");

describe("General Inquiry", () => {
  let product;
  let inquiryId;
  beforeEach((done) => {
    helperCommon.insertProduct();
    done();
  });
  beforeEach((done) => {
    helperCommon.getProduct().then((data) => {
      product = data;
      done();
    });
  });

  describe("Create Inquiry", () => {
    it("Incorrect payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post("/general-inquiry")
        .set({ Authorization: `Bearer ${designToken}` })
        .send({
          product_id: product.id,
          message: "Inquiry",
          inquiry_for_ids: ["Test inquiry for"],
        })
        .end((_err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("statusCode", 400);
          done();
        });
    });

    it("Correct payload inputs", (done) => {
      chai
        .request(HOST_URL)
        .post("/general-inquiry")
        .set({ Authorization: `Bearer ${designToken}` })
        .send({
          product_id: product.id,
          title: "General Inquiry",
          message: "Inquiry",
          inquiry_for_ids: ["Test inquiry for"],
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          inquiryId = res.body.data.id;
          done();
        });
    });
  });

  describe("Get list", () => {
    it("Get list with parameter ", (done) => {
      chai
        .request(HOST_URL)
        .get("/general-inquiry?page=1&pageSize=10&sort=created_at&order=ASC")
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
    it("Get list without parameter ", (done) => {
      chai
        .request(HOST_URL)
        .get("/general-inquiry")
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });

  describe("Get inquiry detail", () => {
    it("Incorrect inquiry id ", (done) => {
      chai
        .request(HOST_URL)
        .get(`/general-inquiry/${inquiryId}-123`)
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.have.status(500);
          res.body.should.have.property("statusCode", 500);
          done();
        });
    });
    it("Correct inquiry id ", (done) => {
      chai
        .request(HOST_URL)
        .get(`/general-inquiry/${inquiryId}`)
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.have.status(500);
          res.body.should.have.property("statusCode", 500);
          done();
        });
    });
  });

  describe("Get inquiry summary", () => {
    it("Correct data response", (done) => {
      chai
        .request(HOST_URL)
        .get(`/general-inquiry/summary`)
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
