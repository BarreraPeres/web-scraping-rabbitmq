import dotenv from "dotenv"
import path from "node:path"
import { z } from "zod"
import dirname from "../dirname.mjs"


dotenv.config({
    path: path.resolve(dirname, ".env")
})

const envSchema = z.object({
    API_PORT: z.coerce.number().default(3333),
    NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
    API_URL: z.string().default("http://localhost:3333"),
    JWT_SECRET: z.string().default("secret_key"),
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
