import BaseModule from "./BaseModule.mjs";

import axios from "axios";
import jsdom from "jsdom"
import Core from "../core.mjs";
const { JSDOM } = jsdom;

class ProductModule extends BaseModule {
    async findTitleAndPriceByUrl(url) {
        console.log(`📥 Processando URL: ${url}`);

        const { data } = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        const dom = new JSDOM(data);
        const document = dom.window.document;

        let price;
        let title;
        if (url.includes("amazon")) {
            const element = document.querySelector(".a-container .celwidget .a-price-whole");
            price = element ? element.textContent.trim() : null;
            if (price && price.includes(",")) {
                price = price.replaceAll(",", "");
            }
            const titleElement = document.getElementById("productTitle");
            title = titleElement ? titleElement.textContent.trim() : null;
        }

        if (!price) {
            throw new Error(`price not found by ${url}`)
        }
        price = parseFloat(price);

        console.log(`📈 Price of ${title} UP R$${price}`);

        return { title, price }

    }
    async findByProductByUrl(url) {
        this.validate({
            url: "string"
        }, { url })
        const product = await this.knex("products")
            .where({
                url
            })
            .first()
        console.log("findbyProduct", product)
        return product
    }

    async save({ url, name, price }) {
        this.validate({
            url: "string",
            name: "string",
            price: "number"
        }, { url, name, price });

        const ctx = new Core()
        let product;
        const UrlAlreadyCreated = await this.findByProductByUrl(url)

        if (UrlAlreadyCreated) {
            console.log("UrlAlreadyCreated", UrlAlreadyCreated)
            product = UrlAlreadyCreated
        } else {
            product = await this.knex('products')
                .insert({
                    url,
                    name
                })
                .returning('*');
        }

        await ctx.price.create({
            product_id: product.id,
            price
        })

        if (!product) {
            throw new Error("Unknow error while insert prodcut!");
        }

        return product
    }

    async del(productId) {
        await this.knex("products").where({ id: productId }).del();
    }
}

export default ProductModule;