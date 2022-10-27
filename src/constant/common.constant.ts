import { ProjectStatus, ProjectStatusValue } from "@/types";
import {
  InterestedInKey,
  InterestedInValue,
  MeasurementUnitKey,
  MeasurementUnitValue,
  RegionKey,
  TargetedForKey,
  TargetedForValue,
  TopicTypeKey,
  TopicTypeValue,
  DocumentationType,
} from "../type/common.type";
export const EMAIL_TYPE = {
  VERIFICATION: "verification",
  FORGOT_PASSWORD: "forgot_password",
};

export const VALID_IMAGE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

export const MESSAGES = {
  SUCCESS: "Success.",
  AVAILABLE: "Available.",
  SOMETHING_WRONG: "Something wrong !",
  SOMETHING_WRONG_CREATE: "Something wrong when create !",
  SOMETHING_WRONG_UPDATE: "Something wrong when update !",
  SOMETHING_WRONG_DELETE: "Something wrong delete !",
  NOT_FOUND_DOCUMENTATION: "Not found documentation !",
  ACCOUNT_NOT_EXIST: "Account does not exist",
  VERIFY_ACCOUNT_FIRST: "Please verify your account first",
  PASSWORD_NOT_CORRECT: "Your password is not correct",
  USER_ROLE_NOT_FOUND: "Please login in the right section.",
  SEND_EMAIL_WRONG: "Something wrong when send email",
  USER_NOT_FOUND: "User not found",
  USER_EXISTED: "User existed",
  EMAIL_USED: "Email is already used",
  VERIFICATION_LINK_HAS_EXPIRED: "Verified.",
  EMAIL_ALREADY_USED:
    "This email address is already taken. Please try another.",
  CURRENT_USER_NOT_FOUND: "Not found current user",
  USER_NOT_IN_WORKSPACE: "User not in this work space",
  AVATAR_NOT_VALID: "Avatar not valid",
  LOGO_NOT_VALID: "Logo not valid",
  CONTACT_NOT_FOUND: "Contact not found",
  PERMISSION_NOT_FOUND: "Permission not found",
  CATEGORY_NOT_FOUND: "Category not found",
  CATEGORY_IN_PRODUCT: "Some products use this category. So, cannot delete.",
  CATEGORY_EXISTED: "Category existed",
  NOT_FOUND: "Not found",
  COLLECTION_EXISTED: "Collection existed.",
  PRODUCT_EXISTED: "Product existed.",
  ATTRIBUTE_EXISTED: "Attribute existed.",
  ATTRIBUTE_DUPLICATED: "Attributes duplicated.",
  GROUP_ATTRIBUTE_DUPLICATED: "Attribute groups duplicated.",
  ATTRIBUTE_NOT_FOUND: "Attribute not found",
  CATEGORY_DUPLICATED: "Category duplicated",
  SUB_CATEGORY_DUPLICATED: "Sub category duplicated",
  MAIN_CATEGORY_DUPLICATED: "Main category duplicated",
  IMAGE_INVALID: "Image invalid",
  LOCATION_NOT_FOUND: "Location not found",
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_DUPLICATED: "Product duplicated",
  PRODUCT_TIP_NOT_FOUND: "Product tip not found",
  PRODUCT_TIP_EXISTED: "Product tip existed",
  CONTENT_TIP_MAX_WORDS: "Content max 100 words",
  COLLECTION_NOT_FOUND: "Collection not found",
  CANNOT_DELETE_COLLECTION_HAS_PRODUCT:
    "Cannot delete collection has products.",
  PRODUCT_DOWNLOAD_EXISTED: "Product download existed",
  PRODUCT_DOWNLOAD_NOT_FOUND: "Product download not found",
  QUOTATION_MAX_WORD: "Quotation max 120 words",
  QUOTATION_NOT_FOUND: "Inspirational quotation not found",
  AUTO_EMAIL_NOT_FOUND: "Email autoresponders not found",
  BRAND_NOT_FOUND: "Brand not found",
  BRAND_EXISTED: "Brand existed",
  DISTRIBUTOR_NOT_FOUND: "Distributor not found",
  DISTRIBUTOR_EXISTED: "Distributor existed",

  PRODUCT_CATELOGUE_DOWNLOAD_EXISTED: "Product download existed",
  PRODUCT_CATELOGUE_DOWNLOAD_NOT_FOUND: "Product download not found",
  LOGIN_INCORRECT_TYPE: "Please log in correct account type",
  DELETE_CURRENT_USER: "Cannot delete current user",
  COUNTRY_NOT_FOUND: "Country not found.",
  STATE_NOT_FOUND: "State not found.",
  CITY_NOT_FOUND: "City not found.",
  STATE_REQUIRED: "State is required.",
  CITY_REQUIRED: "City is required.",
  STATE_NOT_IN_COUNTRY: "State not in country",
  CITY_NOT_IN_STATE: "City not in state",
  COUNTRY_STATE_CITY_NOT_FOUND:
    "Not found location, please check country state city id",
  CANNOT_UPDATE_TO_OTHER_ROLE: "Cannot update user to this role.",
  PROJECT_EXISTED: "Project Code existed",
  PROJECT_NOT_FOUND: "Project not found",
  JUST_DESIGNER_CAN_CREATE: "Just designer can create project",
  JUST_OWNER_CAN_UPDATE:
    "You are not in this design firm. So you cannot update",
  JUST_OWNER_CAN_DELETE:
    "You are not in this design firm. So you cannot delete",
  JUST_OWNER_CAN_CREATE:
    "You are not in this design firm. So you cannot create",
  PROJECT_ZONE_EXISTED: "Project zone existed",
  PROJECT_ZONE_AREA_DUPLICATED: "Project zone area duplicated.",
  PROJECT_ZONE_ROOM_DUPLICATED: "Project zone room duplicated.",
  JUST_OWNER_CAN_GET: "You are not in this design firm. So you cannot get",
  PROJECT_ZONE_NOT_FOUND: "Project zone not found",
  MATERIAL_CODE_NOT_FOUND: "Material code not found",
  CONSIDERED_PRODUCT_NOT_FOUND: "Considered product not found",
  DESIGN_NOT_FOUND: "Design not found",
  CONSIDER_PRODUCT_NOT_FOUND: "Consider product not found",
  PRODUCT_WAS_SPECIFIED_ALREADY: "Can not remove because product was specified",
  FAVOURITE: {
    ALREADY_SKIPPED: "You skipped already",
    ALREADY_RETRIEVED: "You retrieved already",
    FAILED_TO_SKIP:
      "Something wrong when skip this action, please try again later!",
    FAILED_TO_RETRIEVE:
      "Something wrong when retrieve your favourite, please try again later!",
  },
  SPECIFIED_PRODUCT_NOT_FOUND: "Specified product not found",
  UNIT_TYPE_NOT_FOUND: "Unit type not found",
  EMAIL_SENT: "Email sent!",
  BRAND_INACTIVE_LOGIN: "Sorry! Your brand was inactive. Can not login.",
  DESIGN_INACTIVE_LOGIN: "Sorry! Your design firm was inactive. Can not login.",
  PROJECT_ZONE_MISSING: "Project zone is missing",
  ZONE_WAS_CONSIDERED: "Space is currently considered, you can not delete it!",
  ZONE_WAS_SPECIFIED: "Space is currently specified, you can not delete it!",
  PRODUCT_WAS_CONSIDERED:
    "Can not remove because product is considering in a project",
  PRODUCT_WAS_SPECIFIED:
    "Can not remove because product is specifying in a project",
};

export const BASIS_OPTION_STORE = "basis-option";

export const DOCUMENTATION_TYPES: {
  GENERAL: DocumentationType;
  TISC_HOW_TO: DocumentationType;
  BRAND_HOW_TO: DocumentationType;
  DESIGN_HOW_TO: DocumentationType;
} = {
  GENERAL: 1,
  TISC_HOW_TO: 2,
  BRAND_HOW_TO: 3,
  DESIGN_HOW_TO: 4,
};

export const TOPIC_TYPES: {
  MARKETING: TopicTypeValue;
  MESSAGES: TopicTypeValue;
  ONBOARD: TopicTypeValue;
  OPERATION: TopicTypeValue;
  OTHER: TopicTypeValue;
} = {
  MARKETING: 1,
  MESSAGES: 2,
  ONBOARD: 3,
  OPERATION: 4,
  OTHER: 5,
};

export const TOPIC_OPTIONS: {
  key: TopicTypeKey;
  value: TopicTypeValue;
}[] = [
  {
    key: "Marketing",
    value: TOPIC_TYPES.MARKETING,
  },
  {
    key: "Messages",
    value: TOPIC_TYPES.MESSAGES,
  },
  {
    key: "Onboard",
    value: TOPIC_TYPES.ONBOARD,
  },
  {
    key: "Operation",
    value: TOPIC_TYPES.OPERATION,
  },
  {
    key: "Other",
    value: TOPIC_TYPES.OTHER,
  },
];

export const TARGETED_FOR_TYPES: {
  BRAND: TargetedForValue;
  DESIGN_FIRM: TargetedForValue;
  DISTRIBUTOR: TargetedForValue;
  GENERAL: TargetedForValue;
  TISC_TEAM: TargetedForValue;
} = {
  BRAND: 1,
  DESIGN_FIRM: 2,
  DISTRIBUTOR: 3,
  GENERAL: 4,
  TISC_TEAM: 5,
};

export const TARGETED_FOR_OPTIONS: {
  key: TargetedForKey;
  value: TargetedForValue;
}[] = [
  {
    key: "TISC Team",
    value: TARGETED_FOR_TYPES.TISC_TEAM,
  },
  {
    key: "Brand",
    value: TARGETED_FOR_TYPES.BRAND,
  },
  {
    key: "Design Firm",
    value: TARGETED_FOR_TYPES.DESIGN_FIRM,
  },
  {
    key: "Distributor",
    value: TARGETED_FOR_TYPES.DISTRIBUTOR,
  },
  {
    key: "General",
    value: TARGETED_FOR_TYPES.GENERAL,
  },
];

export const REGION_KEY: {
  AFRICA: RegionKey;
  ASIA: RegionKey;
  EUROPE: RegionKey;
  NORTH_AMERICA: RegionKey;
  OCEANIA: RegionKey;
  SOUTH_AMERICA: RegionKey;
  AMERICAS: RegionKey;
  NORTHERN_AMERICA: RegionKey;
} = {
  AFRICA: "africa",
  ASIA: "asia",
  EUROPE: "europe",
  NORTH_AMERICA: "north america",
  OCEANIA: "oceania",
  SOUTH_AMERICA: "south america",
  AMERICAS: "americas",
  NORTHERN_AMERICA: "northern_america",
};

export const LOGO_PATH = {
  MY_WORKSPACE: "/logo/my_workspace.svg",
  USER_GROUP: "/logo/user_group.svg",
  PROJECT: "/logo/project.svg",
  LIST: "/logo/list.svg",
  PRODUCT: "/logo/product.svg",
  ADMINISTRATION: "/logo/administration.svg",
  GENERAL_INQUIRY: "/logo/general_inquires.svg",
  PROJECT_TRACKING: "/logo/project_tracking.svg",
  FAVORITE: "/logo/favourite.svg",
  SUBSCRIPTION: "/logo/subscription.svg",
  MARKET: "/logo/market_availability.svg",
  DISTRIBUTOR: "/logo/distributor.svg",
  REVENUE: "/logo/revenue.svg",
  MESSAGE: "/logo/message.svg",
  TEAM_PROFILE: "/logo/team_profile.svg",
  LOCATION: "/logo/location.svg",
  DOCUMENTATION: "/logo/documentation.svg",
  CONFIGURATION: "/logo/configuration.svg",
  ATTRIBUTE: "/logo/attribute.svg",
  BASIS: "/logo/basis.svg",
  CATEGORY: "/logo/category.svg",
  BRAND: "/logo/brand.svg",
  DESIGN: "/logo/design.svg",
  OFFICE: "/logo/office.svg",
  MATERIAL: "/logo/material.svg",
};

export const PROJECT_STATUS_OPTIONS: {
  key: ProjectStatus;
  value: ProjectStatusValue;
}[] = [
  {
    key: ProjectStatus.Live,
    value: 0,
  },
  {
    key: ProjectStatus["On Hold"],
    value: 1,
  },
  {
    key: ProjectStatus.Archived,
    value: 2,
  },
];
export const MEASUREMENT_UNIT: {
  IMPERIAL: MeasurementUnitValue;
  METRIC: MeasurementUnitValue;
} = {
  IMPERIAL: 1,
  METRIC: 2,
};
export const MEASUREMENT_UNIT_OPTIONS: {
  key: MeasurementUnitKey;
  value: MeasurementUnitValue;
}[] = [
  {
    key: "Metric",
    value: MEASUREMENT_UNIT.METRIC,
  },
  {
    key: "Imperial",
    value: MEASUREMENT_UNIT.IMPERIAL,
  },
];

export const INTERESTED_IN: {
  BRAND_FACTORY: InterestedInValue;
  DESIGN_CONFERENCE: InterestedInValue;
  INDUSTRY_EXHIBITION: InterestedInValue;
  PRODUCT_LAUNCHES: InterestedInValue;
  PRODUCT_RECOMMENDATION: InterestedInValue;
} = {
  BRAND_FACTORY: 1,
  DESIGN_CONFERENCE: 2,
  INDUSTRY_EXHIBITION: 3,
  PRODUCT_LAUNCHES: 4,
  PRODUCT_RECOMMENDATION: 5,
};
export const INTERESTED_IN_OPTIONS: {
  key: InterestedInKey;
  value: InterestedInValue;
}[] = [
  {
    key: "Brand Factory/Showroom Visits",
    value: INTERESTED_IN.BRAND_FACTORY,
  },
  {
    key: "Design Conferences/Events/Seminars",
    value: INTERESTED_IN.DESIGN_CONFERENCE,
  },
  {
    key: "Industry Exhibitions/Trade Shows",
    value: INTERESTED_IN.INDUSTRY_EXHIBITION,
  },
  {
    key: "Product Launches/Promotions/Workshops",
    value: INTERESTED_IN.PRODUCT_LAUNCHES,
  },
  {
    key: "Product Recommendations/Updates",
    value: INTERESTED_IN.PRODUCT_RECOMMENDATION,
  },
];

export const COMMON_TYPES = {
  SHARING_GROUP: 1,
  SHARING_PURPOSE: 2,
};
