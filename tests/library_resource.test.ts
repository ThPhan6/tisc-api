import { connection } from "@/Database/Connections/ArangoConnection";
import { signJwtToken } from "@/helpers/jwt.helper";
import {
  projectData,
  projectLocationData,
  zonesData,
} from "./temp-data/project";
import { materialCodeData } from "./temp-data/product";
import {
  designFirmData,
  designFirmLocationData,
  userDesignFirmData,
} from "./temp-data/design-firm";
import { apiService } from "./helpers/api.helper";
import { CollectionRelationType, CustomResouceType } from "@/types";
import {
  ProductConsiderStatus,
  ProductSpecifyStatus,
} from "@/api/project_product/project_product.type";
import { tiscAdminData } from "./temp-data/user";

describe("Library and Resource", () => {
  let projectProductId = "";
  let design = {
    company: {},
    location: {},
    user: {},
    token: "",
  } as any;
  let tiscAdmin = {
    user: {},
    token: "",
  } as any;
  let project = {
    data: {},
    zones: {},
  } as any;
  let company: any;
  let distributor: any;
  let product: any;
  let collection: any;
  let materialCode: any;

  before(async () => {
    /// DESIGN FIRM
    design.company = await connection.insert("designers", designFirmData);
    design.location = await connection.insert("locations", [
      designFirmLocationData,
      projectLocationData,
    ]);
    design.user = await connection.insert("users", userDesignFirmData);
    design.token = signJwtToken(design.user.id);

    tiscAdmin.user = await connection.insert("users", tiscAdminData);
    tiscAdmin.token = signJwtToken(tiscAdminData.id);

    // PROJECT
    project.data = await connection.insert("projects", projectData);
    project.zones = await connection.insert("project_zones", zonesData);

    materialCode = await connection.insert("material_codes", materialCodeData);
    //
  });

  after(async () => {
    await connection.removeByKeys("designers", [design.company._key]);
    await connection.removeByKeys("projects", [project.data._key]);
    await connection.removeByKeys("project_zones", [project.zones._key]);
    await connection.truncateCollection("custom_resources");
    await connection.truncateCollection("locations");
    await connection.truncateCollection("custom_products");
  });

  describe("Custom Resource", () => {
    describe("Create company", () => {
      it("Incorrect payload", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/custom-resource/create`, {
              business_name: "Test company 1",
              website_uri: "https://testcompany.com",
              associate_resource_ids: [],
              country_id: "39",
              state_id: "872",
              city_id: "16219",
              address: "some address",
              postal_code: "123456",
              general_phone: "1234567890",
              phone_code: "1",
              type: CustomResouceType.Brand,
            })
        ).shouldError();
      });
      it("correct payload", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .post(`/api/custom-resource/create`, {
            business_name: "Test company 1",
            website_uri: "https://testcompany.com",
            associate_resource_ids: [],
            country_id: "39",
            state_id: "872",
            city_id: "16219",
            address: "some address",
            postal_code: "123456",
            general_phone: "1234567890",
            general_email: "testcompany@gmail.com",
            phone_code: "1",
            contacts: [
              {
                first_name: "dev",
                last_name: "1",
                position: "developer",
                work_email: "dev1@workmail.com",
                work_phone: "123456789",
                work_mobile: "123456789",
              },
            ],
            type: CustomResouceType.Brand,
          });

        company = response.get();
        response.shouldSuccess();
      });
    });

    describe("Create distributor", () => {
      it("Incorrect payload", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/custom-resource/create`, {
              business_name: "Test distributor 1",
              website_uri: "https://testdistributor.com",
              associate_resource_ids: [],
              country_id: "39",
              state_id: "872",
              city_id: "16219",
              address: "some address",
              postal_code: "123456",
              general_phone: "1234567890",
              phone_code: "1",
              type: CustomResouceType.Distributor,
            })
        ).shouldError();
      });
      it("correct payload", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .post(`/api/custom-resource/create`, {
            business_name: "Test distributor 1",
            website_uri: "https://testdistributor.com",
            associate_resource_ids: [],
            country_id: "39",
            state_id: "872",
            city_id: "16219",
            address: "some address",
            postal_code: "123456",
            general_phone: "1234567890",
            general_email: "testdistributor@gmail.com",
            phone_code: "1",
            contacts: [
              {
                first_name: "dev",
                last_name: "1",
                position: "developer",
                work_email: "dev1@workmail.com",
                work_phone: "123456789",
                work_mobile: "123456789",
              },
            ],
            type: CustomResouceType.Distributor,
          });

        distributor = response.get();
        response.shouldSuccess();
      });
    });

    describe("Update company", () => {
      it("Incorrect payload", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .put(`/api/custom-resource/update/${company.id}`, {
              business_name: "Test company 1",
              website_uri: "https://testcompany.com",
              associate_resource_ids: [distributor.id],
              country_id: "39",
              state_id: "872",
              city_id: "16219",
              address: "some address1",
              postal_code: "1234567",
              general_phone: "1234567890",
              phone_code: "1",
              type: CustomResouceType.Brand,
            })
        ).shouldError();
      });
      it("correct payload", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .put(`/api/custom-resource/update/${company.id}`, {
            business_name: "Test company 1",
            website_uri: "https://testcompany.com",
            associate_resource_ids: [],
            country_id: "39",
            state_id: "872",
            city_id: "16219",
            address: "some address1",
            postal_code: "1234567",
            general_phone: "1234567890",
            general_email: "testcompany@gmail.com",
            phone_code: "1",
            contacts: [
              {
                first_name: "dev",
                last_name: "1",
                position: "developer",
                work_email: "dev1@workmail.com",
                work_phone: "123456789",
                work_mobile: "123456789",
              },
            ],
            type: CustomResouceType.Brand,
          });

        company = response.get();
        response.shouldSuccess();
      });
    });
    describe("Get one company", () => {
      it("Incorrect ID", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-resource/get-one/${company.id}-123`)
        ).shouldError(404);
      });
      it("correct ID", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-resource/get-one/${company.id}`)
        ).shouldSuccess();
      });
    });

    describe("Update distributor", () => {
      it("Incorrect payload", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .put(`/api/custom-resource/update/${distributor.id}`, {
              business_name: "Test distributor 1",
              website_uri: "https://testdistributor.com",
              associate_resource_ids: [],
              country_id: "39",
              state_id: "872",
              city_id: "16219",
              address: "some address",
              postal_code: "123456",
              general_phone: "1234567890",
              phone_code: "1",
              type: CustomResouceType.Distributor,
            })
        ).shouldError();
      });
      it("correct payload", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .put(`/api/custom-resource/update/${distributor.id}`, {
            business_name: "Test distributor 1",
            website_uri: "https://testdistributor.com",
            associate_resource_ids: [],
            country_id: "39",
            state_id: "872",
            city_id: "16219",
            address: "some address1",
            postal_code: "123456",
            general_phone: "1234567890",
            general_email: "testdistributor@gmail.com",
            phone_code: "1",
            contacts: [
              {
                first_name: "dev",
                last_name: "1",
                position: "developer",
                work_email: "dev1@workmail.com",
                work_phone: "123456789",
                work_mobile: "123456789",
              },
            ],
            type: CustomResouceType.Distributor,
          });

        distributor = response.get();
        response.shouldSuccess();
      });
    });
    describe("Get one distributor", () => {
      it("Incorrect ID", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-resource/get-one/${distributor.id}-123`)
        ).shouldError(404);
      });
      it("correct ID", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-resource/get-one/${distributor.id}`)
        ).shouldSuccess();
      });
    });
    describe("Get list custom resource", () => {
      it("Incorrect parameters", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-resource/get-list?page=1&pageSize=10`)
        ).shouldError();
      });
      it("Correct parameters", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/custom-resource/get-list?page=1&pageSize=10&type=${CustomResouceType.Brand}`
            )
        ).shouldSuccess();
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/custom-resource/get-list?page=1&pageSize=10&type=${CustomResouceType.Distributor}`
            )
        ).shouldSuccess();
      });
    });
    describe("Get all by type", () => {
      it("Incorrect parameters", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-resource/get-list?type=${123}`)
        ).shouldError();
      });
      it("Correct parameters", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/custom-resource/get-list?type=${CustomResouceType.Brand}`
            )
        ).shouldSuccess();
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/custom-resource/get-list?type=${CustomResouceType.Distributor}`
            )
        ).shouldSuccess();
      });
    });
    describe("Get summary of distributor & company", () => {
      it("Correct parameters", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-resource/summary`)
        ).shouldSuccess();
      });
    });
    describe("Get list distributor group by company", () => {
      it("Incorrect parameters", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-resource/distributor/${company.id}-123`)
        ).shouldError(404);
      });
      it("Correct parameters", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-resource/distributor/${company.id}`)
        ).shouldSuccess();
      });
    });
  });

  describe("Custom Product", () => {
    describe("Create product", () => {
      it("Incorrect payload", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/custom-product/create`, {
              business_name: "Test company 1",
              website_uri: "https://testcompany.com",
              associate_resource_ids: [],
              country_id: "39",
              state_id: "872",
              city_id: "16219",
              address: "some address",
              postal_code: "123456",
              general_phone: "1234567890",
              phone_code: "1",
              type: CustomResouceType.Brand,
            })
        ).shouldError();
      });
      it("Correct payload with dimension & weight", async () => {
        const collectionResponse = await apiService
          .getInstance()
          .setToken(design.token)
          .post(`/api/collection/create`, {
            name: "Company Collection 1",
            relation_id: company.id,
            relation_type: CollectionRelationType.CustomProduct,
          });
        collection = collectionResponse.get();
        collectionResponse.shouldSuccess();

        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .post(`/api/custom-product/create`, {
            name: "Custom product 1",
            description: "A simple product",
            images: [
              "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
            ],
            attributes: [
              {
                name: "att1",
                content: "test attr 1",
              },
            ],
            specifications: [
              {
                name: "Spec 1",
                content: "Some spec 1",
              },
              {
                name: "Spec 2",
                content: "Some spec 2",
              },
            ],
            options: [
              {
                items: [
                  {
                    description: "Arch Pearl, solid upholstery fabrics",
                    product_id: "zzzz",
                    image:
                      "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/63070e076114035c.png",
                  },
                  {
                    description: "Napa Bone, solid upholstery fabrics",
                    product_id: "aaa",
                    image:
                      "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/895d2055f57a32f6.png",
                  },
                  {
                    description: "Linen Grey, solid upholstery fabrics",
                    product_id: "bbbb",
                    image:
                      "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/375f630b9293ba48.png",
                  },
                ],
                tag: "Fab-0001",
                title: "Upholstery Selection",
                use_image: true,
              },
              {
                tag: "MT-000A",
                title: "Metal Finishing",
                use_image: true,
                items: [
                  {
                    description:
                      "Stainless steel in polished mirror, standard finishing",
                    product_id: "sdf",
                    image:
                      "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/a56d002962078ffd.png",
                  },
                  {
                    description:
                      "Stainless steel in brushed matte, standard finishing",
                    product_id: "111",
                    image:
                      "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/62ec78acf85efc93.png",
                  },
                ],
              },
              {
                tag: "ML-00AQ",
                title: "Power Type",
                use_image: false,
                items: [
                  {
                    description: "Navy Blue, solid upholstery fabrics",
                    product_id: "MN",
                  },
                ],
              },
            ],
            collection_id: collection.id,
            company_id: company.id,
            dimension_and_weight: {
              with_diameter: true,
              attributes: [
                {
                  id: "e14cfe5b-eeab-4826-b165-91c0c8f1341c",
                  conversion_value_1: "1",
                  conversion_value_2: "0.04",
                },
                {
                  id: "91a1546d-d4f8-4456-bcab-b930cccdb250",
                  conversion_value_1: "2",
                  conversion_value_2: "0.08",
                },
                {
                  id: "ca9279f9-cfe8-42d5-9ca9-2cf4f6a4992c",
                  conversion_value_1: "5",
                  conversion_value_2: "0.2",
                },
                {
                  id: "62f50511-474b-4b0b-9718-13c00d25234a",
                  conversion_value_1: "3",
                  conversion_value_2: "0.12",
                },
                {
                  id: "c422b8c0-9e33-4437-869c-17a1122df2da",
                  conversion_value_1: "4",
                  conversion_value_2: "8.82",
                },
              ],
            },
          });

        product = response.get();
        response.shouldSuccess();
      });
    });
    describe("Get one product", () => {
      it("Incorrect ID", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-product/get-one/${product.id}-123`)
        ).shouldError(404);
      });
      it("correct ID", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-product/get-one/${product.id}`)
        ).shouldSuccess();
      });
    });
    describe("Update product", () => {
      it("Incorrect payload", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .put(`/api/custom-product/update/${product.id}`, {
              name: "Custom product 1",
              description: "A simple product",
              images: [],
              attributes: [
                {
                  name: "att1",
                  content: "test attr 1",
                },
              ],
              specifications: [
                {
                  name: "Spec 1",
                  content: "Some spec 1",
                },
                {
                  name: "Spec 2",
                  content: "Some spec 2",
                },
              ],
              options: [
                {
                  items: [
                    {
                      description: "Arch Pearl, solid upholstery fabrics",
                      product_id: "zzzz",
                      image:
                        "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/63070e076114035c.png",
                    },
                    {
                      description: "Napa Bone, solid upholstery fabrics",
                      product_id: "aaa",
                      image:
                        "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/895d2055f57a32f6.png",
                    },
                    {
                      description: "Linen Grey, solid upholstery fabrics",
                      product_id: "bbbb",
                      image:
                        "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/375f630b9293ba48.png",
                    },
                  ],
                  tag: "Fab-0001",
                  title: "Upholstery Selection",
                  use_image: true,
                },
                {
                  tag: "MT-000A",
                  title: "Metal Finishing",
                  use_image: true,
                  items: [
                    {
                      description:
                        "Stainless steel in polished mirror, standard finishing",
                      product_id: "sdf",
                      image:
                        "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/a56d002962078ffd.png",
                    },
                    {
                      description:
                        "Stainless steel in brushed matte, standard finishing",
                      product_id: "111",
                      image:
                        "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/62ec78acf85efc93.png",
                    },
                  ],
                },
                {
                  tag: "ML-00AQ",
                  title: "Power Type",
                  use_image: false,
                  items: [
                    {
                      description: "Navy Blue, solid upholstery fabrics",
                      product_id: "MN",
                    },
                  ],
                },
              ],
              collection_id: collection.id,
              company_id: company.id,
              dimension_and_weight: {
                with_diameter: true,
                attributes: [
                  {
                    id: "e14cfe5b-eeab-4826-b165-91c0c8f1341c",
                    conversion_value_1: "1",
                    conversion_value_2: "0.04",
                  },
                  {
                    id: "91a1546d-d4f8-4456-bcab-b930cccdb250",
                    conversion_value_1: "2",
                    conversion_value_2: "0.08",
                  },
                  {
                    id: "ca9279f9-cfe8-42d5-9ca9-2cf4f6a4992c",
                    conversion_value_1: "5",
                    conversion_value_2: "0.2",
                  },
                  {
                    id: "62f50511-474b-4b0b-9718-13c00d25234a",
                    conversion_value_1: "3",
                    conversion_value_2: "0.12",
                  },
                  {
                    id: "c422b8c0-9e33-4437-869c-17a1122df2da",
                    conversion_value_1: "4",
                    conversion_value_2: "8.82",
                  },
                ],
              },
            })
        ).shouldError();
      });
      it("correct payload", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .put(`/api/custom-product/update/${product.id}`, {
            name: "Custom product 1",
            description: "A simple product",
            images: [
              "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
            ],
            attributes: [
              {
                name: "att1",
                content: "test attr 1",
              },
            ],
            specifications: [
              {
                name: "Spec 1",
                content: "Some spec 1",
              },
              {
                name: "Spec 2",
                content: "Some spec 2",
              },
            ],
            options: [
              {
                items: [
                  {
                    description: "Arch Pearl, solid upholstery fabrics",
                    product_id: "zzzz",
                    image:
                      "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/63070e076114035c.png",
                  },
                  {
                    description: "Napa Bone, solid upholstery fabrics",
                    product_id: "aaa",
                    image:
                      "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/895d2055f57a32f6.png",
                  },
                  {
                    description: "Linen Grey, solid upholstery fabrics",
                    product_id: "bbbb",
                    image:
                      "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/375f630b9293ba48.png",
                  },
                ],
                tag: "Fab-0001",
                title: "Upholstery Selection",
                use_image: true,
              },
              {
                tag: "MT-000A",
                title: "Metal Finishing",
                use_image: true,
                items: [
                  {
                    description:
                      "Stainless steel in polished mirror, standard finishing",
                    product_id: "sdf",
                    image:
                      "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/a56d002962078ffd.png",
                  },
                  {
                    description:
                      "Stainless steel in brushed matte, standard finishing",
                    product_id: "111",
                    image:
                      "/custom-product/option/f87d2892-ab8e-445a-a5dd-e39ba4d581b7/62ec78acf85efc93.png",
                  },
                ],
              },
              {
                tag: "ML-00AQ",
                title: "Power Type",
                use_image: false,
                items: [
                  {
                    description: "Navy Blue, solid upholstery fabrics",
                    product_id: "MN",
                  },
                ],
              },
            ],
            collection_id: collection.id,
            company_id: company.id,
            dimension_and_weight: {
              with_diameter: true,
              attributes: [
                {
                  id: "e14cfe5b-eeab-4826-b165-91c0c8f1341c",
                  conversion_value_1: "1",
                  conversion_value_2: "0.04",
                },
                {
                  id: "91a1546d-d4f8-4456-bcab-b930cccdb250",
                  conversion_value_1: "2",
                  conversion_value_2: "0.08",
                },
                {
                  id: "ca9279f9-cfe8-42d5-9ca9-2cf4f6a4992c",
                  conversion_value_1: "5",
                  conversion_value_2: "0.2",
                },
                {
                  id: "62f50511-474b-4b0b-9718-13c00d25234a",
                  conversion_value_1: "3",
                  conversion_value_2: "0.12",
                },
                {
                  id: "c422b8c0-9e33-4437-869c-17a1122df2da",
                  conversion_value_1: "4",
                  conversion_value_2: "8.82",
                },
              ],
            },
          });

        product = response.get();
        response.shouldSuccess();
      });
    });
    describe("Get list", () => {
      it("Correct parameters", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-product/get-list?`)
        ).shouldSuccess();
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-product/get-list?company_id=${company.id}`)
        ).shouldSuccess();
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(`/api/custom-product/get-list?collection_id=${collection.id}`)
        ).shouldSuccess();
      });
    });
  });

  describe("Prodject with Custom Product", () => {
    describe("Assign custom product to project", () => {
      it("Incorrect payload", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/api/project/assign-product`, {
              product_id: product.id,
              project_id: "string",
              allocation: ["string"],
              custom_product: true,
            })
        ).shouldError();
      });
      it("Correct payload", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .post(`/api/project/assign-product`, {
            entire_allocation: true,
            product_id: product.id,
            project_id: project.data.id,
            allocation: [],
            custom_product: true,
          });
        response.shouldSuccess();
        projectProductId = response.get("id");
      });
    });
    describe("Get list project considered", () => {
      it("Get list with parameter ", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project/${project.data.id}/considered-product/get-list?page=1&pageSize=999999999999`
            )
        ).shouldSuccess();
      });
    });
    describe("Update consider status", () => {
      it("Incorrect payload", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .patch(
            `/api/project-product/${projectProductId}/update-consider-status`,
            {
              consider_status: 9,
            }
          );
        response.shouldError();
      });
      it("Correct payload", async () => {
        (
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
      });
    });
    describe("Specify custom product", () => {
      it("Incorrect payload", async () => {
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
            brand_location_id: company.location_id,
            distributor_location_id: distributor.location_id,
            entire_allocation: false,
            allocation: [],
            material_code_id: materialCode.id,
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
                  ceiling: false,
                  floor: false,
                },
                front_wall: true,
                left_wall: true,
                back_wall: false,
                right_wall: false,
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
        response.shouldError();
      });
      it("correct payload", async () => {
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
            brand_location_id: company.location_id,
            distributor_location_id: distributor.location_id,
            entire_allocation: true,
            allocation: [],
            material_code_id: materialCode.id,
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
                  ceiling: false,
                  floor: false,
                },
                front_wall: true,
                left_wall: true,
                back_wall: false,
                right_wall: false,
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
        response.shouldSuccess();
      });
    });

    describe("Get list product specify by brand", () => {
      it("Incorrect project id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project-product/get-list-by-brand/${project.data.id}-123?page=1&pageSize=999999999999`
            )
        ).shouldError(404);
      });
      it("Correct project id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project-product/get-list-by-brand/${project.data.id}?page=1&pageSize=999999999999`
            )
        ).shouldSuccess();
      });
    });

    describe("Get list product specify by material code", () => {
      it("Incorrect project id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project-product/get-list-by-material/${project.data.id}-123?page=1&pageSize=999999999999`
            )
        ).shouldError(404);
      });
      it("Correct project id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project-product/get-list-by-material/${project.data.id}?page=1&pageSize=999999999999`
            )
        ).shouldSuccess();
      });
    });
    describe("Get list product specify by space", () => {
      it("Incorrect project id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project-product/get-list-by-zone/${project.data.id}-123?page=1&pageSize=999999999999`
            )
        ).shouldError(404);
      });
      it("Correct project id", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .get(
              `/api/project-product/get-list-by-zone/${project.data.id}?page=1&pageSize=999999999999`
            )
        ).shouldSuccess();
      });
    });

    describe("Update product specify status", () => {
      it("Incorrect payload", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .patch(
              `/api/project-product/${projectProductId}/update-specified-status`,
              {
                specified_status: 9,
              }
            )
        ).shouldError();
      });
      it("Correct payload", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .patch(
              `/api/project-product/${projectProductId}/update-specified-status`,
              {
                specified_status: ProductSpecifyStatus.Cancelled,
              }
            )
        ).shouldSuccess();
      });
    });

    describe("Generate PDF", () => {
      it("Correct project id", async () => {
        const pdfTemplate = await apiService
          .getInstance()
          .setToken(design.token)
          .get(`/api/pdf/project/config/${project.data.id}`);
        const template_id =
          pdfTemplate.get("templates").specification[0].items[0].id;
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
    });
  });

  describe("TISC - Project Listing", () => {
    describe("Get list", () => {
      it("With pagination", async () => {
        const response = await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .get(`/api/project/listing?page=1&pageSize=10`);
        response.shouldSuccess();
      });
    });
    describe("Get summary", () => {
      it("Correct parameters", async () => {
        const response = await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .get(`/api/project/get-summary-overall`);
        response.shouldSuccess();
      });
    });
    describe("Get one", () => {
      it("Incorrect ID", async () => {
        const response = await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .get(`/api/project/listing/${project.data.id}-123`);
        response.shouldError(404);
      });
      it("Correct ID", async () => {
        const response = await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .get(`/api/project/listing/${project.data.id}`);
        response.shouldSuccess();
      });
    });
  });

  describe("TISC User group - Design Firm - Library Tab", () => {
    describe("Get by design firm", () => {
      it("Incorrect ID", async () => {
        const response = await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .get(`/api/design/${design.company.id}-123/library`);
        response.shouldError(404);
      });
      it("Correct ID", async () => {
        const response = await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .get(`/api/design/${design.company.id}/library`);
        response.shouldSuccess();
      });
    });
  });

  describe("Delete records", () => {
    describe("Delete product specify", () => {
      it("Incorrect ID", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .delete(`/api/project-product/${projectProductId}-123/delete`)
        ).shouldError(404);
      });
      it("Correct ID", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .delete(`/api/project-product/${projectProductId}/delete`)
        ).shouldSuccess();
      });
    });

    describe("Delete custom product", () => {
      it("Incorrect ID", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .delete(`/api/custom-product/delete/${product.id}-123`)
        ).shouldError(404);
      });
      it("Correct ID", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .delete(`/api/custom-product/delete/${product.id}`)
        ).shouldSuccess();
      });
    });
    describe("Delete custom resource", () => {
      it("Incorrect ID", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .delete(`/api/custom-resource/delete/${company.id}-123`)
        ).shouldError(404);
      });
      it("Correct ID", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .delete(`/api/custom-resource/delete/${company.id}`)
        ).shouldSuccess();
      });
    });
  });
});
