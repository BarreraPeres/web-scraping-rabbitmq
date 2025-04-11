import AccountModule from "./module/Account.mjs";
import RabbitProducerModule from "./module/Rabbit-Producer.mjs";
import UserModule from "./module/User.mjs";


class Core {
    constructor() {
        this.user = new UserModule(this);
        this.account = new AccountModule(this)
        this.rabbitProducer = new RabbitProducerModule(this)
    }
}

export default Core;