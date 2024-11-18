import fs from "fs/promises";

const databasePath = new URL("./db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  findById(table, id) {
    const data = this.#database[table] ?? [];
    return data.findIndex((row) => row.id === id);
  }

  getTaskById(table, id) {
    const rowIndex = this.findById(table, id);
    if (rowIndex > -1) {
      return this.#database[table][rowIndex];
    }
    return null;
  }

  select(search, table) {
    let data = this.#database[table] ?? [];
    const { title, description } = search;
    data = data.filter((row) => {
      const titleMatch = title ? row.title.toLowerCase().includes(title) : true;
      const descriptionMatch = description
        ? row.description.toLowerCase().includes(description)
        : true;
      return titleMatch && descriptionMatch;
    });

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();
    return data;
  }

  update(table, id, data) {
    const rowIndex = this.findById(table, id);
    if (rowIndex > -1) {
      this.#database[table][rowIndex] = {
        ...this.#database[table][rowIndex],
        ...data,
      };
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.findById(table, id);
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
