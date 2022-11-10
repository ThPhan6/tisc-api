import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import {DimensionAndWeightAttribute} from '@/constants';
import moment from 'moment';

export const up = (connection: ConnectionInterface) => {
  const now = moment();
  return connection.insert(
    'attributes', {
      ...DimensionAndWeightAttribute,
      master: true,
      selectable: false,
      created_at: now,
      updated_at: now,
      deleted_at: null
    }
  );
}
