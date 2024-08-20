import {
  CommonTypes,
  InterestedInKey,
  InterestedInValue,
  MeasurementUnitKey,
  MeasurementUnitValue,
  TargetedForKey,
  TargetedForValue,
  TopicTypeKey,
  TopicTypeValue,
} from "@/types";

export const COMMON_TYPES: CommonTypes = {
  SHARING_GROUP: 1,
  SHARING_PURPOSE: 2,
  PROJECT_BUILDING: 3,
  FINISH_SCHEDULES: 4,
  COMPANY_FUNCTIONAL: 5,
  PROJECT_INSTRUCTION: 6,
  PROJECT_TYPE: 7,
  PROJECT_REQUIREMENT: 8,
  PROJECT_UNIT: 9,
  DEPARTMENT: 10,
  REQUEST_FOR: 11,
  ACTION_TASK: 12,
  ISSUE_FOR: 13,
  CAPABILITIES: 14,
  INVOICE: 15,
  PARTNER_AFFILIATION: 16,
  PARTNER_RELATION: 17,
  PARTNER_ACQUISITION: 18,
};

export const MEASUREMENT_UNIT: {
  IMPERIAL: MeasurementUnitValue;
  METRIC: MeasurementUnitValue;
} = {
  IMPERIAL: 1,
  METRIC: 2,
};
export const MEASUREMENT_UNIT_OPTIONS: {
  name: MeasurementUnitKey;
  id: MeasurementUnitValue;
}[] = [
  {
    name: "Metric",
    id: MEASUREMENT_UNIT.METRIC,
  },
  {
    name: "Imperial",
    id: MEASUREMENT_UNIT.IMPERIAL,
  },
];

export const MEASUREMENT_UNIT_TEXTS = {
  [MEASUREMENT_UNIT.IMPERIAL]: "sq.ft.",
  [MEASUREMENT_UNIT.IMPERIAL]: "sq.m.",
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
    key: "Payment",
    value: TOPIC_TYPES.OTHER,
  },
];

export enum TARGETED_FOR_TYPES {
  BRAND = 1,
  DESIGN_FIRM = 2,
  DISTRIBUTOR = 3,
  GENERAL = 4,
  TISC_TEAM = 5,
}

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

export const INTEREST_RATE = 36.5; // 36.5 %
export const SQUARE_METER_TO_SQUARE_FOOT = 10.76391;

export const ALL_REGIONS = [
  "Africa",
  "Asia",
  "Europe",
  "N. America",
  "Oceania",
  "S. America",
];

export const HeadquarterCompanyFunctionTypeId =
  "4d158e0d-7460-45a8-b618-9575333f2332";

export const CollectionsToBackup = [
  "action_tasks",
  "attributes",
  "bases",
  "blocked_ips",
  "bookings",
  "brands",
  "categories",
  "collections",
  "common_types",
  "company_permissions",
  "contacts",
  "custom_products",
  "custom_resources",
  "designers",
  "distributors",
  "documentations",
  "email_autoresponders",
  "general_inquiries",
  "inspirational_quotations",
  "invoices",
  "locations",
  "market_availabilities",
  "material_codes",
  "migrations",
  "permissions",
  "product_favourites",
  "products",
  "project_product_finish_schedules",
  "project_product_pdf_configs",
  "project_products",
  "project_requests",
  "project_tracking_notifications",
  "project_trackings",
  "project_zones",
  "projects",
  "roles",
  "seeds",
  "templates",
  "user_product_specifications",
  "users",
  "logs",
];
