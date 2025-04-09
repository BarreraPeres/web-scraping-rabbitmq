import { RabbitConsumer } from "./module/Rabbit-Consumer.mjs";

class Core {
    constructor() {
        this.rabbitConsumer = new RabbitConsumer(this)
    }
}

export default Core;