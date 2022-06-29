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
  EMAIL_USED: "Email is already used",
  VERIFICATION_LINK_HAS_EXPIRED: "Verification link has expired",
  CURRENT_USER_NOT_FOUND: "Not found current user",
  USER_IN_WORKSPACE_NOT_FOUND: "Not found user in your work space",
  AVATAR_NOT_VALID_FILE: "Not valid avatar file",
  CONTACT_NOT_FOUND: "Not found contact",
  NOTFOUND_PERMISSION: "Not found permission",
  CATEGORY_NOT_FOUND: "Category not found",
  CATEGORY_EXISTED: "Category existed",
  NOT_FOUND: "Not found",
  COLLECTION_EXISTED: "Collection existed.",
  PRODUCT_EXISTED: "Product existed.",
  NOT_FOUND_PRODUCT: "Not found product.",
  ATTRIBUTE_EXISTED: "Attribute existed.",
  BASIS_OPTION_EXISTED: "Basis option existed.",
  BASIS_PRESET_EXISTED: "Basis preset existed.",
  DUPLICATED_ATTRIBUTE: "Duplicated attributes.",
  DUPLICATED_BASIS_OPTION: "Duplicated basis option names.",
  DUPLICATED_BASIS_PRESET: "Duplicated basis preset names.",
  DUPLICATED_GROUP_ATTRIBUTE: "Duplicated group attributes.",
  NOT_FOUND_ATTRIBUTE: "Not found attributes.",
  BASIS_CONVERSION_EXISTED: "Basis conversion existed",
  BASIS_CONVERSION_NOT_FOUND: "Basis conversion not found",
  BASIS_NOT_FOUND: "Basis not found",
  DUPLICATED_BASIS_CONVERSION_GROUP: "Duplicated basis conversion group.",
  DUPLICATED_BASIS_CONVERSION: "Duplicated conversion.",
  DUPLICATED_CATEGORY: "Duplicated category",
  DUPLICATED_SUB_CATEGORY: "Duplicated sub category",
  DUPLICATED_MAIN_CATEGORY: "Duplicated main category",
  INVALID_IMAGE: "Invalid image",
  BASIS_OPTION_NOT_FOUND: "Basis option not found",
  NOT_FOUND_LOCATION: "Not found location",
  PRODUCT_NOT_FOUND: "Product not found",
  DUPLICATED_PRODUCT: "Duplicated product",
  PRODUCT_TIP_NOT_FOUND: "Product tip not found",
  PRODUCT_TIP_EXISTED: "Product tip existed",
  CONTENT_TIP_MAX_WORDS: "Content max 100 words",
  BASIS_PRESET_NOT_FOUND: "Basis preset not found",
  COLLECTION_NOT_FOUND: "Collection not found",
  PRODUCT_DOWNLOAD_EXISTED: "Product download existed",
  PRODUCT_DOWNLOAD_NOT_FOUND: "Product download not found",
  AUTO_EMAIL_NOT_FOUND: "Email autoresponders not found",
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
  {
    key: "TISC Team",
    value: TARGETED_FOR_TYPES.TISC_TEAM,
  },
];
