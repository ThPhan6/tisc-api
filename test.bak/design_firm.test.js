const {
  chaiResponse,
  chai,
  chaiHttp,
  should,
  HOST_URL,
  Database,
  db,
  insertTempData,
  removeByKeys,
  signJwtToken,
} = require("./utils/utils");

const { imageTest_4 } = require("./test_files/image.test");
const helperCommon = require("./helper/common");

const {brandData, brandLocationData, userBrandData} = require("./temp-data/brand.js");
const {productData} = require("./temp-data/product.js");
const {generalData, featureData, specificationData} = require("./temp-data/attribute.js");
const {optionData, conversionData} = require("./temp-data/basis.js");
const {categoryData} = require("./temp-data/category.js");
const {collectionData} = require("./temp-data/collection.js");
const {projectData, zonesData} = require("./temp-data/project.js");
const {designFirmData, designFirmLocationData, userDesignFirmData} = require("./temp-data/design-firm.js");


describe("Design Firm", () => {
  let locationId;
  let teamProfileId;
  let materialCodeId;
  let tracking;
  let brand = {
    company: {},
    location: {},
    user: {},
    token: ""
  }
  let design = {
    company: {},
    location: {},
    user: {},
    token: ""
  }
  let product = {
    data: {},
    category: {},
    collection: {},
    attribute: {
      general: {},
      feature: {},
      specification: {},
    },
    basis: {
      option: {},
      conversion: {}
    },
  }
  let project = {
    data: {},
    zones: {},
  }


  before(async () => {
    /// = BRAND
    brand.company = await insertTempData('brands', brandData);
    brand.location = await insertTempData('locations', brandLocationData);
    brand.user = await insertTempData('users', userBrandData);
    brand.token = signJwtToken(brand.user.id);
    /// DESIGN FIRM
    design.company = await insertTempData('designers', designFirmData);
    design.location = await insertTempData('locations', designFirmLocationData);
    design.user = await insertTempData('users', userDesignFirmData);
    design.token = signJwtToken(design.user.id);
    /// PRODUCT
    product.data = await insertTempData('products', productData);
    product.category = await insertTempData('categories', categoryData);
    product.collection = await insertTempData('collections', collectionData);
    product.attribute.general = await insertTempData('attributes', generalData);
    product.attribute.feature = await insertTempData('attributes', featureData);
    product.attribute.specification = await insertTempData('attributes', specificationData);
    product.basis.option = await insertTempData('bases', optionData);
    product.basis.conversion = await insertTempData('bases', conversionData);
    // PROJECT
    project.data = await insertTempData('projects', projectData);
    project.zones = await insertTempData('project_zones', zonesData);
    //
  });

  after(async () => {
    ///
    await removeByKeys('brands', [brand.company._key]);
    await removeByKeys('designers', [design.company._key]);
    ///
    await removeByKeys('locations', [brand.location._key, design.location._key]);
    await removeByKeys('users', [brand.user._key, design.user._key]);

    await removeByKeys('products', [product.data._key]);
    await removeByKeys('categories', [product.category._key]);
    await removeByKeys('collections', [product.collection._key]);
    await removeByKeys('attributes', [
      product.attribute.general._key,
      product.attribute.feature._key,
      product.attribute.specification._key,
    ]);
    await removeByKeys('bases', [
      product.basis.option._key,
      product.basis.conversion._key,
    ]);
    await removeByKeys('projects', [project.data._key]);
    await removeByKeys('project_zones', [project.zones._key]);
  });


  describe("Office Profile", () => {
    describe("Update design office profile", () => {
      it("Incorrect design id", (done) => {
        chai
          .request(HOST_URL)
          .patch(`/design/office-profile/${design.company.id}-123`)
          .set({ Authorization: `Bearer ${design.token}` })
          .send({
            name: "Testing 4",
            parent_company: "TISC",
            logo: imageTest_4,
            slogan: "TISC",
            profile_n_philosophy: "TISC",
            official_website: "https://tisc.enabledemo.com",
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
          .patch(`/design/office-profile/${design.company.id}`)
          .set({ Authorization: `Bearer ${design.token}` })
          .send({
            name: "Testing 4",
            parent_company: "TISC",
            logo: imageTest_4,
            slogan: "TISC",
            profile_n_philosophy: "TISC",
            official_website: "https://tisc.enabledemo.com",
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
          .patch(`/design/office-profile/${design.company.id}`)
          .set({ Authorization: `Bearer ${design.token}` })
          .send({
            name: "Testing 4",
            parent_company: "TISC",
            logo: "TISC logo",
            slogan: "TISC",
            profile_n_philosophy: "TISC",
            official_website: "https://tisc.enabledemo.com",
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
          .patch(`/design/office-profile/${design.company.id}`)
          .set({ Authorization: `Bearer ${design.token}` })
          .send({
            name: "Testing 4",
            parent_company: "TISC",
            logo: imageTest_4,
            slogan: "TISC",
            profile_n_philosophy: "TISC",
            official_website: "https://tisc.enabledemo.com",
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .get(`/team-profile/design/${design.company.id}-123`)
          .set({ Authorization: `Bearer ${design.token}` })
          .end((_err, res) => {
            res.should.have.status(200);
            res.body.should.have.property("statusCode", 200);
            done();
          });
      });
      it("Correct design id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/team-profile/design/${design.company.id}`)
          .set({ Authorization: `Bearer ${design.token}` })
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
          .post(`project/${project.data.id}/assign-team`)
          .set({ Authorization: `Bearer ${design.token}` })
          .end((_err, res) => {
            res.should.have.status(404);
            res.body.should.have.property("statusCode", 404);
            done();
          });
      });
      it("Correct project id", (done) => {
        chai
          .request(HOST_URL)
          .post(`/project/${project.data.id}/assign-team`)
          .set({ Authorization: `Bearer ${design.token}` })
          .end((_err, res) => {
            res.should.have.status(404);
            res.body.should.have.property("statusCode", 404);
            done();
          });
      });
    });
  });

  describe("Project tracking", () => {
    describe("Create project request", () => {
      it("Incorrect payload inputs", (done) => {
        chai
          .request(HOST_URL)
          .post(`/project-tracking/request/create`)
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
          .send({
            product_id: product.data.id,
            project_id: project.data.id,
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
            `/project/${project.data.id}-123/product/${product.data.id}-123/assign-zones`
          )
          .set({ Authorization: `Bearer ${design.token}` })
          .end((_err, res) => {
            res.should.status(404);
            res.body.should.have.property("statusCode", 404);
            done();
          });
      });
      it("Incorrect project id & product id", (done) => {
        chai
          .request(HOST_URL)
          .get(`/project/${project.data.id}/product/${product.data.id}/assign-zones`)
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
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
          .set({ Authorization: `Bearer ${design.token}` })
          .send({
            entire_allocation: true,
            product_id: product.data.id,
            project_id: project.data.id,
            allocation: [""],
          })
          .end((_err, res) => {
            res.should.status(200);
            res.body.should.have.property("statusCode", 200);
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
        .set({ Authorization: `Bearer ${design.token}` })
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
        .set({ Authorization: `Bearer ${design.token}` })
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
        .set({ Authorization: `Bearer ${design.token}` })
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
        .set({ Authorization: `Bearer ${design.token}` })
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
        .set({ Authorization: `Bearer ${design.token}` })
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
        .set({ Authorization: `Bearer ${design.token}` })
        .end((_err, res) => {
          res.should.status(200);
          res.body.should.have.property("statusCode", 200);
          done();
        });
    });
  });
});
