import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";
import moment from "moment";
import { v4 as uuid } from "uuid";

const records = [
  {
    data: {
      AUD: 1.5035002099,
      BGN: 1.8011702918,
      BRL: 5.7025510585,
      CAD: 1.383660156,
      CHF: 0.8657301484,
      CNY: 7.1171608162,
      CZK: 23.3591237842,
      DKK: 6.8953408183,
      EUR: 0.9246500938,
      GBP: 0.7704001016,
      HKD: 7.7724514764,
      HRK: 6.5218511075,
      HUF: 370.9904724692,
      IDR: 15473.800296792,
      ILS: 3.7844206408,
      INR: 84.0541806707,
      ISK: 137.7282487198,
      JPY: 150.6171116397,
      KRW: 1375.1562792954,
      MXN: 19.9601728825,
      MYR: 4.3046806545,
      NOK: 10.9479116444,
      NZD: 1.6602802258,
      PHP: 57.6085966229,
      PLN: 3.9927604266,
      RON: 4.5975109084,
      RUB: 96.5401271526,
      SEK: 10.5583915259,
      SGD: 1.3165301803,
      THB: 33.5095858731,
      TRY: 34.2543350599,
      USD: 1,
      ZAR: 17.6171431209,
    },
  },
];

export const up = (connection: ConnectionInterface) => {
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

  return connection.insert(
    "exchange_currencies",
    records.map((item) => ({
      id: uuid(),
      data: item.data,
      created_at: currentTime,
      deleted_at: null,
    })) /// can be [{}]
  );
};
