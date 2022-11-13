import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import moment from 'moment';
import {TiscRoles} from '@/constants';
import {UserType, UserStatus} from '@/types';

export const up = (connection: ConnectionInterface) => {
  const now = moment().format('YYYY-MM-DD HH:mm:ss');
  return connection.insert('users', {
    id: "1110813b-8422-4e94-8d2a-8fdef644480e",
    role_id: TiscRoles.Admin,
    firstname: "Liming",
    lastname: "Rao",
    gender: true,
    location_id: null,
    department: null,
    position: "CEO",
    email: "liming@tisc.global",
    phone: "",
    mobile: "",
    password: "$2a$09$Uk42d5scAMr8MkxbzTTsceXpsouiX4aKFXL4NHQ6b.HHBI23rpIgS",
    avatar: null,
    backup_email: null,
    personal_mobile: null,
    linkedin: null,
    is_verified: true,
    verification_token: null,
    reset_password_token: null,
    status: UserStatus.Active,
    type: UserType.TISC,
    relation_id: "TISC",
    work_location: "",
    created_at: now,
    updated_at: now,
    deleted_at: null,
    phone_code: "65",
    department_id: null
  });
}
