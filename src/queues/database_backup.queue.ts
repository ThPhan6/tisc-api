import { ENVIROMENT } from "@/config";
import Bull from "bull";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import moment from "moment";
import JSZip from "jszip";
import { upload } from "@/service/aws.service";
import { CollectionsToBackup } from "@/constants";
class DatabaseQueue {
  private queue: Bull.Queue<any>;
  constructor() {
    this.queue = new Bull(
      "Database backup queue",
      `redis://${ENVIROMENT.REDIS_HOST}:${ENVIROMENT.REDIS_PORT}`
    );
  }
  private backup = (exeStr: string) => {
    return new Promise((resolve) => {
      exec(exeStr, (error, stdout) => {
        if (error) {
          console.log(error);
          return;
        }
        resolve(stdout);
      });
    });
  };
  public process = () => {
    this.queue.process(async (_job, done) => {
      try {
        const zip = new JSZip();
        const generalDir = `dump/${moment().format("YYYYMMDD_hhmmss")}_${
          ENVIROMENT.DATABASE_NAME
        }`;
        var tempDir = path.resolve("") + `/${generalDir}`;

        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        const collectionOptionStr = CollectionsToBackup.reduce(
          (pre, cur) => pre + ` --collection ${cur} `,
          ""
        );
        const exeStr = `arangodump --server.endpoint ${
          ENVIROMENT.DATABASE_ENDPOINT
        } --server.database ${ENVIROMENT.DATABASE_NAME} --server.username ${
          ENVIROMENT.DATABASE_USERNAME
        } --server.password ${ENVIROMENT.DATABASE_PASSWORD} ${
          ENVIROMENT.BACKUP_ALL === "false" ? collectionOptionStr : ""
        } --output-directory ${tempDir} --overwrite true`;
        await this.backup(exeStr);
        const files = await fs.readdirSync(tempDir);
        await Promise.all(
          files.map(async (file) => {
            const fileData = await fs.readFileSync(`${tempDir}/${file}`);
            zip.file(file, fileData, { binary: true });
          })
        );
        zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
          upload(content, generalDir + ".zip", "application/zip");
        });
        if (fs.existsSync(tempDir)) {
          fs.rmdirSync(tempDir, { recursive: true });
        }
        done();
      } catch (error: any) {
        console.log(error);
      }
    });
  };
  public add = () => {
    this.queue.add({}, { repeat: { cron: ENVIROMENT.BACKUP_CRON_EXPRESSION } });
  };
}

export const databaseBackupQueue = new DatabaseQueue();
