export const EMAIL_TYPE = {
  VERIFICATION: "verification",
  FORGOT_PASSWORD: "forgot_password",
};

export const SYSTEM_TYPE = {
  TISC: 1,
  BRAND: 2,
  DESIGN: 3,
};

export const MODEL_NAMES = {
  DOCUMENTTATIONS: "documentations",
};
export const VALID_AVATAR_TYPES = ["image/png", "image/jpg"];

export const BRAND_STATUSES = {
  ACTIVE: 0,
  INACTIVE: 1,
  PENDING: 2,
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
  ACTIVE: 0,
  INACTIVE: 1,
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
  COLLECTION_EXISTS: "Collection exists.",
  PRODUCT_EXISTS: "Product exists.",
  ATTRIBUTE_EXISTS: "Attribute exists.",
  BASIS_OPTION_EXISTS: "Basis option exists.",
  BASIS_PRESET_EXISTS: "Basis preset exists.",
  DUPLICATED_ATTRIBUTE: "Duplicated attributes.",
  DUPLICATED_BASIS_OPTION: "Duplicated basis option names.",
  DUPLICATED_BASIS_PRESET: "Duplicated basis preset names.",
  DUPLICATED_GROUP_ATTRIBUTE: "Duplicated group attributes.",
  NOT_FOUND_ATTRIBUTE: "Not found attributes.",
  BASIS_CONVERSION_EXISTS: "Basis conversion exists",
  BASIS_CONVERSION_NOT_FOUND: "Basis conversion not found",
  BASIS_NOT_FOUND: "Basis not found",
  DUPLICATED_BASIS_CONVERSION_GROUP: "Duplicated basis conversion group.",
  DUPLICATED_BASIS_CONVERSION: "Duplicated conversion.",
  DUPLICATED_CATEGORY: "Duplicated category",
  DUPLICATED_SUB_CATEGORY: "Duplicated sub category",
  DUPLICATED_MAIN_CATEGORY: "Duplicated main category",
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
