import { z } from "zod";
import express from "express"
import handler from "../handler.mjs";
const router = express.Router();


async function HandlePostPrice(req, res) {
    // const schemaParams = z.object({
    //     url: z.string()
    // })
    // const { url } = schemaParams.parse(req.body)
    // try {

    //     await req.core.rabbitConsumer.connect("web_scraping")
    //     await req.core.rabbitConsumer.channel.assertQueue("web_scraping")

    //     return res.status(201).send({
    //         message: `Price Registered ${url}`
    //     })

    // } catch (ex) {
    //     throw ex
    // }

}


router.post("/prices", handler(HandlePostPrice))


export default function makeEndpoint(app) {
    app.use("/v2", router)
} 