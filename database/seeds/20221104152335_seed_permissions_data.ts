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
		id: "permission_0"
	},
	{
		logo: "/logo/user_group.svg",
		name: "USER GROUP",
		parent_id: null,
		type: 1,
		routes: [],
		index: 1,
		id: "permission_1",
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
				id: "permission_1_0",
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
				id: "permission_1_1",
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
		id: "permission_2",
    subs: [
      {
        logo: "/logo/list.svg",
    		name: "Listing",
    		type: 1,
    		routes: [],
				index: 5,
				id: "permission_2_0",
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
		id: "permission_3",
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
				id: "permission_3_0",
			},
			{
				logo: "/logo/basis.svg",
				name: "Basis",
				type: 1,
				index: 8,
				id: "permission_3_1",
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
				id: "permission_3_2",
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
				id: "permission_3_3",
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
		id: "permission_4",
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
				id: "permission_4_0",
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
				id: "permission_4_1",
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
				id: "permission_4_2",
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
				id: "permission_4_3",
			},
			{
				logo: "/logo/revenue.svg",
				name: "Revenues",
				type: 1,
				index: 16,
				id: "permission_4_4",
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
		id: "permission_5",
	},
	{
		logo: "/logo/product.svg",
		name: "PRODUCTS",
		parent_id: null,
		type: 2,
		index: 18,
		id: "permission_6",
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
		id: "permission_7",
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
		id: "permission_8",
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
		id: "permission_9",
		subs: [{
				logo: "/logo/brand.svg",
				name: "Brand Profile",
				type: 2,
				index: 22,
				id: "permission_9_0",
				routes: [
					ROUTES.UPDATE_BRAND_PROFILE
				]
			},
			{
				logo: "/logo/location.svg",
				name: "Locations",
				type: 2,
				index: 23,
				id: "permission_9_1",
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
				id: "permission_9_2",
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
				id: "permission_9_3",
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
				id: "permission_9_4",
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
				id: "permission_9_5",
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
		id: "permission_10",
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
		id: "permission_11",
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
		id: "permission_12",
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
		id: "permission_13",
    subs: [
      {
        logo: null,
        name: "Overal Listing",
        type: 3,
				index: 32,
				id: "permission_13_0",
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
				id: "permission_13_1",
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
				id: "permission_13_2",
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
				id: "permission_13_3",
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
				id: "permission_13_4",
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
		id: "permission_14",
		subs: [{
				logo: "/logo/office.svg",
				name: "Office Profile",
				type: 3,
				index: 38,
				id: "permission_14_1",
				routes: [
					ROUTES.DESIGN_FIRM.UPDATE_DESIGN_FIRM,
				]
			},
			{
				logo: "/logo/location.svg",
				name: "Locations",
				type: 3,
				index: 39,
				id: "permission_14_2",
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
				id: "permission_14_3",
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
				id: "permission_14_4",
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
