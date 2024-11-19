import fs from "node:fs";
import { parse } from "csv-parse";
import { randomUUID } from "node:crypto";

const csvFilePath = new URL("../../tasks.csv", import.meta.url);
const TABELE_DATABASE = "tasks";
export async function saveCsvFileToDatabase(database) {
  fs.ReadStream(csvFilePath)
    .pipe(parse({ columns: true }))
    .on("data", async (row) => {
      await database.insert(TABELE_DATABASE, {
        id: randomUUID(),
        title: row.title,
        description: row.description,
        created_at: new Date(),
        completed_at: null,
        updated_at: null,
      });
    });
}
