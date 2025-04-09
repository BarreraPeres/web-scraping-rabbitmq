import PriceModule from "./module/Price.mjs";
import ProductModule from "./module/Product.mjs";
import RabbitProducerModule from "./module/Rabbit-Producer.mjs";
import UserModule from "./module/User.mjs";


class Core {
    constructor() {
        this.user = new UserModule(this);
        this.product = new ProductModule(this);
        this.price = new PriceModule(this)
        this.rabbitProducer = new RabbitProducerModule(this)
    }
}

export default Core;