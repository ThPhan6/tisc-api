import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import {RoleNames} from '@/constants';
import moment from 'moment';
import {map} from 'lodash';

export const up = (connection: ConnectionInterface) => {
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  const roleData = map(RoleNames, (name, roleId) => {
    return {
      id: roleId,
      name: name,
      created_at: currentTime,
      updated_at: currentTime,
      deleted_at: null,
    }
  });
  return connection.insert(
    'roles', roleData
  );
}
