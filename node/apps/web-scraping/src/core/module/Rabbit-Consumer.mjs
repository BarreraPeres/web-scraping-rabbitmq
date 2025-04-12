import amqp from 'amqplib';
import BaseModule from './BaseModule.mjs';
import Core from '../core.mjs';

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

class RabbitConsumer extends BaseModule {
    constructor() {
        super();
        this.queueName = 'web_scraping';
        this.connection = null;
        this.channel = null;
    }
    async connect() {
        try {

            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.queueName)

            console.info(`🚀 Queue Running ${this.queueName}`);
        } catch (error) {
            console.error(`Error: ${this.queueName}`, error);
        }
    }
    async consumeQueue() {
        if (!this.channel) {
            console.error("Channel Not initialized")
        }
        try {
            console.info(`Consumer ... ${this.queueName}`);
            this.channel.consume(this.queueName, async (msg) => {
                if (!msg) return;
                const data = JSON.parse(msg.content.toString())
                const core = new Core()

                const { title, price } = await core.product.findTitleAndPriceByUrl(data.url);
                const product = await core.product.create({ url: data.url, name: title, price })

                let lastPrice = await core.price.findLast({ productId: product.id });

                const message = await writer(lastPrice, price)

                if (lastPrice === 0) {
                    const priceCreated = await core.price.create({
                        product_id: product.id,
                        price
                    })
                    lastPrice = priceCreated?.price
                }

                if (!lastPrice) {
                    return this.channel.cancel(msg.fields.consumerTag)
                }
                console.info(`${data.email} - ${message}`)

                this.channel?.ack(msg)
            });
        } catch (error) {
            console.error(error)
        }
    }


    async close() {
        try {
            await this.channel.close();
            await this.connection.close();
            console.info('🚪 RabbitMQ closed!');
        } catch (error) {
            console.error('Error closing RabbitMQ', error);
        }
    }
}

export default RabbitConsumer