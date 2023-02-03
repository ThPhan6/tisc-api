import { ENVIRONMENT } from "@/config";
import Bull from "bull";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import moment from "moment";
import JSZip from "jszip";
import { deleteFile, listFilePrefix, upload } from "@/service/aws.service";
import { CollectionsToBackup } from "@/constants";
import { BaseQueue } from "./base.queue";
class DatabaseQueue extends BaseQueue {
  constructor() {
    super(
      new Bull(
        "Database_backup_queue",
        `redis://${ENVIRONMENT.REDIS_HOST}:${ENVIRONMENT.REDIS_PORT}`
      )
    );
  }
  private backup = (exeStr: string) => {
    return new Promise((resolve) => {
      exec(exeStr, (error, stdout) => {
        if (error) {
          this.log(error);
          return;
        }
        resolve(stdout);
      });
    });
  };
  private removeOldFiles =async () => {
    const backupFiles = await listFilePrefix("dump/");
        const keysToDelete = backupFiles?.Contents?.map((item) => item.Key)
          .filter((item: any) => item.search(ENVIRONMENT.DATABASE_NAME) !== -1)
          .slice(0, 1 - parseInt(ENVIRONMENT.MAXIMUM_BACKUP_FILE));
        keysToDelete?.map(item => {
          if(item) deleteFile(item)
        })
  }
  public process = () => {
    this.queue.process(async (_job, done) => {
      try {
        const zip = new JSZip();
        const generalDir = `dump/${moment().format("YYYYMMDD_hhmmss")}_${
          ENVIRONMENT.DATABASE_NAME
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
          ENVIRONMENT.DATABASE_ENDPOINT
        } --server.database ${ENVIRONMENT.DATABASE_NAME} --server.username ${
          ENVIRONMENT.DATABASE_USERNAME
        } --server.password ${ENVIRONMENT.DATABASE_PASSWORD} ${
          ENVIRONMENT.BACKUP_ALL === "false" ? collectionOptionStr : ""
        } --output-directory ${tempDir} --overwrite true`;
        //back up all collection or specified collections
        await this.backup(exeStr);
        const files = await fs.readdirSync(tempDir);
        //add all backup file into zip file
        await Promise.all(
          files.map(async (file) => {
            const fileData = await fs.readFileSync(`${tempDir}/${file}`);
            zip.file(file, fileData, { binary: true });
          })
        );
        //keep the maximum backup file
        await this.removeOldFiles()
        //create zip file and upload to storage
        zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
          upload(content, generalDir + ".zip", "application/zip");
        });
        if (fs.existsSync(tempDir)) {
          fs.rmdirSync(tempDir, { recursive: true });
        }
        done();
      } catch (error: any) {
        this.log(error);
      }
    });
  };
  public add = () => {
    this.queue.add(
      {},
      { repeat: { cron: ENVIRONMENT.BACKUP_CRON_EXPRESSION } }
    );
  };
}

export const databaseBackupQueue = new DatabaseQueue();
