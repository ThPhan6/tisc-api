// const dotenv = require("dotenv");
// dotenv.config();
// const chai = require("chai");
// const chaiHttp = require("chai-http");
// chai.use(chaiHttp);
// const should = chai.should();
// const fs = require("fs");
// const path = require("path");
// const basedir = path.resolve("./test/test_files");
// const HOST_URL = process.env.API_URL;
// const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;
// console.log(`${basedir}/meo.jpg`, "[${basedir}/meo.jpg]");
// describe("User profile API", () => {
//   beforeEach((done) => {
//     done();
//   });
//   describe("Get me", () => {
//     it("Success", (done) => {
//       chai
//         .request(HOST_URL)
//         .get("/team-profile/get-me")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .end((err, res) => {
//           if (err) return done(err);
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.have.property("statusCode", 200);
//           res.body.should.have.property("data");

//           res.body.data.should.have.keys(
//             "firstname",
//             "lastname",
//             "gender",
//             "location_id",
//             "department_id",
//             "position",
//             "email",
//             "phone",
//             "mobile",
//             "avatar",
//             "backup_email",
//             "personal_mobile",
//             "linkedin"
//           );
//           done();
//         });
//     });
//     it("Not found user", (done) => {
//       chai
//         .request(HOST_URL)
//         .get("/team-profile/get-me")
//         .end((err, res) => {
//           if (err) return done(err);
//           res.should.have.status(401);
//           res.should.be.json;
//           res.body.should.have.property("statusCode", 401);
//           res.body.should.have.property("error", "Unauthorized");
//           res.body.should.have.property("message", "Invalid token signature");
//           done();
//         });
//     });
//   });

//   describe("Update avatar user", () => {
//     it("Success", (done) => {
//       chai
//         .request(HOST_URL)
//         .post("/team-profile/update-avatar")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .set("content-type", "multipart/form-data")
//         .attach(
//           "avatar",
//           fs.readFileSync(`${basedir}/meo.jpg`),
//           "test_files/meo.jpg"
//         )
//         .end((err, res) => {
//           if (err) return done(err);
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.have.property("statusCode", 200);
//           res.body.should.have.property("data");
//           res.body.data.should.have.property("url");
//           done();
//         });
//     }).timeout(10000);
//     it("Not found user", (done) => {
//       chai
//         .request(HOST_URL)
//         .post("/team-profile/update-avatar")
//         .set("content-type", "multipart/form-data")
//         .attach(
//           "avatar",
//           fs.readFileSync(`${basedir}/meo.jpg`),
//           "test_files/meo.jpg"
//         )
//         .end((err, res) => {
//           if (err) return done(err);
//           res.should.have.status(401);
//           res.should.be.json;
//           res.body.should.have.property("statusCode", 401);
//           res.body.should.have.property("error", "Unauthorized");
//           res.body.should.have.property("message", "Invalid token signature");
//           done();
//         });
//     });
//     it("Avatar not valid file", (done) => {
//       chai
//         .request(HOST_URL)
//         .post("/team-profile/update-avatar")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .set("content-type", "multipart/form-data")
//         .attach(
//           "avatar",
//           fs.readFileSync(`${basedir}/test.txt`),
//           "test_files/test.txt"
//         )
//         .end((err, res) => {
//           if (err) return done(err);
//           res.should.have.status(400);
//           res.should.be.json;
//           res.body.should.have.property("statusCode", 400);
//           res.body.should.have.property("message", "Not valid avatar file");
//           done();
//         });
//     });
//     it("not valid headers content-type", (done) => {
//       chai
//         .request(HOST_URL)
//         .post("/team-profile/update-avatar")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .set("content-type", "multipart/form-data")
//         .attach(
//           "avatar",
//           fs.readFileSync(`${basedir}/test.gif`),
//           "test_files/test.gif"
//         )
//         .end((err, res) => {
//           if (err) return done(err);
//           res.should.have.status(400);
//           res.should.be.json;
//           res.body.should.have.property("statusCode", 400);
//           res.body.should.have.property("message", "Not valid avatar file");
//           done();
//         });
//     });
//   });

//   describe("Update me", () => {
//     it("Success", (done) => {
//       chai
//         .request(HOST_URL)
//         .post("/team-profile/update-me")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           backup_email: "nguyenquangtien08@gmail.com",
//           personal_mobile: "0329919767",
//           zone_code: "5000",
//           linkedin: "tiennguyen",
//         })
//         .end((err, res) => {
//           if (err) return done(err);
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.have.property("statusCode", 200);

//           res.body.data.should.have.keys(
//             "firstname",
//             "lastname",
//             "gender",
//             "location_id",
//             "department_id",
//             "position",
//             "email",
//             "phone",
//             "mobile",
//             "avatar",
//             "backup_email",
//             "personal_mobile",
//             "linkedin"
//           );
//           done();
//         });
//     }).timeout(10000);

//     it("User not found", (done) => {
//       chai
//         .request(HOST_URL)
//         .post("/team-profile/update-me")
//         .send({
//           backup_email: "nguyenquangtien08@gmail.com",
//           personal_mobile: "0329919767",
//           zone_code: "5000",
//           linkedin: "tiennguyen",
//         })
//         .end((err, res) => {
//           if (err) return done(err);
//           res.should.have.status(401);
//           res.should.be.json;
//           res.body.should.have.property("statusCode", 401);
//           res.body.should.have.property("error", "Unauthorized");
//           res.body.should.have.property("message", "Invalid token signature");
//           done();
//         });
//     });
//   });
// });
