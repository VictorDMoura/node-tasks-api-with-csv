import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";
import { saveCsvFileToDatabase } from "./stream/read-file-csv.js";

const database = new Database();
const TABELE_DATABASE = "tasks";

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const query = req.query;

      const tasks = database.select(query, "tasks");
      return res.end(JSON.stringify(tasks));
    },
  },

  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: async (req, res) => {
      const { title, description } = req.body;
      if (!title && !description) {
        saveCsvFileToDatabase(database);
        return res
          .writeHead(201)
          .end(JSON.stringify({ message: "Adding json by a csv file" }));
      }

      if (!title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Title is required" }));
      }

      if (!description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Description is required" }));
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: new Date(),
        completed_at: null,
        updated_at: null,
      };

      database.insert(TABELE_DATABASE, task);

      res.writeHead(201).end();
    },
  },

  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Title is required" }));
      }

      if (!description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Description is required" }));
      }

      const index = database.findById(TABELE_DATABASE, id);
      if (index < 0) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Task not found" }));
      }

      const updated_at = new Date();

      if (!description) {
        database.update(TABELE_DATABASE, id, { title, updated_at });
        return res.writeHead(204).end();
      }

      if (!title) {
        database.update(TABELE_DATABASE, id, { description, updated_at });
        return res.writeHead(204).end();
      }

      database.update(TABELE_DATABASE, id, { title, description, updated_at });
      return res.writeHead(204).end();
    },
  },

  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: async (req, res) => {
      const { id } = req.params;
      const index = database.findById(TABELE_DATABASE, id);
      if (index < 0) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Task not found" }));
      }
      database.delete(TABELE_DATABASE, id);
      return res.writeHead(204).end();
    },
  },

  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: async (req, res) => {
      const { id } = req.params;
      const index = database.findById(TABELE_DATABASE, id);
      if (index < 0) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Task not found" }));
      }

      const task = database.getTaskById(TABELE_DATABASE, id);
      if (task.completed_at) {
        database.update(TABELE_DATABASE, id, { completed_at: null });
        return res.writeHead(204).end();
      }
      const completed_at = new Date();
      database.update(TABELE_DATABASE, id, { completed_at });
      return res.writeHead(204).end();
    },
  },
];
