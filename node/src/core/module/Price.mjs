import Core from "../core.mjs";
import BaseModule from "./BaseModule.mjs";

class PriceModule extends BaseModule {
    async create({ product_id, price }) {
        this.validate({
            product_id: "string",
            price: "number",
        }, { product_id, price });
        const core = new Core()
        const product = await core.product.findById(product_id)

        price = await this.knex('prices')
            .insert({
                product_id: product.id,
                price
            })
            .returning('*');


        return price[0]
    }

    async findLast({ productId }) {
        this.validate({
            productId: "string"
        }, { productId })

        const prices = await this.knex("prices")
            .where({
                product_id: productId,
            })
            .orderBy(
                "utc_created_on", "desc"
            )
            .first()

        const lastPrice = prices.price || 0

        return lastPrice

    }

    async del(priceId) {
        await this.knex("prices").where({ id: priceId }).del();
    }
}

export default PriceModule;