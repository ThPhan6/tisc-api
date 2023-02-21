import { connection } from "@/Database/Connections/ArangoConnection";
import { signJwtToken } from "@/helpers/jwt.helper";
import { imageTest_4 } from "./temp-files/image.test";

import {
  brandData,
  brandLocationData,
  userBrandData,
  brandDistributorData,
} from "./temp-data/brand";
import { productData } from "./temp-data/product";
import {
  generalData,
  featureData,
  specificationData,
} from "./temp-data/attribute";
import { optionData, conversionData } from "./temp-data/basis";
import { categoryData } from "./temp-data/category";
import { collectionData } from "./temp-data/collection";
import { projectData, zonesData } from "./temp-data/project";
import {
  designFirmData,
  designFirmLocationData,
  userDesignFirmData,
} from "./temp-data/design-firm";
import { apiService } from "./helpers/api.helper";
import { ROUTES } from "../src/constants/route.constant";
import {
  ProductConsiderStatus,
  ProductSpecifyStatus,
} from "../src/api/project_product/project_product.type";

import { expect } from "chai";

describe("Design Firm", () => {
  let locationId = "";
  let teamProfileId = "";
  let materialCodeId = "";
  let projectProductId = "";
  let template_id = "";
  let trackingConsiderNotification = "";
  let brand = {
    company: {},
    location: {},
    distributor: {},
    user: {},
    token: "",
  } as any;
  let design = {
    company: {},
    location: {},
    user: {},
    token: "",
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
      conversion: {},
    },
  } as any;
  let project = {
    data: {},
    zones: {},
  } as any;

  before(async () => {
    /// = BRAND
    brand.company = await connection.insert("brands", brandData);
    brand.location = await connection.insert("locations", brandLocationData);
    brand.distributor = await connection.insert(
      "distributors",
      brandDistributorData
    );
    brand.user = await connection.insert("users", userBrandData);
    brand.token = signJwtToken(brand.user.id);
    /// DESIGN FIRM
    design.company = await connection.insert("designers", designFirmData);
    design.location = await connection.insert("locations", designFirmLocationData);
    design.user = await connection.insert("users", userDesignFirmData);
    design.token = signJwtToken(design.user.id);
    /// PRODUCT
    product.data = await connection.insert("products", productData);
    product.category = await connection.insert("categories", categoryData);
    product.collection = await connection.insert("collections", collectionData);
    product.attribute.general = await connection.insert("attributes", generalData);
    product.attribute.feature = await connection.insert("attributes", featureData);
    product.attribute.specification = await connection.insert(
      "attributes",
      specificationData
    );
    product.basis.option = await connection.insert("bases", optionData);
    product.basis.conversion = await connection.insert("bases", conversionData);
    // PROJECT
    project.data = await connection.insert("projects", projectData);
    project.zones = await connection.insert("project_zones", zonesData);
    //
  });

  after(async () => {
    ///
    await connection.removeByKeys("brands", [brand.company._key]);
    await connection.removeByKeys("designers", [design.company._key]);
    await connection.removeByKeys("distributors", [brand.distributor._key]);
    ///
    await connection.removeByKeys("locations", [
      brand.location._key,
      design.location._key,
    ]);
    await connection.removeByKeys("users", [brand.user._key, design.user._key]);

    await connection.removeByKeys("products", [product.data._key]);
    await connection.removeByKeys("categories", [product.category._key]);
    await connection.removeByKeys("collections", [product.collection._key]);
    await connection.removeByKeys("attributes", [
      product.attribute.general._key,
      product.attribute.feature._key,
      product.attribute.specification._key,
    ]);
    await connection.removeByKeys("bases", [
      product.basis.option._key,
      product.basis.conversion._key,
    ]);
    await connection.removeByKeys("projects", [project.data._key]);
    await connection.removeByKeys("project_zones", [project.zones._key]);
  });

  describe("Office Profile", () => {
    describe("Update design office profile", () => {
      it("Incorrect design id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .patch(`/api/design/office-profile/${design.company.id}-123`, {
              name: "Testing 4",
              parent_company: "TISC",
              logo: imageTest_4,
              slogan: "TISC",
              profile_n_philosophy: "TISC",
              official_website: "https://tisc.enabledemo.com",
              capabilities: ["capability"],
            })
        ).shouldError();
      });
      it("Correct design id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .patch(`/api/design/office-profile/${design.company.id}`, {
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
      it("Incorrect logo", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .patch(`/api/design/office-profile/${design.company.id}`, {
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
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .patch(`/api/design/office-profile/${design.company.id}`, {
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
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/location/create`, {
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
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .post(`/api/location/create`, {
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
        locationId = response.get("id");
        response.shouldSuccess();
      });
    });

    describe("Get list", () => {
      it("Get list with parameter", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/location/get-list?page=1&pageSize=10`)
        ).shouldSuccess();
      });
      it("Get list without parameter", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/location/get-list`)
        ).shouldSuccess();
      });
    });

    describe("Get design location detail", () => {
      it("Incorrect location id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/location/get-one/${locationId}-123`)
        ).shouldError(404);
      });
      it("Correct location id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/location/get-one/${locationId}`)
        ).shouldSuccess();
      });
    });

    describe("Update design location", () => {
      it("Incorrect location id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .put(`/api/location/update/${locationId}-123`, {
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
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .put(`/api/location/update/${locationId}`, {
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
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .put(`/api/location/update/${locationId}`, {
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
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/team-profile/create`, {
              position: "string",
              email: "string",
              phone: "string",
              mobile: "string",
              role_id: "string",
            })
        ).shouldError();
      });
      it("Correct payload inputs", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .post(`/api/team-profile/create`, {
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
          });
        teamProfileId = response.get("id");
        response.shouldSuccess();
      });
    });

    describe("Get list team profile", () => {
      it("Get list with parameter", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/team-profile/get-list?page=1&pageSize=10`)
        ).shouldSuccess();
      });
      it("Get list without parameter", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/team-profile/get-list`)
        ).shouldSuccess();
      });
    });

    describe("Get team profile detail", () => {
      it("Incorrect design team profile id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/team-profile/get-one/${teamProfileId}-123`)
        ).shouldError();
      });
      it("Correct design team profile id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/team-profile/get-one/${teamProfileId}`)
        ).shouldSuccess();
      });
    });

    describe("Update team profile", () => {
      it("Incorrect design team profile id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/team-profile/update/${teamProfileId}-123`, {
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
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/team-profile/update/${teamProfileId}`, {
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
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/team-profile/update/${teamProfileId}`, {
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
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/material-code/create`, {
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
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .post(`/api/material-code/create`, {
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
          });
        materialCodeId = response.get("id");
        response.shouldSuccess();
      });

      describe("Get list material code", () => {
        it("Get list with parameter ", async () => {
          (
            await apiService
              .getInstance()
              .setToken(design.token)
              .get(`/api/material-code/get-list?page=1&pageSize=10`)
          ).shouldSuccess();
        });
        it("Get list without parameter ", async () => {
          (
            await apiService
              .getInstance()
              .setToken(design.token)
              .get(`/api/material-code/get-list`)
          ).shouldSuccess();
        });
      });

      describe("Get material code detail", () => {
        it("Incorrect material code id ", async () => {
          (
            await apiService
              .getInstance()
              .setToken(design.token)
              .get(`/api/material-code/get-one/${materialCodeId}-123`)
          ).shouldError(404);
        });
        it("Correct material code id", async () => {
          (
            await apiService
              .getInstance()
              .setToken(design.token)
              .get(`/api/material-code/get-one/${materialCodeId}`)
          ).shouldSuccess();
        });
      });

      describe("Update material code", () => {
        it("Incorrect material code id ", async () => {
          (
            await apiService
              .getInstance()
              .setToken(design.token)
              .put(`/api/material-code/update/${materialCodeId}-123`, {
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
          (
            await apiService
              .getInstance()
              .setToken(design.token)
              .put(`/api/material-code/update/${materialCodeId}`, {
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
          (
            await apiService
              .getInstance()
              .setToken(design.token)
              .put(`/api/material-code/update/${materialCodeId}`, {
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
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/team-profile/design/${design.company.id}-123`)
        ).shouldSuccess();
      });
      it("Correct design id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/team-profile/design/${design.company.id}`)
        ).shouldSuccess();
      });
    });
    describe("Assign team profile", () => {
      it("Incorrect project id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .patch(`/api/project/${project.data.id}-123/assign-team`, {
              team_profile_ids: [teamProfileId],
            })
        ).shouldError(404);
      });
      it("Correct project id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .patch(`/api/project/${project.data.id}/assign-team`, {
              team_profile_ids: [teamProfileId],
            })
        ).shouldSuccess();

        console.log("project.data.id", project.data.id);
      });
    });
  });
  //
  describe("Assign product", () => {
    describe("Get all project", () => {
      it("Correct data response", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/project/get-all`)
        ).shouldSuccess();
      });
    });
    describe("Project Assigned zone", () => {
      it("Incorrect project id & product id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project/${project.data.id}-123/product/${product.data.id}-123/assign-zones`
            )
        ).shouldError(404);
      });
      it("Correct project id & product id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project/${project.data.id}/product/${product.data.id}/assign-zones`
            )
        ).shouldSuccess();
      });
    });
    describe("Assign product", () => {
      it("Incorrect payload inputs", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/project/assign-product`, {
              product_id: "string",
              project_id: "string",
              allocation: ["string"],
            })
        ).shouldError(400);
      });
    });
    describe("Project Considered", () => {
      it("Correct payload inputs", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .post(`/api/project/assign-product`, {
            entire_allocation: true,
            product_id: product.data.id,
            project_id: project.data.id,
            allocation: ["PROJECT-ZONE-ROOM-1"],
          });
        projectProductId = response.get("id");
        const projectTrackingId = response.get("project_tracking_id");
        const projectTrackingNotificationId = response.get("notification_id");
        trackingConsiderNotification = projectTrackingNotificationId;
        response.shouldSuccess();
        const newTracking = await apiService
          .getInstance()
          .setToken(brand.token)
          .get(
            ROUTES.PROJECT_TRACKING.GET_ONE.replace("{id}", projectTrackingId)
          );
        newTracking.shouldSuccess();
        expect(
          newTracking
            .get()
            .notifications.some(
              (el: any) => el.id === projectTrackingNotificationId
            ),
          "Project tracking notifification not created"
        ).to.be.true;
      });

      describe("Create action task for a consider product tracking notification", () => {
        it("Incorrect payload inputs", async () => {
          (
            await apiService
              .getInstance()
              .setToken(brand.token)
              .post(ROUTES.ACTION_TASK.CREATE, {
                common_type_ids: ["Some action"],
              })
          ).shouldError();
        });
        it("Correct payload inputs", async () => {
          const response = await apiService
            .getInstance()
            .setToken(brand.token)
            .post(ROUTES.ACTION_TASK.CREATE, {
              common_type_ids: ["Some action"],
              model_id: trackingConsiderNotification,
              model_name: "notification",
            });
          response.shouldSuccess(true);
        });
      });

      it("Product Already Assigned to Project", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/project/assign-product`, {
              entire_allocation: true,
              product_id: product.data.id,
              project_id: project.data.id,
              allocation: ["PROJECT-ZONE-ROOM-1"],
            })
        ).shouldError(400);
      });

      it("Update project product consider status to Unlisted", async () => {
        const response = (
          await apiService
            .getInstance()
            .setToken(design.token)
            .patch(
              `/api/project-product/${projectProductId}/update-consider-status`,
              {
                consider_status: ProductConsiderStatus.Unlisted, /// unlisted
              }
            )
        ).shouldSuccess();

        const projectTrackingId = response.get("project_tracking_id");
        const projectTrackingNotificationId = response.get("notification_id");
        response.shouldSuccess();
        const newTracking = await apiService
          .getInstance()
          .setToken(brand.token)
          .get(
            ROUTES.PROJECT_TRACKING.GET_ONE.replace("{id}", projectTrackingId)
          );
        newTracking.shouldSuccess();
        expect(
          newTracking
            .get()
            .notifications.some(
              (el: any) => el.id === projectTrackingNotificationId
            ),
          "Project tracking notifification not created"
        ).to.be.true;
      });

      it("Update project product consider status to re-consider", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .patch(
            `/api/project-product/${projectProductId}/update-consider-status`,
            {
              consider_status: ProductConsiderStatus["Re-considered"], /// re-consider
            }
          );

        const projectTrackingId = response.get("project_tracking_id");
        const projectTrackingNotificationId = response.get("notification_id");
        response.shouldSuccess();
        const newTracking = await apiService
          .getInstance()
          .setToken(brand.token)
          .get(
            ROUTES.PROJECT_TRACKING.GET_ONE.replace("{id}", projectTrackingId)
          );
        newTracking.shouldSuccess();
        expect(
          newTracking
            .get()
            .notifications.some(
              (el: any) => el.id === projectTrackingNotificationId
            ),
          "Project tracking notifification not created"
        ).to.be.true;
      });

      it("Get List Considered Products", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project/${project.data.id}/considered-product/get-list?page=1&pageSize=999999999999`
            )
        ).shouldSuccess();
      });

      it("Specify product", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .patch(`/api/project-product/${projectProductId}/update-specify`, {
            specification: {
              is_refer_document: false,
              attribute_groups: [
                {
                  id: "SPECIFICATION-XXXX-XXXX",
                  attributes: [
                    {
                      id: "OPTION-ATTRIBUTE-XXXX-XXXX",
                      basis_option_id: "OPTION-CODE-1-XXXX-XXXX",
                    },
                  ],
                },
              ],
            },
            brand_location_id: brand.location.id,
            distributor_location_id: brand.distributor.id,
            entire_allocation: false,
            allocation: ["PROJECT-ZONE-ROOM-1"],
            material_code_id: materialCodeId,
            suffix_code: "SC",
            description: "Test Specify",
            quantity: 1,
            unit_type_id: "Unit Type",
            order_method: 0,
            requirement_type_ids: ["requirement_type_ids"],
            instruction_type_ids: ["instruction_type_ids"],
            special_instructions: "string",
            finish_schedules: [
              {
                floor: true,
                base: {
                  ceiling: true,
                  floor: true,
                },
                front_wall: true,
                left_wall: true,
                back_wall: true,
                right_wall: true,
                ceiling: true,
                door: {
                  frame: true,
                  panel: true,
                },
                cabinet: {
                  carcass: true,
                  door: true,
                },
              },
            ],
          });

        const projectTrackingId = response.get("project_tracking_id");
        const projectTrackingNotificationId = response.get("notification_id");
        response.shouldSuccess();
        const newTracking = await apiService
          .getInstance()
          .setToken(brand.token)
          .get(
            ROUTES.PROJECT_TRACKING.GET_ONE.replace("{id}", projectTrackingId)
          );
        newTracking.shouldSuccess();
        expect(
          newTracking
            .get()
            .notifications.some(
              (el: any) => el.id === projectTrackingNotificationId
            ),
          "Project tracking notifification not created"
        ).to.be.true;
      });

      it("Update project product specify status to cancel", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .patch(
            `/api/project-product/${projectProductId}/update-specified-status`,
            {
              specified_status: ProductSpecifyStatus.Cancelled,
            }
          );

        const projectTrackingId = response.get("project_tracking_id");
        const projectTrackingNotificationId = response.get("notification_id");
        response.shouldSuccess();
        const newTracking = await apiService
          .getInstance()
          .setToken(brand.token)
          .get(
            ROUTES.PROJECT_TRACKING.GET_ONE.replace("{id}", projectTrackingId)
          );
        newTracking.shouldSuccess();
        expect(
          newTracking
            .get()
            .notifications.some(
              (el: any) => el.id === projectTrackingNotificationId
            ),
          "Project tracking notifification not created"
        ).to.be.true;
      });

      it("Get Specify Config Product", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .get(`/api/pdf/project/config/${project.data.id}`);
        template_id = response.get("templates").specification[0].items[0].id;
        response.shouldSuccess();
      });

      it("Get Specify Products by brand", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project-product/get-list-by-brand/${project.data.id}?page=1&pageSize=999999999999`
            )
        ).shouldSuccess();
      });
      it("Get Specify Products by Material", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project-product/get-list-by-material/${project.data.id}?page=1&pageSize=999999999999`
            )
        ).shouldSuccess();
      });
      it("Get Specify Products by Space", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project-product/get-list-by-zone/${project.data.id}?page=1&pageSize=999999999999`
            )
        ).shouldSuccess();
      });

      it("Generate Project Specify PDF", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/pdf/project/${project.data.id}/generate`, {
              location_id: "LOCATION-DESIGN-FIRM-XXXX-XXXX",
              issuing_for_id: "Testing",
              issuing_date: "2022-10-10",
              revision: "string",
              has_cover: true,
              document_title: "string",
              template_ids: [template_id],
            })
        ).shouldSuccess();
      });

      it("Remove Assigned Product", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .delete(`/api/project-product/${projectProductId}/delete`);

        const projectTrackingId = response.get("project_tracking_id");
        const projectTrackingNotificationId = response.get("notification_id");
        response.shouldSuccess();
        const newTracking = await apiService
          .getInstance()
          .setToken(brand.token)
          .get(
            ROUTES.PROJECT_TRACKING.GET_ONE.replace("{id}", projectTrackingId)
          );
        newTracking.shouldSuccess();
        expect(
          newTracking
            .get()
            .notifications.some(
              (el: any) => el.id === projectTrackingNotificationId
            ),
          "Project tracking notifification not created"
        ).to.be.true;
      });
    });
  });

  describe("Delete design location", () => {
    it("Incorrect location id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(design.token)
          .delete(`/api/location/delete/${locationId}-123`)
      ).shouldError(404);
    });
    it("Incorrect location id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(design.token)
          .delete(`/api/location/delete/${locationId}`)
      ).shouldSuccess();
    });
  });

  describe("Delete team profile", () => {
    it("Incorrect design team profile id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(design.token)
          .delete(`/api/team-profile/delete/${teamProfileId}-123`)
      ).shouldError(404);
    });
    it("Correct design team profile id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(design.token)
          .delete(`/api/team-profile/delete/${teamProfileId}`)
      ).shouldSuccess();
    });
  });

  describe("Delete material code", () => {
    it("Incorrect material code id ", async () => {
      (
        await apiService
          .getInstance()
          .setToken(design.token)
          .delete(`/api/material-code/delete/${materialCodeId}-123`)
      ).shouldError(404);
    });
    it("Correct material code id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(design.token)
          .delete(`/api/material-code/delete/${materialCodeId}`)
      ).shouldSuccess();
    });
  });
});
