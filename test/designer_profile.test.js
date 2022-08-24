const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const helperCommon = require("./helper/common");

let email = "unit-test-phase3@yopmail.com";
let password = "Unittest@123";
describe("Design profile", () => {
  let designAdminToken = "";
  beforeEach((done) => {
    designAdminToken = helperCommon
      .designBrandLogin(email, password)
      .then((token) => {
        designAdminToken = token;
        done();
      });
  });
  describe("Update profile", () => {
    it("Design update profile", (done) => {
      chai
        .request(HOST_URL)
        .post("/team-profile/update-me")
        .set({ Authorization: `Bearer ${designAdminToken}` })
        .send({
          backup_email: "unittest_backup@yopmail.com",
          personal_mobile: "0123456789",
          linkedin: "linkedin.com",
          interested: [0, 1],
        })
        .end((_err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("statusCode", 200);
          res.body.should.have.property("data");
          res.body.data.should.have.keys(
            "id",
            "role_id",
            "firstname",
            "fullname",
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
            "status",
            "type",
            "relation_id",
            "phone_code",
            "interested",
            "retrieve_favourite"
          );
          done();
        });
    });
  });
});
