import {
  STONE_COLOR_COLLECTIONS,
  STONE_COLOR_COLLECTION_IDS,
  WOOD_COLOR_COLLECTIONS,
  WOOD_COLOR_COLLECTION_IDS,
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
        if (0 <= lightness && lightness <= 17) group = 1;
        if (18 <= lightness && lightness <= 93) group = 2;
        if (94 <= lightness && lightness <= 100) group = 3;
        break;
      case 14:
        if (0 <= lightness && lightness <= 17) group = 1;
        if (18 <= lightness && lightness <= 92) group = 2;
        if (93 <= lightness && lightness <= 100) group = 3;
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
        if (0 <= lightness && lightness <= 12) group = 1;
        if (13 <= lightness && lightness <= 92) group = 2;
        if (93 <= lightness && lightness <= 100) group = 3;
        break;
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

    if (group === 2) {
      //step 3
      if (hue === 15) {
        if (lightness >= 10 && lightness <= 45)
          return [
            STONE_COLOR_COLLECTIONS.find(
              (item) => item.name === "8e8a4300-aae6-4810-82dc-2f00fa9f57c2"
            ),
          ];
        // Reddish collection
        else
          return [
            STONE_COLOR_COLLECTIONS.find(
              (item) => item.name === "af3f7bc1-9449-4b98-970f-1d932b8939ab"
            ),
          ]; // Vermilion collection
      }
      found = STONE_COLOR_COLLECTIONS.concat([
        {
          id: "8e8a4300-aae6-4810-82dc-2f00fa9f57c2",
          name: "Reddish Collection",
          temperature: "Mid Red & Warm Red",
          hue: {
            from: 356,
            to: 360,
          },
        },
      ]).find((item) => hue >= item.hue.from && hue <= item.hue.to);
    }
    if (found) return [found];
  } else if (saturation >= 0 && saturation <= 10) {
    //step 1
    //1: black, 2: dark grey, 3: medium grey, 4: light grey, 5: white/off-white
    let group = 1;
    switch (saturation) {
      case 0:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 64) group = 2;
        if (65 <= lightness && lightness <= 75) group = 3;
        if (76 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 1:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 69) group = 2;
        if (70 <= lightness && lightness <= 84) group = 3;
        if (85 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 2:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 68) group = 2;
        if (69 <= lightness && lightness <= 84) group = 3;
        if (85 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 3:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 69) group = 2;
        if (70 <= lightness && lightness <= 84) group = 3;
        if (85 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 4:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 68) group = 2;
        if (69 <= lightness && lightness <= 83) group = 3;
        if (84 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 5:
        if (0 <= lightness && lightness <= 18) group = 1;
        if (19 <= lightness && lightness <= 68) group = 2;
        if (69 <= lightness && lightness <= 84) group = 3;
        if (85 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 6:
        if (0 <= lightness && lightness <= 18) group = 1;
        if (19 <= lightness && lightness <= 69) group = 2;
        if (70 <= lightness && lightness <= 83) group = 3;
        if (84 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 7:
        if (0 <= lightness && lightness <= 18) group = 1;
        if (19 <= lightness && lightness <= 68) group = 2;
        if (69 <= lightness && lightness <= 84) group = 3;
        if (85 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 8:
      case 9:
        if (0 <= lightness && lightness <= 18) group = 1;
        if (19 <= lightness && lightness <= 67) group = 2;
        if (68 <= lightness && lightness <= 83) group = 3;
        if (84 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 10:
        if (0 <= lightness && lightness <= 18) group = 1;
        if (19 <= lightness && lightness <= 66) group = 2;
        if (67 <= lightness && lightness <= 83) group = 3;
        if (84 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
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
        if (0 <= lightness && lightness <= 17) group = 1;
        if (18 <= lightness && lightness <= 93) group = 2;
        if (94 <= lightness && lightness <= 100) group = 3;
        break;
      case 14:
        if (0 <= lightness && lightness <= 17) group = 1;
        if (18 <= lightness && lightness <= 92) group = 2;
        if (93 <= lightness && lightness <= 100) group = 3;
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
        if (0 <= lightness && lightness <= 12) group = 1;
        if (13 <= lightness && lightness <= 92) group = 2;
        if (93 <= lightness && lightness <= 100) group = 3;
        break;
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
    if (group === 1) {
      found = WOOD_COLOR_COLLECTIONS.find(
        (item) => item.id === WOOD_COLOR_COLLECTION_IDS.BLACK_ALMOST_BLACK
      );
    }

    if (group === 3) {
      found = WOOD_COLOR_COLLECTIONS.find(
        (item) => item.id === WOOD_COLOR_COLLECTION_IDS.WHITE_OFFWHITE
      );
    }
    if (found) return [found];
    if (group === 2) {
      //step 3 for wood hue collections
      found = WOOD_COLOR_COLLECTIONS.concat([
        {
          id: "78f86765-2e2a-4181-ac8f-ae882fb31d22",
          name: "Reddish Collection",
          temperature: "Warm Red",
          hue: {
            from: 356,
            to: 360,
          },
          lightness: {
            from: -1,
            to: -1,
          },
        },
      ]).filter((item) => {
        if (item.lightness.from !== -1 && item.lightness.to !== -1) {
          if (
            hue >= item.hue.from &&
            hue <= item.hue.to &&
            lightness >= item.lightness.from &&
            lightness <= item.lightness.to
          )
            return true;
          else return false;
        } else {
          if (hue >= item.hue.from && hue <= item.hue.to) return true;
          else return false;
        }
      });
      return found;
    }
  } else if (saturation >= 0 && saturation <= 10) {
    //step 1
    //1: black, 2: dark grey, 3: medium grey, 4: light grey, 5: white/off-white
    let group = 1;
    switch (saturation) {
      case 0:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 64) group = 2;
        if (65 <= lightness && lightness <= 75) group = 3;
        if (76 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 1:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 69) group = 2;
        if (70 <= lightness && lightness <= 84) group = 3;
        if (85 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 2:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 68) group = 2;
        if (69 <= lightness && lightness <= 84) group = 3;
        if (85 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 3:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 69) group = 2;
        if (70 <= lightness && lightness <= 84) group = 3;
        if (85 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 4:
        if (0 <= lightness && lightness <= 19) group = 1;
        if (20 <= lightness && lightness <= 68) group = 2;
        if (69 <= lightness && lightness <= 83) group = 3;
        if (84 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 5:
        if (0 <= lightness && lightness <= 18) group = 1;
        if (19 <= lightness && lightness <= 68) group = 2;
        if (69 <= lightness && lightness <= 84) group = 3;
        if (85 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 6:
        if (0 <= lightness && lightness <= 18) group = 1;
        if (19 <= lightness && lightness <= 69) group = 2;
        if (70 <= lightness && lightness <= 83) group = 3;
        if (84 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 7:
        if (0 <= lightness && lightness <= 18) group = 1;
        if (19 <= lightness && lightness <= 68) group = 2;
        if (69 <= lightness && lightness <= 84) group = 3;
        if (85 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 8:
      case 9:
        if (0 <= lightness && lightness <= 18) group = 1;
        if (19 <= lightness && lightness <= 67) group = 2;
        if (68 <= lightness && lightness <= 83) group = 3;
        if (84 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;
      case 10:
        if (0 <= lightness && lightness <= 18) group = 1;
        if (19 <= lightness && lightness <= 66) group = 2;
        if (67 <= lightness && lightness <= 83) group = 3;
        if (84 <= lightness && lightness <= 93) group = 4;
        if (94 <= lightness && lightness <= 100) group = 5;
        break;

      default:
        break;
    }
    let groupId = "";
    switch (group) {
      case 1:
        groupId = WOOD_COLOR_COLLECTION_IDS.BLACK_ALMOST_BLACK;
        break;
      case 2:
        groupId = WOOD_COLOR_COLLECTION_IDS.DARK_GREY;
        break;
      case 3:
        groupId = WOOD_COLOR_COLLECTION_IDS.MID_GREY;
        break;
      case 4:
        groupId = WOOD_COLOR_COLLECTION_IDS.LIGHT_GREY;
        break;
      case 5:
        groupId = WOOD_COLOR_COLLECTION_IDS.WHITE_OFFWHITE;
        break;

      default:
        break;
    }
    const found = WOOD_COLOR_COLLECTIONS.find((item) => item.id === groupId);
    if (found) return [found];
  }
  return [];
};
