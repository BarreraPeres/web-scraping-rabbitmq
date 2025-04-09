// import { sendEmail } from "./email.js";
import express from "express"
import Core from "../core/core.mjs";
import { RabbitConsumer } from "../core/module/Rabbit-Consumer.mjs";

const core = new Core()
const rabbitConsumer = new RabbitConsumer(core)
const app = express()
const PORT = 8000


app.use((req, _, next) => {
    const core = new Core();
    req.core = core;

    next()
})

try {

    setTimeout(async () => {
        await rabbitConsumer.connect()
        rabbitConsumer.consumeQueue()
        app.listen(PORT)
    }, 8000)
    console.log(`🟢 RabbitMq working on ${PORT} - 👀:${core.rabbitConsumer.queueName}`);

} catch (error) {
    console.error('Erro ao configurar consumidor:', error);
}

