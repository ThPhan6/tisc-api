import { connection } from "@/Database/Connections/ArangoConnection";
import { signJwtToken } from "@/helper/jwt.helper";
import { projectData, zonesData } from "./temp-data/project";
import {
  designFirmData,
  designFirmLocationData,
  userDesignFirmData,
} from "./temp-data/design-firm";
import { apiService } from "./helpers/api.helper";
import { CollectionRelationType, CustomResouceType } from "@/types";

describe("Library and Resource", () => {
  let design = {
    company: {},
    location: {},
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

  before(async () => {
    /// DESIGN FIRM
    design.company = await connection.insert("designers", designFirmData);
    design.location = await connection.insert(
      "locations",
      designFirmLocationData
    );
    design.user = await connection.insert("users", userDesignFirmData);
    design.token = signJwtToken(design.user.id);

    // PROJECT
    project.data = await connection.insert("projects", projectData);
    project.zones = await connection.insert("project_zones", zonesData);
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

    describe("Delete", () => {
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
