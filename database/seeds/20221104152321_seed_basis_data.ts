import {ConnectionInterface} from '@/Database/Connections/ArangoConnection';
import {v4 as uuid} from 'uuid';
import moment from 'moment';
import {BASIS_TYPES} from '@/constants';

export const up = (connection: ConnectionInterface) => {
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  const data = [
    {
      id: uuid(),
      type: BASIS_TYPES.CONVERSION,
      name: "Length",
      subs: [
        {
          id: uuid(),
          name_1: "Milimeter",
          name_2: "Inch",
          formula_1: "25.4",
          formula_2: "0.0393701",
          unit_1: "mm",
          unit_2: "in",
        },
        {
          id: uuid(),
          name_1: "Centimeter",
          name_2: "Inch",
          formula_1: "2.54",
          formula_2: "0.393701",
          unit_1: "cm",
          unit_2: "in",
        },
      ],
      created_at: currentTime, updated_at: currentTime, deleted_at: null,
    },
    {
      id: uuid(),
      type: BASIS_TYPES.CONVERSION,
      name: "Weight",
      subs: [
        {
          id: uuid(),
          name_1: "Kilogram",
          name_2: "Gram",
          formula_1: "1000",
          formula_2: "0.001",
          unit_1: "kg",
          unit_2: "g",
        },
        {
          id: uuid(),
          name_1: "Gram",
          name_2: "Kilogram",
          formula_1: "0.001",
          formula_2: "1000",
          unit_1: "g",
          unit_2: "kg",
        },
      ],
      created_at: currentTime, updated_at: currentTime, deleted_at: null,
    },
    {
      id: uuid(),
      type: BASIS_TYPES.CONVERSION,
      name: "Temperature",
      subs: [
        {
          id: uuid(),
          name_1: "Celsius",
          name_2: "Fahrenheit",
          formula_1: "33.8",
          formula_2: "-17.2",
          unit_1: "C",
          unit_2: "F",
        },
        {
          id: uuid(),
          name_1: "Fahrenheit",
          name_2: "Celsius",
          formula_1: "-17.2",
          formula_2: "33.8",
          unit_1: "F",
          unit_2: "C",
        },
      ],
      created_at: currentTime, updated_at: currentTime, deleted_at: null,
    },
    {
      id: uuid(),
      type: BASIS_TYPES.PRESET,
      name: "Material classification",
      subs: [
        {
          id: uuid(),
          name: "Natural stone",
          subs: [
            {
              id: uuid(),
              value_1: "Basalt",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
            {
              id: uuid(),
              value_1: "Granite",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
            {
              id: uuid(),
              value_1: "Limestone",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
            {
              id: uuid(),
              value_1: "Marble",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
          ],
        },
        {
          id: uuid(),
          name: "Metal alloy",
          subs: [
            {
              id: uuid(),
              value_1: "Onyx",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
            {
              id: uuid(),
              value_1: "Porphyry",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
            {
              id: uuid(),
              value_1: "Quartzite",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
            {
              id: uuid(),
              value_1: "Sandstone",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
            {
              id: uuid(),
              value_1: "Slate",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
          ],
        },
      ],
      created_at: currentTime, updated_at: currentTime, deleted_at: null,
    },
    {
      id: uuid(),
      type: BASIS_TYPES.PRESET,
      name: "Standard ratings",
      subs: [
        {
          id: uuid(),
          name: "Natural stone",
          subs: [
            {
              id: uuid(),
              value_1: "Basalt",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
            {
              id: uuid(),
              value_1: "Granite",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
          ],
        },
        {
          id: uuid(),
          name: "Metal alloy",
          subs: [
            {
              id: uuid(),
              value_1: "Onyx",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
            {
              id: uuid(),
              value_1: "Porphyry",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
            {
              id: uuid(),
              value_1: "Quartzite",
              value_2: "",
              unit_1: "",
              unit_2: "",
            },
          ],
        },
      ],
      created_at: currentTime, updated_at: currentTime, deleted_at: null,
    },
    {
      id: uuid(),
      type: BASIS_TYPES.OPTION,
      name: "Stone standard thickness",
      subs: [
        {
          id: uuid(),
          name: "Title format",
          subs: [
            {
              id: uuid(),
              value_1: "6.4",
              value_2: "1/4",
              unit_1: "mm",
              unit_2: "inch",
            },
            {
              id: uuid(),
              value_1: "9.5",
              value_2: "3/8",
              unit_1: "mm",
              unit_2: "inch",
            },
            {
              id: uuid(),
              value_1: "12.7",
              value_2: "1/2",
              unit_1: "mm",
              unit_2: "inch",
            },
            {
              id: uuid(),
              value_1: "15.9",
              value_2: "5/8",
              unit_1: "mm",
              unit_2: "inch",
            },
          ],
        },
        {
          id: uuid(),
          name: "Slab format",
          subs: [
            {
              id: uuid(),
              value_1: "9.5",
              value_2: "3/8",
              unit_1: "mm",
              unit_2: "inch",
            },
            {
              id: uuid(),
              value_1: "12.7",
              value_2: "1/2",
              unit_1: "mm",
              unit_2: "inch",
            },
          ],
        },
      ],
      created_at: currentTime, updated_at: currentTime, deleted_at: null,
    },
    {
      id: uuid(),
      type: BASIS_TYPES.OPTION,
      name: "Stone edge profiles",
      subs: [
        {
          id: uuid(),
          name: "Title format",
          subs: [
            {
              id: uuid(),
              value_1: "6.4",
              value_2: "1/4",
              unit_1: "mm",
              unit_2: "inch",
            },
            {
              id: uuid(),
              value_1: "9.5",
              value_2: "3/8",
              unit_1: "mm",
              unit_2: "inch",
            },
          ],
        },
        {
          id: uuid(),
          name: "Slab format",
          subs: [
            {
              id: uuid(),
              value_1: "9.5",
              value_2: "3/8",
              unit_1: "mm",
              unit_2: "inch",
            },
          ],
        },
      ],
      created_at: currentTime, updated_at: currentTime, deleted_at: null,
    },
  ];
  return connection.insert( 'bases', data );
}
