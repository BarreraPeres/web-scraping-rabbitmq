import { z } from "zod";


function Routes(app) {
    app.get('/monitor', async (req, res) => {
        const schemaParams = z.object({
            url: z.string()
        })
        const { url } = schemaParams.parse(req.query)

        await req.core.rabbit.connect()
        await req.core.rabbit.sendToQueue(url);

        res.status(200).json({ ok: true });
    });

    app.get("/", (_, res) => {
        res.status(200).json({ ok: true })
    })
}

export default Routes;