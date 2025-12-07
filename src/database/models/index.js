import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import configFile from "../config/config.js";
import url from "url";

const env = process.env.NODE_ENV || "development";
const config = configFile[env];

// Fix dirname untuk ESM + Windows
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Normalisasi path supaya tidak double-drive
const modelsDir = path.normalize(__dirname);

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {};

const modelFiles = fs
  .readdirSync(modelsDir)
  .filter((file) => file !== "index.js" && file.endsWith(".js"));

for (const file of modelFiles) {
  const modelPath = path.join(modelsDir, file);
  const modelModule = await import(url.pathToFileURL(modelPath).href);

  const model = modelModule.default(sequelize, Sequelize.DataTypes);

  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  const mdl = db[modelName];
  if (mdl.associate) mdl.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
