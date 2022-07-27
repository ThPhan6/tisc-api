export const EMAIL_TYPE = {
  VERIFICATION: "verification",
  FORGOT_PASSWORD: "forgot_password",
};

export const SYSTEM_TYPE = {
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

export const BRAND_STATUSES = {
  ACTIVE: 1,
  INACTIVE: 2,
  PENDING: 3,
};

export const BRAND_STATUS_OPTIONS = [
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

export const DESIGN_STATUSES = {
  ACTIVE: 1,
  INACTIVE: 2,
};

export const DESIGN_STATUS_OPTIONS = [
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
  SOMETHING_WRONG: "Something wrong !",
  SOMETHING_WRONG_CREATE: "Something wrong when create !",
  SOMETHING_WRONG_UPDATE: "Something wrong when update !",
  SOMETHING_WRONG_DELETE: "Something wrong delete !",
  NOT_FOUND_DOCUMENTATION: "Not found documentation !",
  ACCOUNT_NOT_EXIST: "Account does not exist",
  VERIFY_ACCOUNT_FIRST: "Please verify your account first",
  PASSWORD_NOT_CORRECT: "Your password is not correct",
  USER_ROLE_NOT_FOUND: "Not found user role",
  SEND_EMAIL_WRONG: "Something wrong when send email",
  USER_NOT_FOUND: "User not found",
  USER_EXISTED: "User existed",
  EMAIL_USED: "Email is already used",
  VERIFICATION_LINK_HAS_EXPIRED: "Verification link has expired",
  CURRENT_USER_NOT_FOUND: "Not found current user",
  USER_NOT_IN_WORKSPACE: "User not in this work space",
  AVATAR_NOT_VALID: "Avatar not valid",
  LOGO_NOT_VALID: "Logo not valid",
  CONTACT_NOT_FOUND: "Contact not found",
  PERMISSION_NOT_FOUND: "Permission not found",
  CATEGORY_NOT_FOUND: "Category not found",
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
  CANNOT_UPDATE_TO_OTHER_ROLE: "Cannot update user to this role.",
};

export const BASIS_TYPES = {
  CONVERSION: 1,
  PRESET: 2,
  OPTION: 3,
};
export const ATTRIBUTE_TYPES = {
  GENERAL: 1,
  FEATURE: 2,
  SPECIFICATION: 3,
};

export const LONG_TEXT_ID = "aa4d21fe-c19b-40e3-aeaa-27423d794e27";
export const SHORT_TEXT_ID = "66d7e3c1-1c8f-4743-99bf-f607d5379504";

export const BASIS_OPTION_STORE = "basis-option";

export const DOCUMENTATION_TYPES = {
  GENERAL: 1,
  TISC_HOW_TO: 2,
  BRAND_HOW_TO: 3,
  DESIGN_HOW_TO: 4,
};

export const TOPIC_TYPES = {
  MARKETING: 1,
  MESSAGES: 2,
  ONBOARD: 3,
  OPERATION: 4,
  OTHER: 5,
};

export const TOPIC_OPTIONS = [
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

export const TARGETED_FOR_TYPES = {
  BRAND: 1,
  DESIGN_FIRM: 2,
  DISTRIBUTOR: 3,
  GENERAL: 4,
  TISC_TEAM: 5,
};

export const TARGETED_FOR_OPTIONS = [
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

export const REGION_KEY = {
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
