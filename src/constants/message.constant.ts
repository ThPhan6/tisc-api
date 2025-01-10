export const MESSAGES = {
  GENERAL: {
    AVAILABLE: "Available.",
    INVITED_ALREADY: "Invited.",
    SUCCESS: "Success.",
    SOMETHING_WRONG: "Something wrong!",
    SOMETHING_WRONG_CREATE: "Something went wrong creating!",
    SOMETHING_WRONG_UPDATE: "Something went wrong updating!",
    SOMETHING_WRONG_DELETE: "Something went wrong deleting!",
    BLOCKED: "Blocked!",
    INVITED: "Invited",
    SOMETHING_WRONG_CONTACT_SYSADMIN:
      "Something went wrong. Please contact to the administrator!",
    CAN_NOT_MODIFY_MASTER_DATA: "Can not modify master data",
    CAN_NOT_DELETE_MASTER_DATA: "Can not delete master data",
    NOT_AUTHORIZED_TO_ACCESS:
      "You do not have permission to access this resource",
    NOT_AUTHORIZED_TO_PERFORM:
      "You do not have permission to perform this action",
    NOT_FOUND: "Not found!",
    SERVER_BUSY: "The system is busy. Please try again later!",
    INVALID_TOKEN_SIGNATURE: "Invalid token signature",
  },

  LOCATION: {
    USER_USED: "This location is using in Team Profile",
    NOT_LOGISTIC: "The location is not Logistic Facility & Warehouse",
  },

  FAVOURITE: {
    ALREADY_SKIPPED: "You skipped already",
    ALREADY_RETRIEVED: "You retrieved already",
    FAILED_TO_SKIP:
      "Something wrong when skip this action, please try again later!",
    FAILED_TO_RETRIEVE:
      "Something wrong when retrieve your favourite, please try again later!",
  },

  BASIS: {
    BASIS_CONVERSION_GROUP_DUPLICATED: "Basis conversion group duplicated.",
    BASIS_CONVERSION_NOT_FOUND: "Basis conversion not found",
    BASIS_CONVERSION_DUPLICATED: "Conversion duplicated.",
    BASIS_OPTION_EXISTED: "Basis option existed.",
    BASIS_OPTION_DUPLICATED: "Basis option names duplicated.",
    BASIS_OPTION_NOT_FOUND: "Basis option not found",
    BASIS_PRESET_DUPLICATED: "Basis preset names duplicated.",
    BASIS_PRESET_EXISTED: "Basis preset existed.",
    BASIS_PRESET_NOT_FOUND: "Basis preset not found",
    BASIS_NOT_FOUND: "Basis not found",
    BASIS_CONVERSION_EXISTED: "Basis conversion existed",
  },

  ATTRIBUTE: {
    ATTRIBUTE_EXISTED: "Attribute existed.",
    ATTRIBUTE_NOT_FOUND: "Attribute not found",
    GROUP_ATTRIBUTE_DUPLICATED: "Attribute groups duplicated.",
  },

  IMAGE: {
    IMAGE_INVALID: "Image invalid",
    LOGO_NOT_VALID: "Logo not valid",
  },

  CATEGORY: {
    CATEGORY_NOT_FOUND: "Category not found",
  },

  PRODUCT: {
    PRODUCT_EXISTED: "Product existed.",
    PRODUCT_NOT_FOUND: "Product not found",
    WAS_USED_IN_PROJECT: "This product is using in some projects!",
  },

  MARKET_AVAILABILITY: {
    MARKET_AVAILABILITY_EXISTED: "Market availability existed",
    MARKET_AVAILABILITY_NOT_FOUND: "Market availability not found",
  },

  DISTRIBUTOR: {
    DISTRIBUTOR_EXISTED: "Distributor existed",
    DISTRIBUTOR_NOT_FOUND: "Distributor not found",
  },

  PARTNER: {
    PARTNER_NOT_FOUND: "Partner not found",
    PARTNER_EXISTED: "Partner is existed.",
    AFFILIATION_EXISTS: "Afiliation already exists.",
    RELATION_EXISTS: "Relation already exists.",
    ACQUISITION_EXISTS: "Acquisition already exists.",
  },

  BRAND: {
    BRAND_NOT_FOUND: "Brand not found",
    NOT_IN_BRAND: "You are not in this brand",
  },

  COUNTRY_STATE_CITY: {
    COUNTRY_STATE_CITY_NOT_FOUND:
      "Not found location, please check country state city id",
  },

  DESIGNER: {
    DESIGN_NOT_FOUND: "Design not found",
  },

  PERMISSION: {
    NO_MODIFY_ADMIN_PERM: "Cannot modify admin permission.",
  },

  DOCUMENTATION: {
    CAN_NOT_DELETE_DOCUMENTATION: "Cannot delete how to documentation",
    NOT_FOUND_DOCUMENTATION: "Not found documentation !",
  },

  MATERIAL_CODE: {
    MAIN_MATERIAL_CODE_DUPLICATED: "Main material code duplicated",
    SUB_MATERIAL_CODE_DUPLICATED: "Main material code duplicated",
    MATERIAL_CODE_DUPLICATE: "Material code duplicated",
    MATERIAL_CODE_NOT_FOUND: "Material code not found",
    MATERIAL_CODE_EXISTED: "Material code is existed",
    CAN_NOT_DELETE: "This material code is using, can't delete",
  },

  GENERAL_INQUIRY: {
    NOT_FOUND: "General inquiry not found",
  },
  ACTION_TASK: {
    NOT_FOUND: "Action task not found",
  },
  INVOICE: {
    PAID: "This invoice is paid.",
    NOT_FOUND: "Revenue service not found.",
    ONLY_UPDATE_PENDING_INVOICE: "Only pending invoice is valid to update.",
    ONLY_BILL_PENDING_INVOICE: "Only pending invoice is valid to bill.",
    ONLY_PAID_OUTSTANDING_OR_OVERDUE:
      "Only outstanding or overdue invoice is valid to paid.",
  },

  PROJECT_TRACKING: {
    PROJECT_TRACKING_NOT_FOUND: "Project tracking not found.",
    NOTIFICATION_NOT_FOUND: "Notification not found",
    REQUEST_NOT_FOUND: "Request not found",
  },
  //delete after refactor finish
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
  STATUS_NOT_FOUND: "Status not found",
  USER_EXISTED: "User existed",
  EMAIL_USED: "Email is already used",
  VERIFICATION_LINK_HAS_EXPIRED: "Verified.",
  EMAIL_ALREADY_USED:
    "This email address is already taken. Please try another.",
  CURRENT_USER_NOT_FOUND: "Not found current user",
  USER_NOT_IN_WORKSPACE: "User not in this work space",
  WORKSPACE_NOT_FOUND: "Work space not found",
  AVATAR_NOT_VALID: "Avatar not valid",
  LOGO_NOT_VALID: "Logo not valid",
  CONTACT_NOT_FOUND: "Contact not found",
  PERMISSION_NOT_FOUND: "Permission not found",
  CATEGORY_NOT_FOUND: "Category not found",
  CATEGORY_NOT_BELONG_TO_BRAND: "Category not belong to any brand",
  CATEGORY_IN_PRODUCT: "Some products use this category. So, cannot delete.",
  CATEGORY_EXISTED: "Category existed",
  NOT_FOUND: "Not found",
  COLLECTION_EXISTED: "Collection existed.",
  PRODUCT_EXISTED: "Product existed.",
  PRICE_NOT_FOUND: "Price not found",
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
  IMAGE_UPLOAD_FAILED: "Failed to upload image",
  BASIS_OPTION_NOT_FOUND: "Basis option not found",
  LOCATION_NOT_FOUND: "Location not found",
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_DUPLICATED: "Product duplicated",
  PRODUCT_DUPLICATED_INFORMATION:
    "Duplicated the product information. Please try with another product ID.",
  PRODUCT_TIP_NOT_FOUND: "Product tip not found",
  PRODUCT_TIP_EXISTED: "Product tip existed",
  CONTENT_TIP_MAX_WORDS: "Content max 100 words",
  BASIS_PRESET_NOT_FOUND: "Basis preset not found",
  COLLECTION_NOT_FOUND: "Collection not found",
  CANNOT_CHANGE_COLOR_COLLECTION: "Cannot change color collection",
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
  PRODUCT_ALREADY_ASSIGNED: "Product already assigned to this project",
  JUST_DESIGNER_CAN_CREATE: "Just designer can create",
  JUST_DESIGNER_CAN_UPDATE: "Just designer can update",

  PROJECT_ZONE_EXISTED: "Project zone existed",
  PROJECT_ZONE_AREA_DUPLICATED: "Project zone area duplicated.",
  PROJECT_ZONE_ROOM_DUPLICATED: "Project zone room duplicated.",
  PROJECT_ZONE_NOT_FOUND: "Project zone not found",
  MATERIAL_CODE_NOT_FOUND: "Material code not found",
  CONSIDERED_PRODUCT_NOT_FOUND: "Considered product not found",
  DESIGN_NOT_FOUND: "Design not found",
  CONSIDER_PRODUCT_NOT_FOUND: "Consider product not found",
  PRODUCT_WAS_SPECIFIED_ALREADY: "Can not remove because product was specified",

  SPECIFIED_PRODUCT_NOT_FOUND: "Specified product not found",
  UNIT_TYPE_NOT_FOUND: "Unit type not found",
  EMAIL_SENT: "Email sent!",
  BRAND_INACTIVE_LOGIN: "Sorry! Your brand was inactive. Can not login.",
  DESIGN_INACTIVE_LOGIN: "Sorry! Your design firm was inactive. Can not login.",
  ACCOUNT_INACTIVE_LOGIN: "Sorry! Your account was inactive. Can not login.",
  PROJECT_ZONE_MISSING: "Project zone is missing",
  ZONE_WAS_CONSIDERED: "Space is currently considered, you can not delete it!",
  ZONE_WAS_SPECIFIED: "Space is currently specified, you can not delete it!",
  DESIGNER_NOT_FOUND: "Not found designer.",
  FINISH_SCHEDULE: {
    ROOM_DOES_NOT_EXIST: "Invalid Rooms. Please check allowcation!",
    MISSING_ROOM_DATA: "Please update Finish Schedule!",
  },
  PROJECT_TRACKING_NOT_FOUND: "Project tracking not found.",
  PDF_SPECIFY: {
    ERROR_CREATE:
      "Something went wrong when get PDF config. Please contact to the administrator",
    NOT_FOUND: "Please update Issuing information!",
  },
  PROJECT_PRODUCT: {
    INCORRECT_SPECIFICATION: "Please re-update specification of this product",
  },

  customResource: {
    existed: "Resource existed",
    notFound: "Resource not found",
    haveProduct: "A brand associated with products cannot be deleted.",
  },

  BOOKING: {
    TIMEZONE: {
      NOT_VALID: "Timezone invalid data, ex: Asia/Singapore",
    },
    TIME_STAMP: {
      NOT_VALID: "The start time or end time invalid timestamp data",
      LARGE_THAN:
        "The end time must be large than start time and large than today",
    },
    NOT_AVAILABLE: "This booking is not available",
    NOT_FOUND: "Not found booking",
    SCHEDULE_NOT_AVAILABLE: "Can't get on Saturday or Sunday",
  },
  JUST_SHARE_IN_DESIGN_FIRM: "Just share to user in the same design firm.",
  CONFIGURATION_STEP_QUANTITIES_NOT_EQUAL_TO_AUTO_STEP_REPLICATE:
    "The quantity not match with require number, please check it!",
  LABEL_EXISTED: "Label existed.",
  LABEL_NOTFOUND: "Label not found.",
  SUB_LABEL_NOTFOUND: "Sub-label not found.",
  CANNOT_MOVE_TO_PARENT: "Cannot move sub-label to its parent label.",
  INVENTORY_NOT_FOUND: "Inventory not found",
  INVENTORY_BASE_PRICE_NOT_FOUND: "Inventory base price not found",
  INVENTORY_VOLUME_PRICE_NOT_FOUND: "Inventory volume price not found",
  INVENTORY_LEDGER_NOT_FOUND: "Inventory ledger not found",
  SOMETHING_WRONG_CREATE_INVENTORY_BASE_PRICE:
    "Something went wrong when create inventory base price",
  SOMETHING_WRONG_CREATE_INVENTORY_VOLUME_PRICE:
    "Something went wrong when create inventory volume price",
  BASE_CURRENCY_NOT_FOUND: "Base currency not found",
  EXCHANGE_HISTORY_NOT_FOUND: "Exchange history not found",
  EXCHANGE_CURRENCY_SUCCESS: "Exchange currency success",
  SOMETHING_WRONG_EXCHANGE_CURRENCY:
    "Something went wrong when exchange currency",
  EXCHANGE_CURRENCY_THE_SAME: "Cannot exchange the same currency",
  LESS_THAN_ZERO: "Value must be greater than or equal to 0",
  INVALID_EXPORT_TYPE: "Invalid export type",

  WAREHOUSE: {
    NOT_FOUND: "Warehouse not found",
    IN_STOCK_NOT_FOUND: "Warehouse In Stock not found",
    EXISTED: "Warehouse existed",
    LESS_THAN_ZERO: "In Stock must be positive number",
    NOT_AVAILABLE: "Warehouse not available.",
    SUM_IN_STOCK: "Total In Stock is greater than Backorder",
    BACK_ORDER_NOT_FOUND: "Warehouse Back Order not found",
    LOCATION_DUPLICATED: "Warehouses duplicated",
    REQUIRED: "Warehouse is required",
  },
  INVENTORY: {
    INVALID_DATA_INSERT:
      "Invalid data for the items that need to be inserted. Please check them.",
    NOT_FOUND_LEDGER: "Inventory ledger not found",
    NOT_FOUND_ACTION: "Inventory action not found",
    SKU_EXISTED: "SKU existed",
    UNIT_PRICE_REQUIRED: "Unit price is required",
    UNIT_TYPE_REQUIRED: "Unit type is required",
    INVALID_VOLUME_PRICES: "Invalid volume prices",
    ON_ORDER_LESS_THAN_ZERO: "On Order must be positive number",
    UNIT_PRICE_LESS_THAN_ZERO: "On Order must be positive number",
    BACK_ORDER_LESS_THAN_ZERO: "Back Order must be positive number",
    SKU_REQUIRED: "SKU is required",
    BELONG_TO_ANOTHER_CATEGORY:
      "Inventory has been created in another category",
  },
};
