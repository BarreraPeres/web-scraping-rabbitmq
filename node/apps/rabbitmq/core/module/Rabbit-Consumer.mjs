import amqp from 'amqplib';
import BaseModule from './BaseModule.mjs';
import fetchApi from '../../src/fetch-api.mjs';

export class RabbitConsumer extends BaseModule {
    constructor() {
        super();
        this.queueName = 'monitor_prices';
        this.connection = null;
        this.channel = null;
    }
    async connect() {
        try {

            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();

            console.log(`🚀 conected to RabbitMQ! ${this.queueName}`);
        } catch (error) {
            console.error(`Error: ${this.queueName}`, error);
        }
    }
    async consumeQueue() {
        try {
            await this.channel?.assertQueue(this.queueName)
            console.log(`Consumer ... ${this.queueName}`);
            this.channel.consume(this.queueName, async (msg) => {
                if (!msg) return;

                const url = msg.content.toString();
                console.log(`📬 URL recebida: ${url}`);

                const res = await fetchApi(
                    "/monitor",
                    "POST",
                    { url }
                )
                console.log(res)

                this.channel?.ack(msg)
            });
        } catch (error) {
            console.log(error)
        }
    }


    async close() {
        try {
            await this.channel.close();
            await this.connection.close();
            console.log('🚪 RabbitMQ closed!');
        } catch (error) {
            console.error('Error closing RabbitMQ', error);
        }
    }
}

