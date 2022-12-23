import Connection, {connection} from '@/Database/Connections/ArangoConnection';
import moment from 'moment';
import * as fs from 'fs';
import {template, difference, isFunction, reverse, isString} from 'lodash';
import {ENVIROMENT} from '@/config';

type MigrationSeedModel = 'seeds' | 'migrations';
interface MigrationSeedAttribute {
  file: string,
  batch: number,
  _key: string,
}

class DatabaseConsole {
  private databasePath = `${process.cwd()}/database`;
  private templatePath = `${process.cwd()}/console/templates`;

  private init = async (collection: MigrationSeedModel): Promise<boolean> => {
    try { await this.createDatabase() } catch (e: any) {
      // ArangoError: service unavailable due to startup or maintenance mode -> wait for service start
      if (isString(e.message) && e.message.indexOf('unavailable')) {
        return await this.init(collection);
      }
    }
    try { await connection.collection(collection).create() } catch {}
    return true;
  }

  private createTemplate = async (
    filename: string,
    collection = '',
    templateType: 'seed' | 'migration'
  ) => {
    let fileTemplate = fs.readFileSync(`${this.templatePath}/${templateType}.template.ts`).toString();
    const compiled = template(fileTemplate);
    fs.writeFileSync(
      `${this.databasePath}/${templateType}s/${moment().format('YYYYMMDDHHmmss')}_${filename}.ts`,
      compiled({collection})
    );
  }

  public createDatabase = async (name: string = ENVIROMENT.DATABASE_NAME) => {
    const newConnection = new Connection();
    newConnection.useDatabase('_system');
    await newConnection.createDatabase(name);
    console.log('\x1b[35m', `Created Database: ${name}`, '\x1b[0m');
  }

  public createSeed = async (filename: string, collection = '') => {
    return this.createTemplate(filename, collection, 'seed');
  }

  public createMigration = async (filename: string, collection = '') => {
    return this.createTemplate(filename, collection, 'migration');
  }

  private getMigrationSeedData = async (
    collection: MigrationSeedModel
  ): Promise<MigrationSeedAttribute[]> => {
    return await connection.collection(collection).all().then((cursor) => {
      return cursor.map(doc => {
        return {
          file: doc.file,
          batch: doc.batch,
          _key: doc._key
        }
      });
    });
  }

  public runUp = async (collection: MigrationSeedModel) => {
    await this.init(collection);
    //
    const filenames = fs.readdirSync(`${this.databasePath}/${collection}`);
    const data = await this.getMigrationSeedData(collection);
    /// get file unsued
    const executedFiles = data.map((item) => item.file);
    const unexecutedFiles = difference(filenames, executedFiles);

    /// run seed - migration
    await this.executeTemplate(unexecutedFiles, collection);

    /// update batch fileModule
    const latestBatch = this.getLatestBatch(data);
    connection.collection(collection).save(unexecutedFiles.map((unexecutedFile) => {
      return {
        file: unexecutedFile,
        batch: latestBatch + 1,
      }
    }));
  }

  public rollback = async () => {
    const data = reverse(await this.getMigrationSeedData('migrations'));
    /// update batch fileModule
    const latestBatch = this.getLatestBatch(data);
    /// get rollback files
    const rollbackFiles = data.filter((item) => item.batch === latestBatch);
    /// run seed - migration
    await this.executeTemplate(rollbackFiles.map((item) => item.file), 'migrations', 'down');
    /// get record _keys
    const keys = rollbackFiles.map((item) => item._key);
    connection.collection('migrations').removeByKeys(keys, {waitForSync: true});
  }

  public reset = async () => {
    const data = reverse(await this.getMigrationSeedData('migrations'));
    /// run seed - migration
    await this.executeTemplate(data.map((item) => item.file), 'migrations', 'down');
    /// get record _keys
    const keys = data.map((item) => item._key);
    connection.collection('migrations').removeByKeys(keys, {waitForSync: true});
  }


  private executeTemplate = async (
    unexecutedFiles: string[],
    collection: MigrationSeedModel,
    type: 'up' | 'down' = 'up'
  ) => {
    /// run seed - migration
    console.log('\x1b[35m');
    await Promise.all(unexecutedFiles.map(async (unexecutedFile) => {
      const fileModule = await import(`${this.databasePath}/${collection}/${unexecutedFile}`);
      if (isFunction(fileModule.up) && type === 'up') {
        try {await fileModule.up(connection)} catch {}
      }
      if (isFunction(fileModule.down) && type === 'down') {
        try {await fileModule.down(connection)} catch {}
      }
      console.log(`Done: ${unexecutedFile}`);
      return true;
    }));
    console.log('\x1b[0m');
  }

  private getLatestBatch = (data: MigrationSeedAttribute[]) => {
    return data.reduce((num, item) => {
      if (item.batch > num) {
        return item.batch;
      }
      return num;
    }, 0);
  }

}

export const databaseConsole = new DatabaseConsole();
