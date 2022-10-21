const {
  chaiResponse,
  chai,
  chaiHttp,
  should,
  HOST_URL,
  Database,
  db,
  designToken,
  getMe,
} = require("./utils/utils");

const { imageTest_4 } = require("./test_files/image.test");
const helperCommon = require("./helper/common");

describe("Design Firm", () => {
  let design;
  let locationId;
  let teamProfileId;
  let materialCodeId;
  let project;
  let user;
  let tracking;
  let product;
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

  beforeEach((done) => {
    helperCommon.getDesign().then((data) => {
      design = data;
      done();
    });
  });

  beforeEach((done) => {
    chai
      .request(HOST_URL)
      .get("/team-profile/get-me")
      .set({ Authorization: `Bearer ${designToken}` })

      .end((_err, res) => {
        user = res.body.data;
        done();
      });
  });

  helperCommon.getUserUnitTest().then((user) => {
    helperCommon.insertProject(user.relation_id);
  });
  beforeEach((done) => {
    helperCommon.getProject().then((data) => {
      project = data;
      done();
    });
  });

  describe("Office Profile", () => {
    describe("Update design office profile", () => {
      it("Incorrect design id", (done) => {
        chai
          .request(HOST_URL)
          .patch(`/design/office-profile/${design.id}-123`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            name: "Testing 4",
            parent_company: "TISC",
            logo: imageTest_4,
            slogan: "TISC",
            profile_n_philosophy: "TISC",
            office_website: "https://tisc.enabledemo.com",
            capabilities: ["capability"],
          })
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
      it("Correct design id", (done) => {
        chai
          .request(HOST_URL)
          .patch(`/design/office-profile/${design.id}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            name: "Testing 4",
            parent_company: "TISC",
            logo: imageTest_4,
            slogan: "TISC",
            profile_n_philosophy: "TISC",
            office_website: "https://tisc.enabledemo.com",
            capabilities: ["capability"],
          })
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
      it("Incorrect logo", (done) => {
        chai
          .request(HOST_URL)
          .patch(`/design/office-profile/${design.id}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            name: "Testing 4",
            parent_company: "TISC",
            logo: "TISC logo",
            slogan: "TISC",
            profile_n_philosophy: "TISC",
            office_website: "https://tisc.enabledemo.com",
            capabilities: ["capability"],
          })
          .end((_err, res) => {
            res.should.have.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
      it("Correct logo", (done) => {
        chai
          .request(HOST_URL)
          .patch(`/design/office-profile/${design.id}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            name: "Testing 4",
            parent_company: "TISC",
            logo: imageTest_4,
            slogan: "TISC",
            profile_n_philosophy: "TISC",
            office_website: "https://tisc.enabledemo.com",
            capabilities: ["capability"],
          })
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });
  });

  describe("Location", () => {
    describe("Create design location", () => {
      it("Incorrect payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .post(`/location/create`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            functional_type_ids: ["string"],
            country_id: "string",
            state_id: "string",
            city_id: "string",
            address: "string",
            postal_code: "string",
            general_phone: "string",
            general_email: "string",
          })
          .end((_err, res) => {
            res.should.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
      it("Correct payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .post(`/location/create`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            business_name: "TISC",
            business_number: "TISC",
            functional_type_ids: ["TISC"],
            country_id: "233",
            state_id: "1456",
            city_id: "110968",
            address: "string",
            postal_code: "5000",
            general_phone: "0123123123",
            general_email: "unittest@gmail.com",
          })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            locationId = res.body.data.id;
            done();
          });
      });
    });

    describe("Get list", () => {
      it("Get list with parameter", (done) => {
        chai
          .request(HOST_URL)
          .get(`/location/get-list?page=1&pageSize=10`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
      it("Get list without parameter", (done) => {
        chai
          .request(HOST_URL)
          .get(`/location/get-list`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });

    describe("Get design location detail", () => {
      it("Incorrect location id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/location/get-one/${locationId}-123`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(404);
            res.body.should.have.property("statusCode", 404);
            done();
          });
      });
      it("Correct location id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/location/get-one/${locationId}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });

    describe("Update design location", () => {
      it("Incorrect location id", (done) => {
        chai
          .request(HOST_URL)
          .put(`/location/update/${locationId}-123`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            business_name: "TISC",
            business_number: "TISC",
            functional_type_ids: ["TISC"],
            country_id: "233",
            state_id: "1456",
            city_id: "110968",
            address: "string",
            postal_code: "5000",
            general_phone: "0123123123",
            general_email: "unittest@gmail.com",
          })
          .end((_err, res) => {
            res.should.status(404);
            res.body.should.have.property("statusCode", 404);
            done();
          });
      });
      it("Correct location id", (done) => {
        chai
          .request(HOST_URL)
          .put(`/location/update/${locationId}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            business_name: "TISC",
            business_number: "TISC",
            functional_type_ids: ["TISC"],
            country_id: "233",
            state_id: "1456",
            city_id: "110968",
            address: "string",
            postal_code: "5000",
            general_phone: "0123123123",
            general_email: "unittest@gmail.com",
          })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
      it("Incorrect payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .put(`/location/update/${locationId}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            functional_type_ids: ["string"],
            country_id: "string",
            state_id: "string",
            city_id: "string",
            address: "string",
            postal_code: "string",
            general_phone: "string",
            general_email: "string",
          })
          .end((_err, res) => {
            res.should.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
      it("Correct payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .put(`/location/update/${locationId}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            business_name: "TISC",
            business_number: "TISC",
            functional_type_ids: ["TISC"],
            country_id: "233",
            state_id: "1456",
            city_id: "110968",
            address: "string",
            postal_code: "5000",
            general_phone: "0123123123",
            general_email: "unittest@gmail.com",
          })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });
  });

  describe("Team profile", () => {
    describe("Create design team profile", () => {
      it("Incorrect payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .post(`/team-profile/create`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            position: "string",
            email: "string",
            phone: "string",
            mobile: "string",
            role_id: "string",
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
          .post(`/team-profile/create`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            firstname: "TISC",
            lastname: "DESIGN",
            gender: true,
            location_id: locationId,
            department_id: "test",
            position: "CEO",
            email: "tisc_2@yopmail.com",
            phone: "1231231231",
            mobile: "1231231231",
            role_id: "1493b47a-1118-43e2-9bd8-1a3c3adc3f13",
          })
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("statusCode", 200);
            teamProfileId = res.body.data.id;
            done();
          });
      });
    });

    describe("Get list team profile", () => {
      it("Get list with parameter", (done) => {
        chai
          .request(HOST_URL)
          .get(`/team-profile/get-list?page=1&pageSize=10`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
      it("Get list without parameter", (done) => {
        chai
          .request(HOST_URL)
          .get(`/team-profile/get-list`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });

    describe("Get team profile detail", () => {
      it("Incorrect design team profile id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/team-profile/get-one/${teamProfileId}-123`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(404);
            res.body.should.have.property("statusCode", 404);
            done();
          });
      });
      it("Correct design team profile id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/team-profile/get-one/${teamProfileId}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });

    describe("Update team profile", () => {
      it("Incorrect design team profile id", (done) => {
        chai
          .request(HOST_URL)
          .post(`/team-profile/update/${teamProfileId}-123`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            firstname: "TISC",
            lastname: "DESIGN",
            gender: true,
            location_id: locationId,
            department_id: "test",
            position: "CEO",
            email: "tisc-update@yopmail.com",
            phone: "1231231231",
            mobile: "1231231231",
            role_id: "1493b47a-1118-43e2-9bd8-1a3c3adc3f13",
          })
          .end((_err, res) => {
            res.should.status(404);
            res.body.should.have.property("statusCode", 404);
            done();
          });
      });
      it("Correct design team profile id", (done) => {
        chai
          .request(HOST_URL)
          .post(`/team-profile/update/${teamProfileId}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            firstname: "TISC",
            lastname: "DESIGN",
            gender: true,
            location_id: locationId,
            department_id: "test",
            position: "CEO",
            email: "tisc-update@yopmail.com",
            phone: "1231231231",
            mobile: "1231231231",
            role_id: "1493b47a-1118-43e2-9bd8-1a3c3adc3f13",
          })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
      it("Incorrect payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .post(`/team-profile/update/${teamProfileId}-123`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            department_id: "test",
            position: "CEO",
            email: "tisc-update@yopmail.com",
            phone: "1231231231",
            mobile: "1231231231",
            role_id: "1493b47a-1118-43e2-9bd8-1a3c3adc3f13",
          })
          .end((_err, res) => {
            res.should.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
      it("Correct payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .post(`/team-profile/update/${teamProfileId}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            firstname: "TISC",
            lastname: "DESIGN",
            gender: true,
            location_id: locationId,
            department_id: "test",
            position: "CEO",
            email: "tisc-update@yopmail.com",
            phone: "1231231231",
            mobile: "1231231231",
            role_id: "1493b47a-1118-43e2-9bd8-1a3c3adc3f13",
          })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });
  });

  describe("Material/Product Code", () => {
    describe("Create material code", () => {
      it("Incorrect payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .post(`/material-code/create`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            subs: [
              {
                name: "Subs",
                codes: [
                  {
                    code: "code",
                    description: "test",
                  },
                ],
              },
            ],
          })
          .end((_err, res) => {
            res.should.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
      it("Correct payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .post(`/material-code/create`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            name: "Material Code test",
            subs: [
              {
                name: "Subs",
                codes: [
                  {
                    code: "code",
                    description: "test",
                  },
                ],
              },
            ],
          })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            materialCodeId = res.body.data.id;
            done();
          });
      });
    });

    describe("Get list material code", () => {
      it("Get list with parameter ", (done) => {
        chai
          .request(HOST_URL)
          .get(`/material-code/get-list?page=1&pageSize=10`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
      it("Get list without parameter ", (done) => {
        chai
          .request(HOST_URL)
          .get(`/material-code/get-list`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });

    describe("Get material code detail", () => {
      it("Incorrect material code id ", (done) => {
        chai
          .request(HOST_URL)
          .get(`/material-code/get-one/${materialCodeId}-123`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(404);
            res.body.should.have.property("statusCode", 404);
            done();
          });
      });
      it("Correct material code id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/material-code/get-one/${materialCodeId}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });

    describe("Update material code", () => {
      it("Incorrect material code id ", (done) => {
        chai
          .request(HOST_URL)
          .put(`/material-code/update/${materialCodeId}-123`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            name: "material code update",
            subs: [
              {
                name: "Subs",
                codes: [
                  {
                    code: "code",
                    description: "test",
                  },
                ],
              },
            ],
          })
          .end((_err, res) => {
            res.should.status(404);
            res.body.should.have.property("statusCode", 404);
            done();
          });
      });
      it("Correct material code id", (done) => {
        chai
          .request(HOST_URL)
          .put(`/material-code/update/${materialCodeId}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            name: "material code update",
            subs: [
              {
                name: "Subs",
                codes: [
                  {
                    code: "code",
                    description: "test",
                  },
                ],
              },
            ],
          })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
      it("Incorrect payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .put(`/material-code/update/${materialCodeId}-123`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            subs: [
              {
                name: "Subs",
                codes: [
                  {
                    code: "code",
                    description: "test",
                  },
                ],
              },
            ],
          })
          .end((_err, res) => {
            res.should.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
      it("Correct payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .put(`/material-code/update/${materialCodeId}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            name: "material code update",
            subs: [
              {
                name: "Subs",
                codes: [
                  {
                    code: "code",
                    description: "test",
                  },
                ],
              },
            ],
          })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });
  });

  describe("Assign team for project", () => {
    describe("Get list design team profile", () => {
      it("Incorrect design id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/team-profile/design/${design.id}-123`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
      it("Correct design id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/team-profile/design/${design.id}`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });
    describe("Assign team profile", () => {
      it("Incorrect project id", (done) => {
        chai
          .request(HOST_URL)
          .post(`project/${project?.id}/assign-team`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.have.status(404);
            res.body.should.have.property("statusCode", 404);
            done();
          });
      });
      it("Correct project id", (done) => {
        chai
          .request(HOST_URL)
          .post(`/project/${project?.id}/assign-team`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.have.status(404);
            res.body.should.have.property("statusCode", 404);
            done();
          });
      });
    });
  });

  // describe("PDF", () => {
  //   describe("Config PDF", () => {
  //     it("Incorrect project id", (done) => {
  //       chai
  //         .request(HOST_URL)
  //         .post(`/pdf/project/config/{project_id}`)
  //         .set({ Authorization: `Bearer ${designToken}` })
  //         .end((_err, res) => {
  //           res.should.have.status(404);
  //           res.body.should.have.property("statusCode", 404);
  //           done();
  //         });
  //     });
  //   });
  // });

  describe("Project tracking", () => {
    describe("Create project request", () => {
      it("Incorrect payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .post(`/project-tracking/request/create`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            title: "TISC",
            message: "TISC",
            request_for_ids: ["request_for"],
          })
          .end((_err, res) => {
            res.should.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
      it("Correct payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .post(`/project-tracking/request/create`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            product_id: product.id,
            project_id: project.id,
            title: "TISC",
            message: "TISC",
            request_for_ids: ["request_for"],
          })
          .end((_err, res) => {
            tracking = res.body.data;
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });
    describe("Get list project request", () => {
      it("Get list with parameter", (done) => {
        chai
          .request(HOST_URL)
          .get(`/project-tracking/get-list`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
      it("Get list without parameter", (done) => {
        chai
          .request(HOST_URL)
          .get(`/project-tracking/get-list`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });
    describe("Get project tracking detail", () => {
      it("Incorrect project tracking id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/project-tracking/${tracking.id}-123/get-one`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            // res.should.status(500);
            // res.body.should.have.property("statusCode", 500);
            done();
          });
      });
      it("Correct project tracking id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/project-tracking/${tracking.id}/get-one`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            // res.should.status(500);
            // res.body.should.have.property("statusCode", 500);
            done();
          });
      });
    });
    describe("Update project tracking", () => {
      it("Incorrect project tracking id", (done) => {
        chai
          .request(HOST_URL)
          .patch(`/project-tracking/${tracking.id}-123/update`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            priority: "Non",
            assigned_teams: ["string"],
            read_by: ["string"],
          })
          .end((_err, res) => {
            res.should.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
      it("Correct project tracking id", (done) => {
        chai
          .request(HOST_URL)
          .patch(`/project-tracking/${tracking.id}/update`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            priority: "Non",
            assigned_teams: ["string"],
            read_by: ["string"],
          })
          .end((_err, res) => {
            res.should.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
      it("Incorrect project payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .patch(`/project-tracking/${tracking.id}/update`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            read_by: ["string"],
          })
          .end((_err, res) => {
            res.should.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
      it("Correct project payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .patch(`/project-tracking/${tracking.id}/update`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            priority: "Non",
            assigned_teams: ["string"],
            read_by: ["string"],
          })
          .end((_err, res) => {
            res.should.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
    });
  });

  describe("Assign product", () => {
    describe("Get all project", () => {
      it("Correct data response", (done) => {
        chai
          .request(HOST_URL)
          .get(`/project/get-all`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });
    describe("Assign zone", () => {
      it("Incorrect project id & product id", (done) => {
        chai
          .request(HOST_URL)
          .get(
            `/project/${project.id}-123/product/${product.id}-123/assign-zones`
          )
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(404);
            res.body.should.have.property("statusCode", 404);
            done();
          });
      });
      it("Incorrect project id & product id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/project/${project.id}/product/${product.id}/assign-zones`)
          .set({ Authorization: `Bearer ${designToken}` })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
    });

    describe("Assign product", () => {
      it("Incorrect payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .post(`/project/assign-product`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            product_id: "string",
            project_id: "string",
            allocation: ["string"],
          })
          .end((_err, res) => {
            res.should.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
    });
    describe("Assign product", () => {
      it("Correct payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .post(`/project/assign-product`)
          .set({ Authorization: `Bearer ${designToken}` })
          .send({
            entire_allocation: true,
            product_id: "string",
            project_id: "string",
            allocation: ["string"],
          })
          .end((_err, res) => {
            res.should.status(400);
            res.body.should.have.property("statusCode", 400);
            done();
          });
      });
    });
  });

  describe("Delete design location", () => {
    it("Incorrect location id", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/location/delete/${locationId}-123`)
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Incorrect location id", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/location/delete/${locationId}`)
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });

  describe("Delete team profile", () => {
    it("Incorrect design team profile id", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/team-profile/delete/${teamProfileId}-123`)
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Correct design team profile id", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/team-profile/delete/${teamProfileId}`)
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });

  describe("Delete material code", () => {
    it("Incorrect material code id ", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/material-code/delete/${materialCodeId}-123`)
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.status(404);
          res.body.should.have.property("statusCode", 404);
          done();
        });
    });
    it("Correct material code id", (done) => {
      chai
        .request(HOST_URL)
        .delete(`/material-code/delete/${materialCodeId}`)
        .set({ Authorization: `Bearer ${designToken}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });
});
