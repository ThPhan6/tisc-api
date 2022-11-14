import {
  CommonTypes,
  FunctionalTypeKey,
  FunctionalTypeValue,
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
};

export const FUNCTIONAL_TYPE: {
  MAIN_OFFICE: FunctionalTypeValue;
  SATELLITE_OFFICE: FunctionalTypeValue;
  OTHER: FunctionalTypeValue;
} = {
  MAIN_OFFICE: 1,
  SATELLITE_OFFICE: 2,
  OTHER: 3,
};
export const FUNCTIONAL_TYPE_OPTIONS: {
  name: FunctionalTypeKey;
  id: FunctionalTypeValue;
}[] = [
  {
    name: "Main office",
    id: FUNCTIONAL_TYPE.MAIN_OFFICE,
  },
  {
    name: "Satellite office",
    id: FUNCTIONAL_TYPE.SATELLITE_OFFICE,
  },
  {
    name: "Other",
    id: FUNCTIONAL_TYPE.OTHER,
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

export const SQUARE_METER_TO_SQUARE_FOOT = 10.76391;
