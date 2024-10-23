import { ENVIRONMENT } from "@/config";
import { connection } from "@/Database/Connections/ArangoConnection";
import { getTimestamps } from "@/Database/Utils/Time";
import { freeCurrencyService } from "@/services/free_currency.service";
import Bull from "bull";
import { randomUUID } from "crypto";
import { BaseQueue } from "./base.queue";

class ExchangeCurrencyQueue extends BaseQueue {
  constructor() {
    super(
      new Bull(
        "Currency_queue",
        `redis://${ENVIRONMENT.REDIS_HOST}:${ENVIRONMENT.REDIS_PORT}`,
        {}
      )
    );
  }

  public process = () => {
    this.queue.process(async (job, done) => {
      try {
        const currencyData = await freeCurrencyService.exchangeCurrencies();

        if (!currencyData) {
          throw Error("No data returned from exchange service");
        }

        // Ensure db exists
        const dbExists = await connection.exists();
        if (!dbExists) {
          throw Error("Database does not exist");
        }

        const collection = await connection.collection("exchange_currencies");

        // Check if collection needs to be created
        if (!(await collection.exists())) {
          await collection.create({ waitForSync: true });
        }

        // Save exchange data to collection 'exchange_currencies'
        await collection.save({
          id: randomUUID(),
          data: currencyData,
          created_at: getTimestamps(),
          deleted_at: null,
        });

        done();
      } catch (error: any) {
        this.log(error, "slack");
        this.log(
          {
            subject: job.data.subject,
            to: job.data.to,
            from: job.data.from,
            message: error.stack || "",
          },
          "log_collections"
        );
      }
    });
  };
  public add = () => {
    this.queue.add(
      {},
      { repeat: { cron: ENVIRONMENT.CURRENCY_CRON_EXPRESSION } }
    );
  };
}

export const exchangeCurrencyQueue = new ExchangeCurrencyQueue();
