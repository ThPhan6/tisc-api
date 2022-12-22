import {databaseConsole} from '../database.command';
const args = process.argv.slice(2);
const [first, last] = args;
///

const commandInfo = (type: 'seed' | 'migration') => {
  console.log(
    '\x1b[35m',
    `\nUsage: yarn make:${type} <filename> --collection=<collection>\n`,
    '\x1b[0m'
  )
}
export const makeTemplate = (type: 'seed' | 'migration') => {
  ////
  if (first === undefined || last === undefined) {
    commandInfo(type);
    process.exit();
  }
  ///
  const firstIndex = first.indexOf('--collection=');
  const lastIndex = last.indexOf('--collection=');
  if (firstIndex === -1 && lastIndex === -1 ) {
    commandInfo(type);
    process.exit();
  }
  /// parse and create seed
  let collection = '';
  let filename = '';
  if (firstIndex > -1) {
    collection = first.substring(firstIndex + 13);
    filename = last.replace(/ /g, "_");
  } else {
    collection = last.substring(lastIndex + 13);
    filename = first.replace(/ /g, "_");
  }

  if (type === 'seed') {
    databaseConsole.createSeed(filename, collection);
    process.exit();
  }
  databaseConsole.createMigration(filename, collection);
}
