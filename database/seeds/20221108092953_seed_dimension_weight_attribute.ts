import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import {AttributeType} from '@/types';
import moment from 'moment';

export const up = (connection: ConnectionInterface) => {
  const now = moment();
  const dimensionAndWeightAttribute = {
    id: "8d716a82-5514-4bdb-987e-9e3b5807d995",
    type: AttributeType.Specification,
    name: "Dimension & Weight",
    subs: [
      {
        id: "e14cfe5b-eeab-4826-b165-91c0c8f1341c",
        name: "Overall Length",
        basis_id: "04a9316c-b769-448c-9805-187d3ce7dc51"
      },
      {
        id: "91a1546d-d4f8-4456-bcab-b930cccdb250",
        name: "Overall Width",
        basis_id: "04a9316c-b769-448c-9805-187d3ce7dc51"
      },
      {
        id: "62f50511-474b-4b0b-9718-13c00d25234a",
        name: "Overall Height",
        basis_id: "04a9316c-b769-448c-9805-187d3ce7dc51"
      },
      {
        id: "ca9279f9-cfe8-42d5-9ca9-2cf4f6a4992c",
        name: "Overall Diameter",
        basis_id: "04a9316c-b769-448c-9805-187d3ce7dc51"
      },
      {
        id: "c422b8c0-9e33-4437-869c-17a1122df2da",
        name: "Total Weight",
        basis_id: "c8596cb8-7f72-4c00-a3a4-eb18b8e98c82"
      },
    ],
    master: true,
    selectable: false,
    created_at: now,
    updated_at: now,
    deleted_at: null
  }
  return connection.insert(
    'attributes', dimensionAndWeightAttribute
  );
}
