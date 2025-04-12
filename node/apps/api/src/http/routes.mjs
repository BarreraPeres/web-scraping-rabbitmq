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
        console.log("url", url)
        const data = {
            url,
            email
        }
        await req.core.rabbitProducer.connect("web_scraping")
        await req.core.rabbitProducer.channel.assertQueue("web_scraping")
        await req.core.rabbitProducer.sender("web_scraping", JSON.stringify(data))

        res.status(200).json({ message: "Your product to be observed" })
    } catch (e) {
        throw e
    }
}

router.get("/prices", handler(handleSenderToQueue))

export default function makeEndpoint(app) {
    app.use("/v1", router)
};