import BaseModule from "./BaseModule.mjs";

import axios from "axios";
import jsdom from "jsdom"
const { JSDOM } = jsdom;

class ProductModule extends BaseModule {
    async findTitleAndPriceByUrl(url) {

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

        return product
    }
    async findById(id) {
        this.validate({
            id: "string"
        }, { id })
        const product = await this.knex("products")
            .where({
                id
            })
            .first()

        return product
    }

    async create({ url, name, price }) {
        this.validate({
            url: "string",
            name: "string",
            price: "number"
        }, { url, name, price });

        let product;
        const UrlAlreadyCreated = await this.findByProductByUrl(url)

        if (UrlAlreadyCreated) {
            product = UrlAlreadyCreated
        } else {
            const products = await this.knex('products')
                .insert({
                    url,
                    name
                })
                .returning('*');
            product = products[0]
        }

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