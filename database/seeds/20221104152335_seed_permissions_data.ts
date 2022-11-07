import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import {ROUTES} from '@/constants';
import moment from 'moment';

const permissionData = [
	{
		logo: "/logo/my_workspace.svg",
		name: "MY WORKSPACE",
		parent_id: null,
		type: 1,
		routes: [
			ROUTES.GET_LIST_BRAND_CARD
		],
		index: 0,
		id: "8912739f-a6bd-4bfa-9209-66dec6cca051"
	},
	{
		logo: "/logo/user_group.svg",
		name: "USER GROUP",
		parent_id: null,
		type: 1,
		routes: [],
		index: 1,
		id: "8912739f-a6bd-4bfa-9209-66dec6cca051",
		subs: [{
				logo: "/logo/brand.svg",
				name: "Brands",
				parent_id: null,
				type: 1,
				routes: [
          ROUTES.GET_ALL_BRAND_SUMMARY,
          ROUTES.GET_LIST_BRAND,
          ROUTES.CREATE_BRAND,
					ROUTES.GET_TISC_TEAM_PROFILE,
					ROUTES.ASSIGN_TEAM,
          ROUTES.GET_ONE_BRAND,
          ROUTES.GET_BRAND_STATUSES,
					ROUTES.GET_BRAND_LOCATIONS_COUNTRY_GROUP,
          ROUTES.GET_BRAND_TEAM_GROUP_BY_COUNTRY,
          ROUTES.GET_DISTRIBUTOR_GROUP_BY_COUNTRY,
          ROUTES.GET_MARKET_AVAILABILITY_GROUP_BY_COLLECTION,
					ROUTES.UPDATE_BRAND_STATUS
				],
				index: 2,
				id: "c717582f-03a0-49bb-a04d-6747f56ce151",
			},
			{
				logo: "/logo/design.svg",
				name: "Design Firms",
				parent_id: null,
				type: 1,
				routes: [
					ROUTES.GET_ALL_DESIGN_FIRM_SUMMARY,
					ROUTES.GET_LIST_DESIGN_FIRM,
					ROUTES.GET_DESIGN_LOCATIONS_COUNTRY_GROUP,
					ROUTES.GET_DESIGN_TEAM_GROUP_BY_COUNTRY,
					ROUTES.GET_MATERIAL_CODE_GROUP,
					ROUTES.GET_PROJECT_GROUP_BY_STATUS,
					ROUTES.GET_DESIGN_STATUSES,
					ROUTES.GET_ONE_DESIGN_FIRM,
					ROUTES.UPDATE_DESIGN_STATUS
				],
				index: 3,
				id: "3ed16b52-1de0-42ca-bb87-057734c23e9d",
			}
		]
	},
	{
		logo: "/logo/project.svg",
		name: "PROJECTS",
		parent_id: null,
		type: 1,
		routes: [],
		index: 4,
		id: "52b692be-8563-4bf2-b988-66b527ef91c3",
    subs: [
      {
        logo: "/logo/list.svg",
    		name: "Listing",
    		type: 1,
    		routes: [],
				index: 5,
				id: "8d6e8ecd-64e8-43d3-83de-6622749d992e",
      }
    ]
	},
	{
		logo: "/logo/product.svg",
		name: "PRODUCTS",
		parent_id: null,
		type: 1,
		routes: [],
		index: 6,
		id: "7e5c1e20-af2d-4c8e-b34c-d3749165e8fd",
		subs: [{
				logo: "/logo/category.svg",
				name: "Categories",
				type: 1,
				routes: [
					ROUTES.GET_LIST_CATEGORY,
					ROUTES.CREATE_CATEGORY,
					ROUTES.GET_ONE_CATEGORY,
					ROUTES.EDIT_CATEGORY,
					ROUTES.DELETE_CATEGORY
				],
				index: 7,
				id: "0497469e-bd47-49d3-89f6-0b4be7b16e29",
			},
			{
				logo: "/logo/basis.svg",
				name: "Basis",
				type: 1,
				index: 8,
				id: "13b87c66-1b12-4459-a386-c5eaaa996402",
				routes: [
          ROUTES.GET_LIST_BASIS_CONVERSION,
          ROUTES.EDIT_BASIS_CONVERSION,
          ROUTES.GET_ONE_BASIS_CONVERSION,
          ROUTES.DELETE_BASIS_CONVERSION,
          ROUTES.CREATE_BASIS_CONVERSION,

          ROUTES.GET_LIST_BASIS_OPTION,
          ROUTES.EDIT_BASIS_OPTION,
          ROUTES.GET_ONE_BASIS_OPTION,
          ROUTES.DELETE_BASIS_OPTION,
          ROUTES.CREATE_BASIS_OPTION,

          ROUTES.GET_LIST_BASIS_PRESET,
          ROUTES.EDIT_BASIS_PRESET,
          ROUTES.GET_ONE_BASIS_PRESET,
          ROUTES.DELETE_BASIS_PRESET,
          ROUTES.CREATE_BASIS_PRESET,
				]
			},
			{
				logo: "/logo/attribute.svg",
				name: "Attributes",
				type: 1,
				routes: [
          ROUTES.GET_LIST_ATTRIBUTE,
          ROUTES.GET_LIST_CONTENT_TYPE,
          ROUTES.EDIT_ATTRIBUTE,
          ROUTES.DELETE_ATTRIBUTE,
          ROUTES.CREATE_ATTRIBUTE,
          ROUTES.GET_ONE_ATTRIBUTE,
				],
				index: 9,
				id: "d606e7f2-b688-4b03-a58d-b7aed50196b0",
			},
			{
				logo: "/logo/configuration.svg",
				name: "Configurations",
				type: 1,
				routes: [
					ROUTES.GET_LIST_BRAND_BY_ALPHABET,
					ROUTES.GET_BRAND_PRODUCT_SUMMARY,
					ROUTES.GET_LIST_PRODUCT,
					ROUTES.GET_ONE_PRODUCT,
					ROUTES.GET_LIST_COLLECTION,
					ROUTES.GET_ALL_ATTRIBUTE,
					ROUTES.GET_SHARING_PURPOSES,
					ROUTES.GET_LIST_REST_COLLECTION_PRODUCT,
					ROUTES.GET_MARKET_DISTRIBUTOR_COUNTRY_GROUP,
					ROUTES.GET_BRAND_LOCATIONS_COUNTRY_GROUP,
					ROUTES.UPDATE_PRODUCT,
					ROUTES.GET_ONE_BRAND,
					ROUTES.CREATE_PRODUCT,
					ROUTES.LIKE_OR_UNLIKE_PRODUCT,
					ROUTES.DUPLICATE_PRODUCT,
					ROUTES.DELETE_PRODUCT,
					ROUTES.PRE_SPECFICATION.GET_USER_SPEC_SELECTION,
					ROUTES.PRE_SPECFICATION.UPDATE_USER_SPEC_SELECTION,
				],
				index: 10,
				id: "9c0b47ac-fc1a-443d-a377-d36948b4b73c",
			}
		]
	},
	{
		logo: "/logo/administration.svg",
		name: "ADMINISTRATION",
		parent_id: null,
		type: 1,
		routes: [],
		index: 11,
		id: "5f9532d7-7bc8-45f7-b360-6de2c3e2106d",
		subs: [{
				logo: "/logo/documentation.svg",
				name: "Documentation",
				type: 1,
				routes: [
					ROUTES.GET_LIST_DOCUMENTATION,
					ROUTES.GET_ONE_DOCUMENTATION,
					ROUTES.EDIT_DOCUMENTATION
				],
				index: 12,
				id: "f071d833-dce9-4c97-ab47-008609d7fff4",
			},
			{
				logo: "/logo/location.svg",
				name: "Locations",
				type: 1,
				routes: [
					ROUTES.GET_LIST_LOCATION,
					ROUTES.CREATE_LOCATION,
					ROUTES.GET_ONE_LOCATION,
					ROUTES.EDIT_LOCATION,
					ROUTES.DELETE_LOCATION
				],
				index: 13,
				id: "de0919e7-5d7a-4bac-9573-a586a0d90a27",
			},
			{
				logo: "/logo/team_profile.svg",
				name: "Team Profiles",
				type: 1,
				routes: [
					ROUTES.GET_LIST_TEAM_PROFILE,
					ROUTES.GET_LIST_LOCATION_WITH_GROUP,
					ROUTES.GET_LIST_PERMISSION,
					ROUTES.CREATE_TEAM_PROFILE,
					ROUTES.SEND_INVITE_TEAM_PROFILE,
					ROUTES.GET_ONE_TEAM_PROFILE,
					ROUTES.EDIT_TEAM_PROFILE,
					ROUTES.DELETE_TEAM_PROFILE
				],
				index: 14,
				id: "cce6c967-6f35-4a2e-a40a-373d815a1a18",
			},
			{
				logo: "/logo/message.svg",
				name: "Messages",
				type: 1,
				routes: [
					ROUTES.GET_LIST_EMAIL_AUTO,
					ROUTES.GET_LIST_AUTO_EMAIL_TOPIC,
					ROUTES.GET_LIST_AUTO_EMAIL_TARGETED_FOR,
					ROUTES.GET_ONE_EMAIL_AUTO,
					ROUTES.EDIT_EMAIL_AUTO
				],
				index: 15,
				id: "40855ee7-8d28-4c22-8831-9088d846edf1",
			},
			{
				logo: "/logo/revenue.svg",
				name: "Revenues",
				type: 1,
				index: 16,
				id: "69cff368-97ea-4cb7-8356-a4e265b7324c",
				routes: [],
			}
		]
	},





	{
		logo: "/logo/my_workspace.svg",
		name: "MY WORKSPACE",
		parent_id: null,
		type: 2,
		routes: [
			ROUTES.PROJECT_TRACKING.GET_SUMMARY,
			ROUTES.PROJECT_TRACKING.GET_LIST
		],
		index: 17,
		id: "2659144d-3109-4b06-a21a-6f55400c0fac",
	},
	{
		logo: "/logo/product.svg",
		name: "PRODUCTS",
		parent_id: null,
		type: 2,
		index: 18,
		id: "f5d1205f-681c-4609-a0c2-4c229ea3e011",
		routes: [
			ROUTES.GET_BRAND_PRODUCT_SUMMARY,
			ROUTES.GET_LIST_REST_COLLECTION_PRODUCT,
			ROUTES.LIKE_OR_UNLIKE_PRODUCT,
			ROUTES.SHARE_PRODUCT_BY_EMAIL,
			ROUTES.GET_LIST_COLLECTION,
			ROUTES.GET_ALL_ATTRIBUTE,
			ROUTES.GET_MARKET_DISTRIBUTOR_COUNTRY_GROUP,
			ROUTES.GET_LIST_REST_COLLECTION_PRODUCT,
			ROUTES.GET_ONE_PRODUCT,
			ROUTES.GET_BRAND_LOCATIONS_COUNTRY_GROUP,
			ROUTES.PRE_SPECFICATION.GET_USER_SPEC_SELECTION,
			ROUTES.PRE_SPECFICATION.UPDATE_USER_SPEC_SELECTION
		]
	},
	{
		logo: "/logo/general_inquires.svg",
		name: "GENERAL INQUIRES",
		parent_id: null,
		type: 2,
		index: 19,
		id: "fff166c0-68cb-47c8-9e66-60f6e77bb65c",
		routes: [
			ROUTES.GENERAL_INQUIRY.GET_LIST,
			ROUTES.GENERAL_INQUIRY.SUMMARY,
			ROUTES.GENERAL_INQUIRY.GET_ONE,
			ROUTES.ACTION_TASK.CREATE,
			ROUTES.ACTION_TASK.GET_LIST,
			ROUTES.ACTION_TASK.UPDATE,
		]
	},
	{
		logo: "/logo/project_tracking.svg",
		name: "PROJECT TRACKING",
		parent_id: null,
		type: 2,
		index: 20,
		id: "0cc42569-d698-4cde-908d-bc9467b663ef",
		routes: [
			ROUTES.PROJECT_TRACKING.GET_LIST,
			ROUTES.PROJECT_TRACKING.GET_SUMMARY,
			ROUTES.PROJECT_TRACKING.GET_ONE,
			ROUTES.PROJECT_TRACKING.GET_SUMMARY,
			ROUTES.ACTION_TASK.CREATE,
			ROUTES.ACTION_TASK.GET_LIST,
			ROUTES.ACTION_TASK.UPDATE,
		]
	},
	{
		logo: "/logo/administration.svg",
		name: "ADMINISTRATION",
		parent_id: null,
		type: 2,
		routes: [],
		index: 21,
		id: "ce6ef164-2e1e-4760-9ab3-d7ee102ffb9f",
		subs: [{
				logo: "/logo/brand.svg",
				name: "Brand Profile",
				type: 2,
				index: 22,
				id: "32c49807-de68-4d05-ab21-fab64c34978f",
				routes: [
					ROUTES.UPDATE_BRAND_PROFILE
				]
			},
			{
				logo: "/logo/location.svg",
				name: "Locations",
				type: 2,
				index: 23,
				id: "98b88d52-a5a4-43ae-901d-ee4cc1428bbc",
				routes: [
					ROUTES.GET_LIST_LOCATION,
					ROUTES.CREATE_LOCATION,
					ROUTES.GET_ONE_LOCATION,
					ROUTES.EDIT_LOCATION,
					ROUTES.DELETE_LOCATION
				]
			},
			{
				logo: "/logo/team_profile.svg",
				name: "Team Profiles",
				type: 2,
				index: 24,
				id: "365d392a-eb21-4ca3-a64e-dc124c781fd1",
				routes: [
					ROUTES.GET_LIST_TEAM_PROFILE,
					ROUTES.GET_LIST_LOCATION_WITH_GROUP,
					ROUTES.GET_LIST_PERMISSION,
					ROUTES.CREATE_TEAM_PROFILE,
					ROUTES.SEND_INVITE_TEAM_PROFILE,
					ROUTES.GET_ONE_TEAM_PROFILE,
					ROUTES.EDIT_TEAM_PROFILE,
					ROUTES.DELETE_TEAM_PROFILE
				]
			},
			{
				logo: "/logo/distributor.svg",
				name: "Distributors",
				type: 2,
				index: 25,
				id: "e7bc23fa-0039-4c4e-a77a-c40acde9add6",
				routes: [
					ROUTES.CREATE_DISTRIBUTOR,
					ROUTES.UPDATE_DISTRIBUTOR,
					ROUTES.DELETE_DISTRIBUTOR,
					ROUTES.GET_LIST_DISTRIBUTOR,
					ROUTES.GET_ONE_DISTRIBUTOR,
				]
			},
			{
				logo: "/logo/market_availability.svg",
				name: "Market Availability",
				type: 2,
				index: 26,
				id: "27fc3948-3ceb-4eb0-912a-d183e6b86207",
				routes: [
					ROUTES.UPDATE_MARKET_AVAILABILITY,
					ROUTES.GET_LIST_MARKET_AVAILABILITY,
					ROUTES.GET_ONE_MARKET_AVAILABILITY,
				]
			},
			{
				logo: "/logo/subscription.svg",
				name: "Subscription",
				type: 2,
				index: 27,
				id: "cf136578-0e9b-4d75-909f-6114f02ff74e",
				routes: []
			}
		]
	},




	{
		logo: "/logo/my_workspace.svg",
		name: "MY WORKSPACE",
		parent_id: null,
		type: 3,
		index: 28,
		id: "21d30c18-dbb2-473f-840d-889e710cc2a2",
		routes: [
			ROUTES.GET_PROJECT_SUMMARY,
			ROUTES.GET_LIST_PROJECT
		]
	},
	{
		logo: "/logo/favourite.svg",
		name: "MY FAVOURITE",
		parent_id: null,
		type: 3,
		index: 29,
		id: "0231a111-d676-4474-b1ef-3bf780a2e62b",
		routes: [
			ROUTES.FAVOURITE.SUMMARY,
			ROUTES.FAVOURITE.LIST,
			ROUTES.GET_LIST_BRAND,
			ROUTES.GET_LIST_CATEGORY,
			ROUTES.LIKE_OR_UNLIKE_PRODUCT,
			ROUTES.PROJECT_PRODUCT.ASSIGN_PRODUCT_TO_A_PROJECT,
			ROUTES.GET_ALL_PROJECT,
			ROUTES.GET_LIST_ASSIGNED_PROJECT,
			ROUTES.GET_LIST_COLLECTION,
			ROUTES.GET_ALL_ATTRIBUTE,
			ROUTES.GET_MARKET_DISTRIBUTOR_COUNTRY_GROUP,
			ROUTES.GET_LIST_REST_COLLECTION_PRODUCT,
			ROUTES.GET_BRAND_LOCATIONS_COUNTRY_GROUP,
			ROUTES.GENERAL_INQUIRY.CREATE,
			ROUTES.PROJECT_TRACKING.CREATE,
		]
	},
	{
		logo: "/logo/product.svg",
		name: "PRODUCTS",
		parent_id: null,
		type: 3,
		index: 30,
		id: "341d7d84-ae91-4411-bd71-4d3d982fdc70",
		routes: [
			ROUTES.GET_LIST_BRAND,
			ROUTES.GET_LIST_CATEGORY,
			ROUTES.GET_LIST_DESIGNER_BRAND_PRODUCTS,
			ROUTES.SHARE_PRODUCT_BY_EMAIL,
			ROUTES.GENERAL_INQUIRY.CREATE,
			ROUTES.PROJECT_TRACKING.CREATE,
			ROUTES.GET_LIST_COLLECTION,
			ROUTES.GET_ALL_ATTRIBUTE,
			ROUTES.GET_MARKET_DISTRIBUTOR_COUNTRY_GROUP,
			ROUTES.GET_LIST_REST_COLLECTION_PRODUCT,
			ROUTES.GET_ONE_PRODUCT,
			ROUTES.GET_BRAND_LOCATIONS_COUNTRY_GROUP,
			ROUTES.PRE_SPECFICATION.GET_USER_SPEC_SELECTION,
			ROUTES.PRE_SPECFICATION.UPDATE_USER_SPEC_SELECTION,
		]
	},
	{
		logo: "/logo/project.svg",
		name: "PROJECTS",
		parent_id: null,
		type: 3,
		routes: [],
		index: 31,
		id: "7401fae2-1aa5-43f1-ba8b-4e5b3683d87b",
    subs: [
      {
        logo: null,
        name: "Overal Listing",
        type: 3,
				index: 32,
				id: "e6a4f794-8532-4d27-8bf9-4e182818a336",
        routes: [
          ROUTES.GET_PROJECT_SUMMARY,
					ROUTES.GET_LIST_PROJECT,
					ROUTES.DELETE_PROJECT,
					ROUTES.GET_DESIGN_TEAM_GROUP_BY_COUNTRY,
					ROUTES.ASSIGN_TEAM_PROJECT,
					ROUTES.CREATE_PROJECT
        ]
      },
      {
        logo: null,
        name: "Basic Information",
        type: 3,
				index: 33,
				id: "f4bbcbd9-d023-4d13-a9a9-4af63abb5d26",
        routes: [
					ROUTES.GET_ONE_PROJECT,
					ROUTES.UPDATE_PROJECT,
        ]
      },
      {
        logo: null,
        name: "Zone/Area/Room",
        type: 3,
				index: 34,
				id: "a4066697-2474-4168-b914-5ec80ebb69bd",
        routes: [
          ROUTES.GET_LIST_PROJECT_ZONE,
          ROUTES.CREATE_PROJECT_ZONE,
          ROUTES.UPDATE_PROJECT_ZONE,
          ROUTES.GET_ONE_PROJECT_ZONE,
          ROUTES.DELETE_PROJECT_ZONE,
        ]
      },
      {
        logo: null,
        name: "Product Considered",
        type: 3,
				index: 35,
				id: "676edbee-9199-4d3f-a116-bc43c932d1f8",
        routes: [
					ROUTES.PROJECT_PRODUCT.GET_CONSIDERED_PRODUCT_LIST,
					ROUTES.PROJECT_PRODUCT.DELETE_CONSIDERED_PRODUCT,
					ROUTES.PROJECT_PRODUCT.UPDATE_CONSIDERED_PRODUCT_STATUS,
					ROUTES.PROJECT_PRODUCT.UPDATE_CONSIDERED_PRODUCT_SPECIFY,
					ROUTES.GET_ONE_PRODUCT,
					ROUTES.PROJECT_PRODUCT.GET_LIST_FINISH_SCHEDULE_FOR,
					ROUTES.GET_BRAND_LOCATIONS_COUNTRY_GROUP,
					ROUTES.GET_MARKET_DISTRIBUTOR_COUNTRY_GROUP,
					ROUTES.MATERIAL_CODE.GET_LIST_CODE_MATERIAL_CODE,
					ROUTES.PROJECT_PRODUCT.GET_PROJECT_ASSIGN_ZONE_BY_PRODUCT,
					ROUTES.SHARE_PRODUCT_BY_EMAIL,
					ROUTES.GENERAL_INQUIRY.CREATE,
					ROUTES.PROJECT_TRACKING.CREATE,
        ]
      },
      {
        logo: null,
        name: "Product Specified",
        type: 3,
				index: 36,
				id: "fe8a904b-0b37-4296-8af7-ae3676911e2c",
        routes: [
					ROUTES.PROJECT_PRODUCT.DELETE_CONSIDERED_PRODUCT,
					ROUTES.PROJECT_PRODUCT.UPDATE_CONSIDERED_PRODUCT_SPECIFY,
					ROUTES.PROJECT_PRODUCT.UPDATE_SPECIFIED_PRODUCT_STATUS,
					ROUTES.PROJECT_PRODUCT.GET_SPECIFYING_PRODUCTS_BY_BRAND,
					ROUTES.PROJECT_PRODUCT.GET_SPECIFYING_PRODUCTS_BY_MATERIAL,
					ROUTES.PROJECT_PRODUCT.GET_SPECIFYING_PRODUCTS_BY_ZONE,
					ROUTES.GET_LIST_LOCATION,
					ROUTES.PDF.GET_PROJECT_PDF_CONFIG,
					ROUTES.PDF.GENERATE_PROJECT_PDF,
					ROUTES.GET_ONE_PRODUCT,
					ROUTES.PROJECT_PRODUCT.GET_LIST_FINISH_SCHEDULE_FOR,
					ROUTES.GET_BRAND_LOCATIONS_COUNTRY_GROUP,
					ROUTES.GET_MARKET_DISTRIBUTOR_COUNTRY_GROUP,
					ROUTES.MATERIAL_CODE.GET_LIST_CODE_MATERIAL_CODE,
					ROUTES.PROJECT_PRODUCT.GET_PROJECT_ASSIGN_ZONE_BY_PRODUCT,
        ]
      }
    ]
	},
	{
		logo: "/logo/administration.svg",
		name: "ADMINISTRATION",
		parent_id: null,
		type: 3,
		routes: [],
		index: 37,
		id: "3759fcf9-63ec-4e58-93c7-c1a5eb7b4a82",
		subs: [{
				logo: "/logo/office.svg",
				name: "Office Profile",
				type: 3,
				index: 38,
				id: "a8b87976-6777-4a42-a843-bc0de1af1e86",
				routes: [
					ROUTES.DESIGN_FIRM.UPDATE_DESIGN_FIRM,
				]
			},
			{
				logo: "/logo/location.svg",
				name: "Locations",
				type: 3,
				index: 39,
				id: "5d786f2a-e49e-4062-9dac-16b1d36ae501",
				routes: [
					ROUTES.GET_LIST_LOCATION,
					ROUTES.CREATE_LOCATION,
					ROUTES.GET_ONE_LOCATION,
					ROUTES.EDIT_LOCATION,
					ROUTES.DELETE_LOCATION
				]
			},
			{
				logo: "/logo/team_profile.svg",
				name: "Team Profiles",
				type: 3,
				index: 40,
				id: "1d61b55c-1ff7-4c53-b4dd-7777155652a2",
				routes: [
					ROUTES.GET_LIST_TEAM_PROFILE,
					ROUTES.GET_LIST_LOCATION_WITH_GROUP,
					ROUTES.GET_LIST_PERMISSION,
					ROUTES.CREATE_TEAM_PROFILE,
					ROUTES.SEND_INVITE_TEAM_PROFILE,
					ROUTES.GET_ONE_TEAM_PROFILE,
					ROUTES.EDIT_TEAM_PROFILE,
					ROUTES.DELETE_TEAM_PROFILE
				]
			},
			{
				logo: "/logo/material.svg",
				name: "Material/Product Code",
				type: 3,
				index: 41,
				id: "c42cddf7-0605-481d-b1f6-47ec97b1286f",
				routes: [
					ROUTES.CREATE_MATERIAL_CODE,
					ROUTES.UPDATE_MATERIAL_CODE,
					ROUTES.DELETE_MATERIAL_CODE,
					ROUTES.GET_LIST_MATERIAL_CODE,
					ROUTES.GET_ONE_MATERIAL_CODE,
				]
			}
		]
	}
]


export const up = (connection: ConnectionInterface) => {
	const now = moment().format('YYYY-MM-DD HH:mm:ss');
	const data = permissionData.reduce((res, permission) => {
		const {subs, ...rest} = permission;
		res.push({
			...rest,
			parent_id: null,
			created_at: now,
			updated_at: now,
			deleted_at: null
		})
		if (subs) {
			res = res.concat(subs.map((sub) => {
				return {
					...sub,
					parent_id: permission.id,
					created_at: now,
					updated_at: now,
				};
			}));
		}
		return res;
	}, [] as any);

  return connection.insert('permissions',data);
}
