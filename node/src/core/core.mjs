import PriceModule from "./module/Price.mjs";
import ProductModule from "./module/Product.mjs";
import RabbitModule from "./module/Rabbit.mjs";
import UserModule from "./module/User.mjs";


class Core {
    constructor() {
        this.user = new UserModule(this);
        this.product = new ProductModule(this);
        this.price = new PriceModule(this)
        this.rabbit = new RabbitModule(this)
    }
}

export default Core;