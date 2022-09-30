import { IProjectAttributes } from "@/model/project.model";
import { IUpdateProjectZoneRequest } from "./project_zone.type";
import { v4 as uuidv4 } from "uuid";
import { IProjectZoneAttributes, SortOrder } from "@/types";
import { sortObjectArray } from "@/helper/common.helper";
import { MEASUREMENT_UNIT } from "@/constants";

export const mappingAddProjectZoneId = (payload: IUpdateProjectZoneRequest) => {
  return payload.areas.map((area) => {
    const rooms = area.rooms.map((room) => {
      return {
        id: uuidv4(),
        room_name: room.room_name,
        room_id: room.room_id,
        room_size: room.room_size,
        quantity: room.quantity,
        sub_total: room.quantity * room.room_size,
      };
    });
    return {
      id: uuidv4(),
      name: area.name,
      rooms,
    };
  });
};

export const mappingResponseUnitRoomSize = (
  project: IProjectAttributes,
  projectZone: IProjectZoneAttributes
) => {
  const roomSizeUnit =
    project.measurement_unit === MEASUREMENT_UNIT.IMPERIAL ? "sq.ft." : "sq.m.";

  return projectZone.areas.map((area) => {
    const rooms = area.rooms.map((room) => {
      return {
        ...room,
        room_size_unit: roomSizeUnit,
      };
    });
    return {
      ...area,
      rooms,
    };
  });
};

export const mappingResponseProjectZones = (
  roomSizeUnit: string,
  projectZones: IProjectZoneAttributes[],
  areaOrder: SortOrder,
  roomNameOrder: SortOrder,
  roomIdOrder: SortOrder
) => {
  let countArea = 0;
  let countRoom = 0;
  let totalArea = 0;

  const returnedProjectZones = projectZones.map((projectZone) => {
    const sortedAreas = sortObjectArray(projectZone.areas, "name", areaOrder);
    const returnedAreas = sortedAreas.map((area) => {
      countRoom += area.rooms.length;
      const rooms = area.rooms.map((room: any) => {
        totalArea += room.quantity * room.room_size;
        return {
          ...room,
          room_size_unit: roomSizeUnit,
        };
      });

      return {
        ...area,
        count: area.rooms.length,
        rooms: sortObjectArray(
          rooms,
          roomNameOrder ? "room_name" : roomIdOrder ? "room_id" : "",
          roomNameOrder ? roomNameOrder : roomIdOrder
        ),
      };
    });
    countArea += projectZone.areas.length;
    return {
      ...projectZone,
      count: projectZone.areas.length,
      areas: returnedAreas,
    };
  });

  return {
    data: returnedProjectZones,
    count_area: countArea,
    count_room: countRoom,
    total_area: totalArea,
  };
};

export const mappingProjectZoneAreas = (
  areas: IUpdateProjectZoneRequest["areas"]
) => {
  return areas.map((area) => {
    const rooms = area.rooms.map((room) => {
      if (!room.id) {
        return {
          ...room,
          sub_total: room.quantity * room.room_size,
          id: uuidv4(),
        };
      }
      if (room.id) {
        return {
          ...room,
          sub_total: room.quantity * room.room_size,
        };
      }
    });
    if (!area.id) {
      return {
        ...area,
        rooms,
        id: uuidv4(),
      };
    }
    if (area.id) {
      return {
        ...area,
        rooms,
      };
    }
  }) as IProjectZoneAttributes["areas"];
};
