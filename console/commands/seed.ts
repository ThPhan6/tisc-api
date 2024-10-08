import { databaseConsole } from "./database.command";

const args = process.argv;
const fileArgIndex = args.indexOf("--file");
const specificFile = fileArgIndex !== -1 ? args[fileArgIndex + 1] : null;

if (specificFile) {
  console.log(`Running specific seed file: ${specificFile}`);
  databaseConsole.runUp("seeds", specificFile);
} else {
  console.log("Running all pending seed files.");
  databaseConsole.runUp("seeds");
}
