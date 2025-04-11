import dotenv from "dotenv"
import path from "node:path"
import dirname from "../../dirname.mjs"
import { z } from "zod"

dotenv.config({
    path: path.resolve(dirname, ".env")
})

const envSchema = z.object({
    API_PORT: z.coerce.number().default(5002),
    NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
    PSQL_HOST: z.string(),
    PSQL_PORT: z.string(),
    PSQL_USERNAME: z.string(),
    PSQL_PASSWORD: z.string(),
    PSQL_DATABASE: z.string()
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.error("❌ Error in environment variables:", _env.error.format())
    throw new Error("❌ Error in environment variables ")
}


export const env = _env.data
