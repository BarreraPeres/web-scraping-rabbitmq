import { z } from "zod";
import express from "express"
import handler from "../handler.mjs";

const router = express.Router()

async function handleSenderToQueue(req, res) {
    const schemaParams = z.object({
        url: z.string()
    })
    const { url } = schemaParams.parse(req.query)

    await req.core.rabbitProducer.connect("web_scraping")
    await req.core.rabbitProducer.channel.assertQueue("web_scraping")
    await req.core.rabbitProducer.sender("web_scraping", url)

    res.status(200).json({ message: "Your product to be observed" })
}

router.get("/prices", handler(handleSenderToQueue))

export default function makeEndpoint(app) {
    app.use("/v1", router)
};