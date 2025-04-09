import { z } from "zod";
import Core from "../core/core.mjs";

async function writer(lastPrice, price) {

    let message

    if (!lastPrice) {
        message = `O preço desse produto será observado, atual está ${price}`
    } else if (lastPrice > price) {
        message = `Preço aumentou de ${lastPrice} para R$${price}`
    } else if (lastPrice === price) {
        message = `O preço atual está ${price}`
    } else {
        message = `Preço ABAIXOu de ${lastPrice} para ${price} `
    }
    return message
    //     // sendEmail(
    //     //     user.email,
    //     //     "Atualização De hoje",
    //     //     "monitor_prices",
    //     //     {
    //     //         price,
    //     //         message,
    //     //         user,
    //     //         product,
    //     //         title
    //     //     }
    //     // )

}
function Routes(app) {
    app.post('/monitor', async (req, res) => {
        const schemaParams = z.object({
            url: z.string()
        })
        const { url } = schemaParams.parse(req.body)
        console.log("body", url)

        const { title, price } = await req.core.product.findTitleAndPriceByUrl(url);
        const product = await req.core.product.create({ url: url, name: title, price })

        let lastPrice = await req.core.price.findLast({ productId: product.id });
        if (!lastPrice) {
            lastPrice = await req.core.price.create({
                product_id: product.id,
                price
            })

        }
        const message = await writer(lastPrice, price)

        return res.status(200).json({ lastPrice, price, message });
    });

    app.get("/prices", async (req, res) => {
        const schemaParams = z.object({
            url: z.string()
        })
        const { url } = schemaParams.parse(req.query)
        console.log("body", url)

        await req.core.rabbitProducer.connect("monitor_prices")
        await req.core.rabbitProducer.channel.assertQueue("monitor_prices")
        await req.core.rabbitProducer.sender("monitor_prices", url)

        res.status(200).json({ message: "Your product to be observed" })
    })
}

export default Routes;