// const dotenv = require("dotenv");
// dotenv.config();
// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const should = chai.should();
// chai.use(chaiHttp);
// const HOST_URL = process.env.API_URL;
// const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;
// let teamProfileId = "";
// let permissionId = "";
// describe("Tisc team profile API ", () => {
//   beforeEach((done) => {
//     done();
//   });
//   describe("Create", () => {
//     it("Incorrect payload inputs", (done) => {
//       chai
//         .request(HOST_URL)
//         .post("/team-profile/create")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           lastname: "Test",
//           gender: true,
//           location_id: "94766f63-4885-4b35-97c5-319e2d69b250",
//           department_id: "36bfc014-5ac2-4133-87f9-afbabd2638c1",
//           position: "Position",
//           email: "unittest2212@gmail.com",
//           phone: "0123123123",
//           mobile: "0123123123",
//           role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
//         })
//         .end((_err, res) => {
//           res.should.have.status(400);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 400);
//           res.body.should.have.property("error", "Bad Request");
//           res.body.should.have.property("message", "First name is required");

//           done();
//         });
//     });
//     it("Correct payload inputs", (done) => {
//       chai
//         .request(HOST_URL)
//         .post("/team-profile/create")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           firstname: "Unit",
//           lastname: "Test",
//           gender: true,
//           location_id: "94766f63-4885-4b35-97c5-319e2d69b250",
//           department_id: "36bfc014-5ac2-4133-87f9-afbabd2638c1",
//           position: "Position",
//           email: "unittest2212112312323@gmail.com",
//           phone: "0123123123",
//           mobile: "0123123123",
//           role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
//         })
//         .end((_err, res) => {
//           teamProfileId = res.body.data.id;
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 200);
//           res.body.data.should.have.keys(
//             "id",
//             "role_id",
//             "firstname",
//             "lastname",
//             "gender",
//             "location_id",
//             "work_location",
//             "department_id",
//             "position",
//             "email",
//             "phone",
//             "mobile",
//             "avatar",
//             "backup_email",
//             "personal_mobile",
//             "linkedin",
//             "created_at",
//             "access_level",
//             "status",
//             "phone_code"
//           );
//           done();
//         });
//     });
//   });
//   describe("Get list", () => {
//     it("Success", (done) => {
//       chai
//         .request(HOST_URL)
//         .get("/team-profile/get-list")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .end((_err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 200);
//           res.body.data.should.have.keys("users", "pagination");
//           res.body.data.pagination.should.have.keys(
//             "page",
//             "page_size",
//             "total",
//             "page_count"
//           );
//           res.body.data.users.map((item) => {
//             item.should.have.keys(
//               "id",
//               "firstname",
//               "lastname",
//               "work_location",
//               "position",
//               "email",
//               "phone",
//               "access_level",
//               "status",
//               "avatar",
//               "created_at",
//               "phone_code"
//             );
//           });
//           done();
//         });
//     });
//   });
//   describe("Update", () => {
//     it("Incorrect id", (done) => {
//       chai
//         .request(HOST_URL)
//         .post(`/team-profile/update/${teamProfileId}-123`)
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           firstname: "Unit",
//           lastname: "Test updated",
//           gender: true,
//           location_id: "94766f63-4885-4b35-97c5-319e2d69b250",
//           department_id: "36bfc014-5ac2-4133-87f9-afbabd2638c1",
//           position: "Position",
//           email: "unittest2212123@gmail.com",
//           phone: "0123123123",
//           mobile: "0123123123",
//           role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
//         })
//         .end((_err, res) => {
//           res.should.have.status(404);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 404);
//           res.body.should.have.property("message", "User not found");
//           done();
//         });
//     });
//     it("Correct id", (done) => {
//       chai
//         .request(HOST_URL)
//         .post(`/team-profile/update/${teamProfileId}`)
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           firstname: "Unit",
//           lastname: "Test updated",
//           gender: true,
//           location_id: "94766f63-4885-4b35-97c5-319e2d69b250",
//           department_id: "36bfc014-5ac2-4133-87f9-afbabd2638c1",
//           position: "Position",
//           email: "unittest2212123@gmail.com",
//           phone: "0123123123",
//           mobile: "0123123123",
//           role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
//         })
//         .end((_err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 200);
//           res.body.data.should.have.keys(
//             "id",
//             "role_id",
//             "firstname",
//             "lastname",
//             "gender",
//             "location_id",
//             "work_location",
//             "department_id",
//             "position",
//             "email",
//             "phone",
//             "mobile",
//             "avatar",
//             "backup_email",
//             "personal_mobile",
//             "linkedin",
//             "created_at",
//             "access_level",
//             "status",
//             "phone_code"
//           );
//           done();
//         });
//     });
//     it("Incorrect payload inputs", (done) => {
//       chai
//         .request(HOST_URL)
//         .post(`/team-profile/update/${teamProfileId}`)
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           lastname: "Test updated",
//           gender: true,
//           location_id: "94766f63-4885-4b35-97c5-319e2d69b250",
//           department_id: "36bfc014-5ac2-4133-87f9-afbabd2638c1",
//           position: "Position",
//           email: "unittest2212123@gmail.com",
//           phone: "0123123123",
//           mobile: "0123123123",
//           role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
//         })
//         .end((_err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 200);
//           res.body.data.should.have.keys(
//             "id",
//             "role_id",
//             "firstname",
//             "lastname",
//             "gender",
//             "location_id",
//             "work_location",
//             "department_id",
//             "position",
//             "email",
//             "phone",
//             "mobile",
//             "avatar",
//             "backup_email",
//             "personal_mobile",
//             "linkedin",
//             "created_at",
//             "access_level",
//             "status",
//             "phone_code"
//           );
//           done();
//         });
//     });
//     it("Correct payload inputs", (done) => {
//       chai
//         .request(HOST_URL)
//         .post(`/team-profile/update/${teamProfileId}`)
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           firstname: "Unit",
//           lastname: "Test updated",
//           gender: true,
//           location_id: "94766f63-4885-4b35-97c5-319e2d69b250",
//           department_id: "36bfc014-5ac2-4133-87f9-afbabd2638c1",
//           position: "Position",
//           email: "unittest2212123@gmail.com",
//           phone: "0123123123",
//           mobile: "0123123123",
//           role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
//         })
//         .end((_err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 200);
//           res.body.data.should.have.keys(
//             "id",
//             "role_id",
//             "firstname",
//             "lastname",
//             "gender",
//             "location_id",
//             "work_location",
//             "department_id",
//             "position",
//             "email",
//             "phone",
//             "mobile",
//             "avatar",
//             "backup_email",
//             "personal_mobile",
//             "linkedin",
//             "created_at",
//             "access_level",
//             "status",
//             "phone_code"
//           );
//           done();
//         });
//     });
//   });
//   describe("Get one", () => {
//     it("Incorrect id", (done) => {
//       chai
//         .request(HOST_URL)
//         .get(`/team-profile/get-one/${teamProfileId}-123`)
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           firstname: "Unit",
//           lastname: "Test updated",
//           gender: true,
//           location_id: "94766f63-4885-4b35-97c5-319e2d69b250",
//           department_id: "36bfc014-5ac2-4133-87f9-afbabd2638c1",
//           position: "Position",
//           email: "unittest2212123@gmail.com",
//           phone: "0123123123",
//           mobile: "0123123123",
//           role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
//         })
//         .end((_err, res) => {
//           res.should.have.status(404);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 404);
//           res.body.should.have.property("message", "User not found");
//           done();
//         });
//     });
//     it("Correct id", (done) => {
//       chai
//         .request(HOST_URL)
//         .get(`/team-profile/get-one/${teamProfileId}`)
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           firstname: "Unit",
//           lastname: "Test updated",
//           gender: true,
//           location_id: "94766f63-4885-4b35-97c5-319e2d69b250",
//           department_id: "36bfc014-5ac2-4133-87f9-afbabd2638c1",
//           position: "Position",
//           email: "unittest2212123@gmail.com",
//           phone: "0123123123",
//           mobile: "0123123123",
//           role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
//         })
//         .end((_err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 200);
//           res.body.data.should.have.keys(
//             "id",
//             "role_id",
//             "firstname",
//             "lastname",
//             "gender",
//             "location_id",
//             "work_location",
//             "department_id",
//             "position",
//             "email",
//             "phone",
//             "mobile",
//             "avatar",
//             "backup_email",
//             "personal_mobile",
//             "linkedin",
//             "created_at",
//             "access_level",
//             "status",
//             "phone_code"
//           );
//           done();
//         });
//     });
//   });
//   describe("Delete", () => {
//     it("Incorrect id", (done) => {
//       chai
//         .request(HOST_URL)
//         .post(`/team-profile/update/${teamProfileId}-123`)
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           firstname: "Unit",
//           lastname: "Test updated",
//           gender: true,
//           location_id: "94766f63-4885-4b35-97c5-319e2d69b250",
//           department_id: "36bfc014-5ac2-4133-87f9-afbabd2638c1",
//           position: "Position",
//           email: "unittest2212123@gmail.com",
//           phone: "0123123123",
//           mobile: "0123123123",
//           role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
//         })
//         .end((_err, res) => {
//           res.should.have.status(404);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 404);
//           res.body.should.have.property("message", "User not found");
//           done();
//         });
//     });
//     it("Correct id", (done) => {
//       chai
//         .request(HOST_URL)
//         .post(`/team-profile/update/${teamProfileId}`)
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           firstname: "Unit",
//           lastname: "Test updated",
//           gender: true,
//           location_id: "94766f63-4885-4b35-97c5-319e2d69b250",
//           department_id: "36bfc014-5ac2-4133-87f9-afbabd2638c1",
//           position: "Position",
//           email: "unittest2212123@gmail.com",
//           phone: "0123123123",
//           mobile: "0123123123",
//           role_id: "4fb9a23d-d60a-45a4-8ed4-2300276bc19b",
//         })
//         .end((_err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 200);
//           res.body.data.should.have.keys(
//             "id",
//             "role_id",
//             "firstname",
//             "lastname",
//             "gender",
//             "location_id",
//             "work_location",
//             "department_id",
//             "position",
//             "email",
//             "phone",
//             "mobile",
//             "avatar",
//             "backup_email",
//             "personal_mobile",
//             "linkedin",
//             "created_at",
//             "access_level",
//             "status",
//             "phone_code"
//           );
//           done();
//         });
//     });
//   });
//   describe("Get list permission", () => {
//     it("Success", (done) => {
//       chai
//         .request(HOST_URL)
//         .get("/permission/get-list")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .end((_err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 200);
//           res.body.data.map((item) => {
//             permissionId = item.items[0].id;
//             item.should.have.keys(
//               "logo",
//               "name",
//               "items",
//               "number",
//               "parent_number",
//               "subs"
//             );
//           });
//           done();
//         });
//     });
//   });
//   describe("Update permission", () => {
//     it("Success", (done) => {
//       chai
//         .request(HOST_URL)
//         .put(`/permission/open-close/${permissionId}`)
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .end((_err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("statusCode", 200);
//           res.body.should.have.property("message", "Success.");
//           done();
//         });
//     });
//   });
// });
