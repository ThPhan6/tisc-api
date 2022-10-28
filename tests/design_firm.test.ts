import { insertTempData, removeByKeys } from './helpers/database.helper';
import {signJwtToken} from '../src/helper/jwt.helper';
import { imageTest_4 } from './temp-files/image.test';

import {brandData, brandLocationData, userBrandData, brandDistributorData} from "./temp-data/brand";
import {productData} from "./temp-data/product";
import {generalData, featureData, specificationData} from "./temp-data/attribute";
import {optionData, conversionData} from "./temp-data/basis";
import {categoryData} from "./temp-data/category";
import {collectionData} from "./temp-data/collection";
import {projectData, zonesData} from "./temp-data/project";
import {designFirmData, designFirmLocationData, userDesignFirmData} from "./temp-data/design-firm";
import {apiService} from './helpers/api.helper';

describe("Design Firm", () => {
  let locationId = '';
  let teamProfileId = '';
  let materialCodeId = '';
  let projectProductId = '';
  let template_id = '';
  let brand = {
    company: {},
    location: {},
    distributor: {},
    user: {},
    token: ""
  } as any
  let design = {
    company: {},
    location: {},
    user: {},
    token: ""
  } as any;
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
  } as any;
  let project = {
    data: {},
    zones: {},
  } as any


  before(async () => {
    /// = BRAND
    brand.company = await insertTempData('brands', brandData);
    brand.location = await insertTempData('locations', brandLocationData);
    brand.distributor = await insertTempData('distributors', brandDistributorData);
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
    await removeByKeys('distributors', [brand.distributor._key]);
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
      it("Incorrect design id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .patch(
            `/design/office-profile/${design.company.id}-123`,
            {
              name: "Testing 4",
              parent_company: "TISC",
              logo: imageTest_4,
              slogan: "TISC",
              profile_n_philosophy: "TISC",
              official_website: "https://tisc.enabledemo.com",
              capabilities: ["capability"],
            }
          )).shouldError();
      });
      it("Correct design id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .patch(
            `/design/office-profile/${design.company.id}`,
            {
              name: "Testing 4",
              parent_company: "TISC",
              logo: imageTest_4,
              slogan: "TISC",
              profile_n_philosophy: "TISC",
              official_website: "https://tisc.enabledemo.com",
              capabilities: ["capability"],
            }
          )).shouldSuccess();
      });
      it("Incorrect logo", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .patch(`/design/office-profile/${design.company.id}`, {
            name: "Testing 4",
            parent_company: "TISC",
            logo: "TISC logo",
            slogan: "TISC",
            profile_n_philosophy: "TISC",
            official_website: "https://tisc.enabledemo.com",
            capabilities: ["capability"],
          })
        ).shouldError();
      });
      it("Correct logo", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .patch(`/design/office-profile/${design.company.id}`, {
            name: "Testing 4",
            parent_company: "TISC",
            logo: imageTest_4,
            slogan: "TISC",
            profile_n_philosophy: "TISC",
            official_website: "https://tisc.enabledemo.com",
            capabilities: ["capability"],
          })
        ).shouldSuccess();
      });
    });
  });

  describe("Location", () => {
    describe("Create design location", async () => {
      it("Incorrect payload inputs", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .post(`/location/create`, {
            functional_type_ids: ["string"],
            country_id: "string",
            state_id: "string",
            city_id: "string",
            address: "string",
            postal_code: "string",
            general_phone: "string",
            general_email: "string",
          })
        ).shouldError();
      });
      it("Correct payload inputs", async () => {
        const response = await apiService.getInstance()
          .setToken(design.token)
          .post(`/location/create`, {
            business_name: "DESIGN FIRM TESTING",
            business_number: "DESIGN FIRM TESTING",
            functional_type_ids: ["DESIGN FIRM TESTING"],
            country_id: "233",
            state_id: "1456",
            city_id: "110968",
            address: "string",
            postal_code: "5000",
            general_phone: "0123123123",
            general_email: "unittest@gmail.com",
          });
        locationId = response.get('id');
        response.shouldSuccess();
      });
    });

    describe("Get list", () => {
      it("Get list with parameter", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/location/get-list?page=1&pageSize=10`)
        ).shouldSuccess();
      });
      it("Get list without parameter", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/location/get-list`)
        ).shouldSuccess();
      });
    });

    describe("Get design location detail", () => {
      it("Incorrect location id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/location/get-one/${locationId}-123`)
        ).shouldError(404);
      });
      it("Correct location id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/location/get-one/${locationId}`)
        ).shouldSuccess();
      });
    });

    describe("Update design location", () => {
      it("Incorrect location id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .put(`/location/update/${locationId}-123`, {
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
        ).shouldError(404);
      });
      it("Incorrect payload inputs", async () => {

        (await apiService.getInstance()
          .setToken(design.token)
          .put(`/location/update/${locationId}`, {
            functional_type_ids: ["string"],
            country_id: "string",
            state_id: "string",
            city_id: "string",
            address: "string",
            postal_code: "string",
            general_phone: "string",
            general_email: "string",
          })
        ).shouldError();
      });

      it("Correct location id and payload", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .put(`/location/update/${locationId}`, {
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
        ).shouldSuccess();
      });

    });
  });

  describe("Team profile", () => {
    describe("Create design team profile", () => {
      it("Incorrect payload inputs", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .post(`/team-profile/create`,  {
            position: "string",
            email: "string",
            phone: "string",
            mobile: "string",
            role_id: "string",
          })
        ).shouldError();
      });
      it("Correct payload inputs", async () => {
        const response = (await apiService.getInstance()
          .setToken(design.token)
          .post(`/team-profile/create`,  {
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
        );
        teamProfileId = response.get('id');
        response.shouldSuccess();
      });
    });

    describe("Get list team profile", () => {
      it("Get list with parameter", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/team-profile/get-list?page=1&pageSize=10`)
        ).shouldSuccess();
      });
      it("Get list without parameter", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/team-profile/get-list`)
        ).shouldSuccess();
      });
    });

    describe("Get team profile detail", () => {
      it("Incorrect design team profile id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/team-profile/get-one/${teamProfileId}-123`)
        ).shouldError();
      });
      it("Correct design team profile id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/team-profile/get-one/${teamProfileId}`)
        ).shouldSuccess();
      });
    });

    describe("Update team profile", () => {
      it("Incorrect design team profile id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .post(`/team-profile/update/${teamProfileId}-123`, {
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
        ).shouldError(404);
      });
      it("Correct design team profile id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .post(`/team-profile/update/${teamProfileId}`, {
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
        ).shouldSuccess();
      });
      it("Incorrect payload inputs", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .post(`/team-profile/update/${teamProfileId}`, {
            department_id: "test",
            position: "CEO",
            email: "tisc-update@yopmail.com",
            phone: "1231231231",
            mobile: "1231231231",
            role_id: "1493b47a-1118-43e2-9bd8-1a3c3adc3f13",
          })
        ).shouldError();
      });
    });
  });

  describe("Material/Product Code", () => {
    describe("Create material code", () => {
      it("Incorrect payload inputs", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .post(`/material-code/create`, {
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
        ).shouldError();
    });

    it("Correct payload inputs", async () => {
      const response = (await apiService.getInstance()
        .setToken(design.token)
        .post(`/material-code/create`, {
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
      );
      materialCodeId = response.get('id');
      response.shouldSuccess();
    });

    describe("Get list material code", () => {
      it("Get list with parameter ", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/material-code/get-list?page=1&pageSize=10`)
        ).shouldSuccess();
      });
      it("Get list without parameter ", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/material-code/get-list`)
        ).shouldSuccess();
      });
    });

    describe("Get material code detail", () => {
      it("Incorrect material code id ", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/material-code/get-one/${materialCodeId}-123`)
        ).shouldError(404);
      });
      it("Correct material code id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/material-code/get-one/${materialCodeId}`)
        ).shouldSuccess();
      });
    });

    describe("Update material code", () => {
      it("Incorrect material code id ", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .put(`/material-code/update/${materialCodeId}-123`, {
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
        ).shouldError(404);
      });
      it("Correct material code id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .put(`/material-code/update/${materialCodeId}`, {
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
        ).shouldSuccess();
      });
      it("Incorrect payload inputs", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .put(`/material-code/update/${materialCodeId}`, {
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
        ).shouldError();
      });
    });
  });
  });

  describe("Assign team for project", () => {
    describe("Get list design team profile", () => {
      it("Incorrect design id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/team-profile/design/${design.company.id}-123`)
        ).shouldSuccess();
      });
      it("Correct design id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/team-profile/design/${design.company.id}`)
        ).shouldSuccess();
      });
    });
    describe("Assign team profile", () => {
      it("Incorrect project id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .patch(`/project/${project.data.id}-123/assign-team`, {
            team_profile_ids: [teamProfileId]
          })
        ).shouldError(404);
      });
      it("Correct project id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .patch(`/project/${project.data.id}/assign-team`, {
            team_profile_ids: [teamProfileId]
          })
        ).shouldSuccess();
      });
    });
  });
  //
  describe("Assign product", () => {
    describe("Get all project", () => {
      it("Correct data response", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/project/get-all`)
        ).shouldSuccess();
      });
    });
    describe("Project Assigned zone", () => {
      it("Incorrect project id & product id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(
            `/project/${project.data.id}-123/product/${product.data.id}-123/assign-zones`
          )
        ).shouldError(404);
      });
      it("Correct project id & product id", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(
            `/project/${project.data.id}/product/${product.data.id}/assign-zones`
          )
        ).shouldSuccess();
      });
    });

    describe("Assign product", () => {
      it("Incorrect payload inputs", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .post(`/project/assign-product`, {
            product_id: "string",
            project_id: "string",
            allocation: ["string"],
          })
        ).shouldError(400);
      });
    });
    describe("Assign product", () => {
      it("Correct payload inputs", async () => {
        const response = (await apiService.getInstance()
          .setToken(design.token)
          .post(`/project/assign-product`, {
            entire_allocation: true,
            product_id: product.data.id,
            project_id: project.data.id,
            allocation: ["PROJECT-ZONE-ROOM-1"],
          })
        );
        projectProductId = response.get('id');
        response.shouldSuccess();
      });
      it("Product Already Assigned to Project", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .post(`/project/assign-product`, {
            entire_allocation: true,
            product_id: product.data.id,
            project_id: project.data.id,
            allocation: ["PROJECT-ZONE-ROOM-1"],
          })
        ).shouldError(400);
      });

      it("Update project product consider status to Unlisted", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .patch(`/project-product/${projectProductId}/update-consider-status`, {
            consider_status: 2 /// unlisted
          })
        ).shouldSuccess();
      });

      it("Update project product consider status to re-consider", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .patch(`/project-product/${projectProductId}/update-consider-status`, {
            consider_status: 1 /// re-consider
          })
        ).shouldSuccess();
      });

      it("Get List Considered Products", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/project/${project.data.id}/considered-product/get-list?page=1&pageSize=999999999999`)
        ).shouldSuccess();
      });

      it("Specify product", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .patch(`/project-product/${projectProductId}/update-specify`, {
            "specification": {
              "is_refer_document": false,
              "attribute_groups": [
                {
                  "id": "SPECIFICATION-XXXX-XXXX",
                  "attributes": [
                    {
                      "id": "OPTION-ATTRIBUTE-XXXX-XXXX",
                      "basis_option_id": "OPTION-CODE-1-XXXX-XXXX"
                    }
                  ]
                }
              ]
            },
            "brand_location_id": brand.location.id,
            "distributor_location_id": brand.distributor.id,
            "entire_allocation": false,
            "allocation": [
              "PROJECT-ZONE-ROOM-1"
            ],
            "material_code_id": materialCodeId,
            "suffix_code": "SC",
            "description": "Test Specify",
            "quantity": 1,
            "unit_type_id": "Unit Type",
            "order_method": 0,
            "requirement_type_ids": [
              "requirement_type_ids"
            ],
            "instruction_type_ids": [
              "instruction_type_ids"
            ],
            "special_instructions": "string",
            "finish_schedules": [
              {
                "floor": true,
                "base": {
                  "ceiling": true,
                  "floor": true
                },
                "front_wall": true,
                "left_wall": true,
                "back_wall": true,
                "right_wall": true,
                "ceiling": true,
                "door": {
                  "frame": true,
                  "panel": true
                },
                "cabinet": {
                  "carcass": true,
                  "door": true
                }
              }
            ]
          })
        ).shouldSuccess();
      });

      it("Update project product specify status to cancel", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .patch(`/project-product/${projectProductId}/update-specified-status`, {
            specified_status: 2 /// cancel
          })
        ).shouldSuccess();
      });

      it("Get Specify Config Product", async () => {
        const response = await apiService.getInstance()
          .setToken(design.token)
          .get(`/pdf/project/config/${project.data.id}`);
        template_id = response.get('templates').specification[0].items[0].id;
        response.shouldSuccess();
      });

      it("Get Specify Products by brand", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/project-product/get-list-by-brand/${project.data.id}?page=1&pageSize=999999999999`)
        ).shouldSuccess();
      });
      it("Get Specify Products by Material", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/project-product/get-list-by-material/${project.data.id}?page=1&pageSize=999999999999`)
        ).shouldSuccess();
      });
      it("Get Specify Products by Space", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .get(`/project-product/get-list-by-zone/${project.data.id}?page=1&pageSize=999999999999`)
        ).shouldSuccess();
      });

      it("Generate Project Specify PDF", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .post(`/pdf/project/${project.data.id}/generate`, {
            "location_id": "LOCATION-DESIGN-FIRM-XXXX-XXXX",
            "issuing_for_id": "Testing",
            "issuing_date": "2022-10-10",
            "revision": "string",
            "has_cover": true,
            "document_title": "string",
            "template_ids": [ template_id ]
          })
        ).shouldSuccess();
      });

      it("Remove Assigned Product", async () => {
        (await apiService.getInstance()
          .setToken(design.token)
          .delete(`/project-product/${projectProductId}/delete`)
        ).shouldSuccess();
      });
    });
  });

  describe("Delete design location", () => {
    it("Incorrect location id", async () => {
      (await apiService.getInstance()
        .setToken(design.token)
        .delete(`/location/delete/${locationId}-123`)
      ).shouldError(404);
    });
    it("Incorrect location id", async () => {
      (await apiService.getInstance()
        .setToken(design.token)
        .delete(`/location/delete/${locationId}`)
      ).shouldSuccess();
    });
  });

  describe("Delete team profile", () => {
    it("Incorrect design team profile id", async () => {
      (await apiService.getInstance()
        .setToken(design.token)
        .delete(`/team-profile/delete/${teamProfileId}-123`)
      ).shouldError(404);
    });
    it("Correct design team profile id", async () => {
      (await apiService.getInstance()
        .setToken(design.token)
        .delete(`/team-profile/delete/${teamProfileId}`)
      ).shouldSuccess();
    });
  });

  describe("Delete material code", () => {
    it("Incorrect material code id ", async () => {
      (await apiService.getInstance()
        .setToken(design.token)
        .delete(`/material-code/delete/${materialCodeId}-123`)
      ).shouldError(404);
    });
    it("Correct material code id", async () => {
      (await apiService.getInstance()
        .setToken(design.token)
        .delete(`/material-code/delete/${materialCodeId}`)
      ).shouldSuccess();
    });
  });
});
