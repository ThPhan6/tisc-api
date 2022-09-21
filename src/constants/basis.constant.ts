export type BasisType = 1 | 2 | 3;

export const BASIS_TYPES: {
  CONVERSION: BasisType;
  PRESET: BasisType;
  OPTION: BasisType;
} = {
  CONVERSION: 1,
  PRESET: 2,
  OPTION: 3,
};

export const BASIS_OPTION_STORE = "basis-option";

export const BASIS_MESSAGE = {
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
};
