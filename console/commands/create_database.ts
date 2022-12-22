import {databaseConsole} from './database.command';
import {head, isUndefined} from 'lodash';
const args = process.argv.slice(2);
const databaseName = head(args);
if (isUndefined(databaseName)) {
  console.log(
    '\x1b[35m',
    `\nUsage: npm run create:database <database_name>\n`,
    '\x1b[0m'
  )
  process.exit();
}
databaseConsole.createDatabase(databaseName);
