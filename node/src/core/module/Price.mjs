import BaseModule from "./BaseModule.mjs";

class PriceModule extends BaseModule {

    async create({ product_id, price }) {
        this.validate({
            product_id: "string",
            price: "string",
        }, { product_id, price });

        const product = await this.core.product.findyById(product_id)

        price = await this.knex('prices')
            .insert({
                product_id: product.id,
                price
            })
            .returning('*');


        return price[0]
    }

    async findLast({ productId }) {
        console.log("oi", productId)
        this.validate({
            productId: "string"
        }, { productId })
        console.log("salve o baguio ta aqui no pricer")
        const price = await this.knex("prices")
            .where({
                product_id: productId,
                utc_created_on: -1
            })
            .first() || null

        console.log("price", price)

        // if (!price) {
        //     throw new Error(`price not found by ${productId}`)
        // }

        const message = !price ? true : false

        return { price, message }

    }

    async del(priceId) {
        await this.knex("prices").where({ id: priceId }).del();
    }
}

export default PriceModule;