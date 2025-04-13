import dotenv from "dotenv"
import path from "node:path"
import dirname from "../../dirname.mjs";
import { env } from "../env/env.mjs";

dotenv.config({
    path: path.resolve(dirname, ".env")
})

const config = {
    client: "pg",
    connection: {
        host: env.PSQL_HOST,
        port: env.PSQL_PORT,
        user: env.PSQL_USERNAME,
        password: env.PSQL_PASSWORD,
        database: env.PSQL_DATABASE,
    },
    migrations: {
        directory: "../../../db/migrations",
        loadExtensions: ['.mjs'],
    }
};

export default config;