import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import {DimensionAndWeightConversion} from '@/constants';
import moment from 'moment';

export const up = (connection: ConnectionInterface) => {
  const now = moment();
  return connection.insert(
    'bases', {
      ...DimensionAndWeightConversion,
      master: true,
      created_at: now,
      updated_at: now,
      deleted_at: null
    }
  );
}
