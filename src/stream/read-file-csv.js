import fs from "node:fs";
import { parse } from "csv-parse";

const csvFilePath = new URL("../../tasks.csv", import.meta.url);

export async function saveCsvFileToDatabase(database) {
  console.log(csvFilePath);
}
