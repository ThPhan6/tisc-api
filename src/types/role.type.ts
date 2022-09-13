export interface RoleType {
  TISC: 1,
  BRAND: 2,
  DESIGN: 3,
}
export type RoleTypeValue = RoleType[keyof RoleType];
