// const dotenv = require("dotenv");
// dotenv.config();
// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const should = chai.should();
// chai.use(chaiHttp);
// const HOST_URL = process.env.API_URL;
// const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;
// let id = "";
// describe("Basis preset API", () => {
//   beforeEach((done) => {
//     done();
//   });
//   describe("Create", () => {
//     it("Success", (done) => {
//       chai
//         .request(HOST_URL)
//         .post("/basis-preset/create")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           name: "string",
//           subs: [
//             {
//               name: "string",
//               subs: [
//                 {
//                   value_1: "string",
//                   value_2: "string",
//                   unit_1: "string",
//                   unit_2: "string",
//                 },
//               ],
//             },
//           ],
//         })
//         .end((_err, res) => {
//           id = res.body.data.id;
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("data");
//           res.body.should.have.property("statusCode", 200);
//           done();
//         });
//     });
//     it("Basis preset exists", (done) => {
//       chai
//         .request(HOST_URL)
//         .post("/basis-preset/create")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           name: "string",
//           subs: [
//             {
//               name: "string",
//               subs: [
//                 {
//                   value_1: "string",
//                   value_2: "string",
//                   unit_1: "string",
//                   unit_2: "string",
//                 },
//               ],
//             },
//           ],
//         })
//         .end((_err, res) => {
//           res.should.have.status(400);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("message");
//           res.body.should.have.property("statusCode", 400);
//           done();
//         });
//     });
//     it("Duplicate basis preset names", (done) => {
//       chai
//         .request(HOST_URL)
//         .post("/basis-preset/create")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           name: "string1",
//           subs: [
//             {
//               name: "string",
//               subs: [
//                 {
//                   value_1: "string",
//                   value_2: "string",
//                   unit_1: "string",
//                   unit_2: "string",
//                 },
//               ],
//             },
//             {
//               name: "string",
//               subs: [
//                 {
//                   value_1: "string",
//                   value_2: "string",
//                   unit_1: "string",
//                   unit_2: "string",
//                 },
//               ],
//             },
//           ],
//         })
//         .end((_err, res) => {
//           res.should.have.status(400);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("message");
//           res.body.should.have.property("statusCode", 400);
//           done();
//         });
//     });
//   });
//   describe("Get one", () => {
//     it("Success", (done) => {
//       chai
//         .request(HOST_URL)
//         .get("/basis-preset/get-one/" + id)
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })

//         .end((_err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("data");
//           res.body.should.have.property("statusCode", 200);
//           done();
//         });
//     });
//     it("Not found", (done) => {
//       chai
//         .request(HOST_URL)
//         .get("/basis-preset/get-one/abc")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })

//         .end((_err, res) => {
//           res.should.have.status(404);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("message");
//           res.body.should.have.property("statusCode", 404);
//           done();
//         });
//     });
//   });
//   describe("Update", () => {
//     it("Success", (done) => {
//       chai
//         .request(HOST_URL)
//         .put("/basis-preset/update/" + id)
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           name: "string1",
//           subs: [
//             {
//               name: "string",
//               subs: [
//                 {
//                   value_1: "string",
//                   value_2: "string",
//                   unit_1: "string",
//                   unit_2: "string",
//                 },
//               ],
//             },
//           ],
//         })
//         .end((_err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("data");
//           res.body.should.have.property("statusCode", 200);
//           done();
//         });
//     });
//     it("Not found", (done) => {
//       chai
//         .request(HOST_URL)
//         .put("/basis-preset/update/abc")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .send({
//           name: "string1",
//           subs: [
//             {
//               name: "string",
//               subs: [
//                 {
//                   value_1: "string",
//                   value_2: "string",
//                   unit_1: "string",
//                   unit_2: "string",
//                 },
//               ],
//             },
//           ],
//         })
//         .end((_err, res) => {
//           res.should.have.status(404);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("message");
//           res.body.should.have.property("statusCode", 404);
//           done();
//         });
//     });
//   });
//   describe("Get list", () => {
//     it("Success", (done) => {
//       chai
//         .request(HOST_URL)
//         .get("/basis-preset/get-list")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .end((_err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("data");
//           res.body.should.have.property("statusCode", 200);
//           done();
//         });
//     });
//   });
//   describe("Delete", () => {
//     it("Not found", (done) => {
//       chai
//         .request(HOST_URL)
//         .delete("/basis-preset/delete/abc")
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .end((_err, res) => {
//           res.should.have.status(404);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("message");
//           res.body.should.have.property("statusCode", 404);
//           done();
//         });
//     });
//     it("Success", (done) => {
//       chai
//         .request(HOST_URL)
//         .delete("/basis-preset/delete/" + id)
//         .set({ Authorization: `Bearer ${tiscAdminToken}` })
//         .end((_err, res) => {
//           res.should.have.status(200);
//           res.should.be.json;
//           res.body.should.be.a("object");
//           res.body.should.have.property("message");
//           res.body.should.have.property("statusCode", 200);
//           done();
//         });
//     });
//   });
// });
