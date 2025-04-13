import amqp from 'amqplib';
import BaseModule from './BaseModule.mjs';
import { env } from '../../env/env.mjs';

class RabbitProducerModule extends BaseModule {
    constructor() {
        super();
        this.connection = null;
        this.channel = null;
        this.channelRPC = null
    }
    async connect(queue) {
        return new Promise(async (resolve, reject) => {
            try {

                this.connection = await amqp.connect('amqp://localhost');
                this.channel = await this.connection.createChannel();
                await this.channel.assertQueue(queue);

                console.log(`🚀 Server and Producer is running ${queue} on ${env.API_PORT}`);
                resolve()
            } catch (error) {
                console.error(`Erro ao conectar ao RabbitMQ: ${queue}`, error);
                reject(error)
            }
        })
    }

    async createNewChannel(queue) {
        this.channelRPC = await this.connection.createChannel()
        await this.channel.assertQueue(queue)

        console.log(`new channel RPC created ${queue}`)
    }

    async sender(queue, msg, correlationId) {
        console.log("correlationId", correlationId)
        try {
            if (correlationId) {
                await this.createNewChannel("rpc")
                if (!this.channelRPC) {
                    console.error("New Channel not initialized")
                }
                this.channel.sendToQueue(
                    queue,
                    Buffer.from(msg),
                    {
                        replyTo: "rpc",
                        correlationId: correlationId
                    }
                );
            } else {
                if (!this.channel) {
                    console.error("Channel not initialized")
                }
                this.channel.sendToQueue(
                    queue,
                    Buffer.from(msg)
                );
            }
            console.log(`✅ msg sending to ${queue} - ${msg}`);
        } catch (error) {
            console.error(`Error to sending to queue ${queue} - ${msg}`, error);
        }
    }


}

export default RabbitProducerModule;
