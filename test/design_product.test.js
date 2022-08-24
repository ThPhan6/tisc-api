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

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

let email = "unit-test-phase3@yopmail.com";
let password = "Unittest@123";

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
