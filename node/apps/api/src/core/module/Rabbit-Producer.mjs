import amqp from 'amqplib';
import BaseModule from './BaseModule.mjs';

class RabbitProducerModule extends BaseModule {
    constructor() {
        super();
        this.connection = null;
        this.channel = null;
    }
    async connect(queue) {
        return new Promise(async (resolve, reject) => {
            try {

                this.connection = await amqp.connect('amqp://localhost');
                this.channel = await this.connection.createChannel();
                await this.channel.assertQueue(queue);

                console.log(`🚀 Server and Producer is running ${queue}`);
                resolve()
            } catch (error) {
                console.error(`Erro ao conectar ao RabbitMQ: ${queue}`, error);
                reject(error)
            }
        })
    }

    async sender(queue, msg) {
        if (!this.channel) {
            console.error("Channel not initialized")
        }
        try {
            this.channel.sendToQueue(
                queue,
                Buffer.from(msg)
            );

            console.log(`✅ msg sending to ${queue} - ${msg}`);
        } catch (error) {
            console.error(`Error to sending to queue ${queue} - ${msg}`, error);
        }
    }


}

export default RabbitProducerModule;
