import {
  STONE_COLOR_COLLECTIONS,
  STONE_COLOR_COLLECTION_IDS,
  WOOD_COLOR_COLLECTIONS,
} from "@/constants/collection.constant";

export const recommendStone = (
  saturation: number,
  lightness: number,
  hue: number
) => {
  if (saturation >= 11 && saturation <= 100) {
    //step 2
    let group = 1;

    switch (saturation) {
      case 11:
      case 12:
      case 13:
      case 14:
        if (0 <= lightness && lightness <= 17) group = 1;
        if (18 <= lightness && lightness <= 84) group = 2;
        if (85 <= lightness && lightness <= 100) group = 3;
        break;
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 21:
      case 22:
      case 23:
      case 24:
        if (0 <= lightness && lightness <= 12) group = 1;
        if (13 <= lightness && lightness <= 85) group = 2;
        if (86 <= lightness && lightness <= 100) group = 3;
        break;
      case 25:
      case 26:
      case 27:
      case 28:
      case 29:
      case 30:
      case 31:
      case 32:
      case 33:
      case 34:
      case 35:
        if (0 <= lightness && lightness <= 12) group = 1;
        if (13 <= lightness && lightness <= 88) group = 2;
        if (89 <= lightness && lightness <= 100) group = 3;
        break;
      case 36:
      case 37:
      case 38:
      case 39:
      case 40:
      case 41:
      case 42:
      case 43:
      case 44:
      case 45:
      case 46:
      case 47:
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
      case 58:
      case 59:
      case 60:
      case 61:
        if (0 <= lightness && lightness <= 12) group = 1;
        if (13 <= lightness && lightness <= 92) group = 2;
        if (93 <= lightness && lightness <= 100) group = 3;
        break;
      case 62:
      case 63:
      case 64:
      case 65:
        if (0 <= lightness && lightness <= 12) group = 1;
        if (13 <= lightness && lightness <= 94) group = 2;
        if (95 <= lightness && lightness <= 100) group = 3;
        break;
      case 66:
      case 67:
      case 68:
      case 69:
      case 70:
      case 71:
      case 72:
      case 73:
      case 74:
      case 75:
      case 76:
      case 77:
      case 78:
      case 79:
      case 80:
        if (0 <= lightness && lightness <= 11) group = 1;
        if (12 <= lightness && lightness <= 94) group = 2;
        if (95 <= lightness && lightness <= 100) group = 3;
        break;
      case 81:
      case 82:
      case 83:
      case 84:
      case 85:
      case 86:
      case 87:
      case 88:
      case 89:
      case 90:
      case 91:
      case 92:
      case 93:
      case 94:
      case 95:
      case 96:
      case 97:
      case 98:
        if (0 <= lightness && lightness <= 10) group = 1;
        if (11 <= lightness && lightness <= 94) group = 2;
        if (95 <= lightness && lightness <= 100) group = 3;
        break;
      case 99:
      case 100:
        if (0 <= lightness && lightness <= 9) group = 1;
        if (10 <= lightness && lightness <= 94) group = 2;
        if (95 <= lightness && lightness <= 100) group = 3;
        break;

      default:
        break;
    }
    let found;
    if (group === 1)
      found = STONE_COLOR_COLLECTIONS.find(
        (item) => item.id === STONE_COLOR_COLLECTION_IDS.BLACK_ALMOST_BLACK
      );

    if (group === 3)
      found = STONE_COLOR_COLLECTIONS.find(
        (item) => item.id === STONE_COLOR_COLLECTION_IDS.WHITE_OFFWHITE
      );
    if (found) return [found];
    if (group === 2) {
      //step 3
      found = STONE_COLOR_COLLECTIONS.filter(
        (item) => hue >= item.hue.from && hue <= item.hue.to
      );
    }
    return found || [];
  } else if (saturation >= 0 && saturation <= 10) {
    //step 1
    //1: black, 2: dark grey, 3: medium grey, 4: light grey, 5: white/off-white
    let group = 1;
    switch (saturation) {
      case 0:
      case 1:
      case 2:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 64) group = 2;
        if (65 <= lightness && lightness <= 75) group = 3;
        if (76 <= lightness && lightness <= 84) group = 4;
        if (85 <= lightness && lightness <= 100) group = 5;
        break;
      case 3:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 68) group = 2;
        if (69 <= lightness && lightness <= 79) group = 3;
        if (80 <= lightness && lightness <= 84) group = 4;
        if (85 <= lightness && lightness <= 100) group = 5;
        break;
      case 4:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 68) group = 2;
        if (69 <= lightness && lightness <= 80) group = 3;
        if (81 <= lightness && lightness <= 84) group = 4;
        if (85 <= lightness && lightness <= 100) group = 5;
        break;
      case 5:
        if (0 <= lightness && lightness <= 18) group = 1;
        if (19 <= lightness && lightness <= 68) group = 2;
        if (69 <= lightness && lightness <= 80) group = 3;
        if (81 <= lightness && lightness <= 84) group = 4;
        if (85 <= lightness && lightness <= 100) group = 5;
        break;
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        if (0 <= lightness && lightness <= 18) group = 1;
        if (19 <= lightness && lightness <= 69) group = 2;
        if (70 <= lightness && lightness <= 80) group = 3;
        if (81 <= lightness && lightness <= 83) group = 4;
        if (84 <= lightness && lightness <= 100) group = 5;
        break;
      default:
        break;
    }
    let groupId = "";
    switch (group) {
      case 1:
        groupId = STONE_COLOR_COLLECTION_IDS.BLACK_ALMOST_BLACK;
        break;
      case 2:
        groupId = STONE_COLOR_COLLECTION_IDS.DARK_GREY;
        break;
      case 3:
        groupId = STONE_COLOR_COLLECTION_IDS.MID_GREY;
        break;
      case 4:
        groupId = STONE_COLOR_COLLECTION_IDS.LIGHT_GREY;
        break;
      case 5:
        groupId = STONE_COLOR_COLLECTION_IDS.WHITE_OFFWHITE;
        break;

      default:
        break;
    }
    const found = STONE_COLOR_COLLECTIONS.find((item) => item.id === groupId);
    if (found) return [found];
  }
  return [];
};
export const recommendWood = (
  _saturation: number,
  lightness: number,
  hue: number,
  isMain?: boolean
) => {
  let collections = [];
  if (isMain) {
    const lightToDarkCollection = WOOD_COLOR_COLLECTIONS.find(
      (item) =>
        lightness >= item.lightness.from && lightness <= item.lightness.to
    );
    if (lightToDarkCollection) {
      collections.push(lightToDarkCollection);
    }
  }
  const colorCollection = WOOD_COLOR_COLLECTIONS.find(
    (item) => hue >= item.hue.from && hue <= item.hue.to
  );
  if (colorCollection) {
    collections.push(colorCollection);
  }
  return collections;
};
