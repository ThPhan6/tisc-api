import {
  ConsiderProductStatusKey,
  ConsiderProductStatusValue,
  OrderMethodKey,
  OrderMethodValue,
  InterestedInKey,
  InterestedInValue,
  MeasurementUnitKey,
  MeasurementUnitValue,
  ProjectStatusKey,
  ProjectStatusValue,
  RegionKey,
  TargetedForKey,
  TargetedForValue,
  TopicTypeKey,
  TopicTypeValue,
  ISystemType,
  BrandStatusKey,
  BrandStatusValue,
  DesignStatusKey,
  DesignStatusValue,
  BasisType,
  AttributeType,
  DocumentationType,
} from "../type/common.type";
export const EMAIL_TYPE = {
  VERIFICATION: "verification",
  FORGOT_PASSWORD: "forgot_password",
};

export const SYSTEM_TYPE: ISystemType = {
  TISC: 1,
  BRAND: 2,
  DESIGN: 3,
};

export const VALID_IMAGE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

export const BRAND_STATUSES: {
  ACTIVE: BrandStatusValue;
  INACTIVE: BrandStatusValue;
  PENDING: BrandStatusValue;
} = {
  ACTIVE: 1,
  INACTIVE: 2,
  PENDING: 3,
};

export const BRAND_STATUS_OPTIONS: {
  key: BrandStatusKey;
  value: BrandStatusValue;
}[] = [
  {
    key: "Active",
    value: BRAND_STATUSES.ACTIVE,
  },
  {
    key: "Pending",
    value: BRAND_STATUSES.PENDING,
  },
  {
    key: "Inactive",
    value: BRAND_STATUSES.INACTIVE,
  },
];

export const DESIGN_STATUSES: {
  ACTIVE: DesignStatusValue;
  INACTIVE: DesignStatusValue;
} = {
  ACTIVE: 1,
  INACTIVE: 2,
};

export const DESIGN_STATUS_OPTIONS: {
  key: DesignStatusKey;
  value: DesignStatusValue;
}[] = [
  {
    key: "Active",
    value: DESIGN_STATUSES.ACTIVE,
  },
  {
    key: "Inactive",
    value: DESIGN_STATUSES.INACTIVE,
  },
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
  EMAIL_ALREADY_USED: "Email is already used, please use other email.",
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
  BASIS_OPTION_EXISTED: "Basis option existed.",
  BASIS_PRESET_EXISTED: "Basis preset existed.",
  ATTRIBUTE_DUPLICATED: "Attributes duplicated.",
  BASIS_OPTION_DUPLICATED: "Basis option names duplicated.",
  BASIS_PRESET_DUPLICATED: "Basis preset names duplicated.",
  GROUP_ATTRIBUTE_DUPLICATED: "Attribute groups duplicated.",
  ATTRIBUTE_NOT_FOUND: "Attribute not found",
  BASIS_CONVERSION_EXISTED: "Basis conversion existed",
  BASIS_CONVERSION_NOT_FOUND: "Basis conversion not found",
  BASIS_NOT_FOUND: "Basis not found",
  BASIS_CONVERSION_GROUP_DUPLICATED: "Basis conversion group duplicated.",
  BASIS_CONVERSION_DUPLICATED: "Conversion duplicated.",
  CATEGORY_DUPLICATED: "Category duplicated",
  SUB_CATEGORY_DUPLICATED: "Sub category duplicated",
  MAIN_CATEGORY_DUPLICATED: "Main category duplicated",
  IMAGE_INVALID: "Image invalid",
  BASIS_OPTION_NOT_FOUND: "Basis option not found",
  LOCATION_NOT_FOUND: "Location not found",
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_DUPLICATED: "Product duplicated",
  PRODUCT_TIP_NOT_FOUND: "Product tip not found",
  PRODUCT_TIP_EXISTED: "Product tip existed",
  CONTENT_TIP_MAX_WORDS: "Content max 100 words",
  BASIS_PRESET_NOT_FOUND: "Basis preset not found",
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
  MARKET_AVAILABILITY_EXISTED: "Market availability existed",
  MARKET_AVAILABILITY_NOT_FOUND: "Market availability not found",

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
};

export const BASIS_TYPES: {
  CONVERSION: BasisType;
  PRESET: BasisType;
  OPTION: BasisType;
} = {
  CONVERSION: 1,
  PRESET: 2,
  OPTION: 3,
};
export const ATTRIBUTE_TYPES: {
  GENERAL: AttributeType;
  FEATURE: AttributeType;
  SPECIFICATION: AttributeType;
} = {
  GENERAL: 1,
  FEATURE: 2,
  SPECIFICATION: 3,
};

export const LONG_TEXT_ID = "aa4d21fe-c19b-40e3-aeaa-27423d794e27";
export const SHORT_TEXT_ID = "66d7e3c1-1c8f-4743-99bf-f607d5379504";

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
} = {
  AFRICA: "africa",
  ASIA: "asia",
  EUROPE: "europe",
  NORTH_AMERICA: "north america",
  OCEANIA: "oceania",
  SOUTH_AMERICA: "south america",
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

export const PROJECT_STATUS: {
  ARCHIVE: ProjectStatusValue;
  LIVE: ProjectStatusValue;
  ON_HOLD: ProjectStatusValue;
} = {
  ARCHIVE: 1,
  LIVE: 2,
  ON_HOLD: 3,
};
export const PROJECT_STATUS_OPTIONS: {
  key: ProjectStatusKey;
  value: ProjectStatusValue;
}[] = [
  {
    key: "Live",
    value: PROJECT_STATUS.LIVE,
  },
  {
    key: "On Hold",
    value: PROJECT_STATUS.ON_HOLD,
  },
  {
    key: "Archive",
    value: PROJECT_STATUS.ARCHIVE,
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

export const CONSIDERED_PRODUCT_STATUS: {
  CONSIDERED: ConsiderProductStatusValue;
  RE_CONSIDERED: ConsiderProductStatusValue;
  UNLISTED: ConsiderProductStatusValue;
} = {
  CONSIDERED: 1,
  RE_CONSIDERED: 2,
  UNLISTED: 3,
};

export const CONSIDERED_PRODUCT_STATUS_OPTIONS: {
  key: ConsiderProductStatusKey;
  value: ConsiderProductStatusValue;
}[] = [
  {
    key: "Considered",
    value: CONSIDERED_PRODUCT_STATUS.CONSIDERED,
  },
  {
    key: "Re-considered",
    value: CONSIDERED_PRODUCT_STATUS.RE_CONSIDERED,
  },
  {
    key: "Unlisted",
    value: CONSIDERED_PRODUCT_STATUS.UNLISTED,
  },
];

export const ORDER_METHOD: {
  DIRECT_PURCHASE: OrderMethodValue;
  CUSTOM_ORDER: OrderMethodValue;
} = {
  DIRECT_PURCHASE: 1,
  CUSTOM_ORDER: 2,
};

export const ORDER_METHOD_OPTIONS: {
  key: OrderMethodKey;
  value: OrderMethodValue;
}[] = [
  { key: "Direct Purchase", value: ORDER_METHOD.DIRECT_PURCHASE },
  { key: "Custom Order", value: ORDER_METHOD.CUSTOM_ORDER },
];
