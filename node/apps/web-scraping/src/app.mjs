import express from 'express'
import cookieParser from 'cookie-parser'

import { env } from './env/env.mjs'
import Core from "./core/core.mjs"
import RabbitConsumer from "./core/module/Rabbit-Consumer.mjs"

const app = express()
const core = new Core()
const rabbitConsumer = new RabbitConsumer(core)
const PORT = 5002

app.use(cookieParser(env.JWT_SECRET))
app.use(express.json())

app.use((req, _, next) => {
    const core = new Core()
    req.core = core;

    next()
})

try {

    setTimeout(async () => {
        await rabbitConsumer.connect("web_scraping")
        await rabbitConsumer.consumeQueue()

        app.listen(env.PORT || PORT)
    }, 1000)
    console.log(`🟢 RabbitMq working on ${PORT}`);
} catch (err) {
    console.error(err)
}


