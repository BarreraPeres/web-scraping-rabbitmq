import { z } from "zod";
import express from "express"
import handler from "../handler.mjs";

const router = express.Router()

async function handleSenderToQueue(req, res) {
    const schemaParams = z.object({
        url: z.string(),
        email: z.string(),
    })
    const { url, email } = schemaParams.parse(req.query)
    try {

        const data = {
            url,
            email
        }
        const correlationId = crypto.randomUUID()

        await req.core.rabbitProducer.connect("web_scraping")
        await req.core.rabbitProducer.channel.assertQueue("web_scraping")

        await req.core.rabbitProducer.sender("web_scraping", JSON.stringify(data), correlationId)

        await req.core.rabbitProducer.channel.consume("rpc", (msg) => {

            if (msg && correlationId === msg.properties.correlationId) {

                const data = JSON.parse(msg.content.toString())

                res.status(200).json({ data })

                req.core.rabbitProducer.channel.cancel(msg.fields.consumerTag)
            }
        })
    } catch (e) {
        throw e
    }
}

router.get("/prices", handler(handleSenderToQueue))

export default function makeEndpoint(app) {
    app.use("/v1", router)
};