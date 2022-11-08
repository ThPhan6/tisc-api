import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import {BASIS_TYPES} from '@/constants';
import moment from 'moment';

export const up = (connection: ConnectionInterface) => {
  const now = moment();
  const dimensionAndWeightData = {
    id: "e661a64f-887e-42ae-b56c-0390e133a635",
    type: BASIS_TYPES.CONVERSION,
    name: "Dimension & Weight",
    subs: [
      {
        id: "04a9316c-b769-448c-9805-187d3ce7dc51",
        name_1: "Millimeter",
        name_2: "Inch",
        formula_1: "1",
        formula_2: "0.0393701",
        unit_1: "mm",
        unit_2: "in"
      },
      {
        id: "c8596cb8-7f72-4c00-a3a4-eb18b8e98c82",
        name_1: "Kilogram",
        name_2: "Pound",
        formula_1: "1",
        formula_2: "2.20462",
        unit_1: "kg",
        unit_2: "lb"
      },
    ],
    master: true,
    created_at: now,
    updated_at: now,
    deleted_at: null
  }
  return connection.insert(
    'bases', dimensionAndWeightData
  );
}
