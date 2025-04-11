import PriceModule from "./module/Price.mjs";
import ProductModule from "./module/Product.mjs";
import RabbitConsumer from "./module/Rabbit-Consumer.mjs";

class Core {
    constructor() {
        this.rabbitConsumer = new RabbitConsumer(this)
        this.product = new ProductModule(this);
        this.price = new PriceModule(this)
    }
}

export default Core;