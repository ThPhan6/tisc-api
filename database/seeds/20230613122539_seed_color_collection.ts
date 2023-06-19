import { COLOR_COLLECTIONS } from "@/constants/collection.constant";
import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";
import moment from "moment";
import {CollectionRelationType} from '@/types';

export const up = (connection: ConnectionInterface) => {
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
  return connection.insert(
    "collections",
    COLOR_COLLECTIONS.map((item) => {
      return {
        id: item.id,
        name: item.name,
        relation_type: CollectionRelationType.Color,
        relation_id: '',
        created_at: currentTime,
        updated_at: currentTime,
      };
    })
  );
};
