import amqp from 'amqplib';
import BaseModule from './BaseModule.mjs';
import Core from '../core.mjs';

class RabbitModule extends BaseModule {
    constructor() {
        super();
        this.queueName = 'monitor_prices';
        this.connection = null;
        this.channel = null;
        this.count = 0
    }
    async connect() {
        try {
            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.queueName, { durable: true });
            console.log('🚀 Conectado ao RabbitMQ!');
        } catch (error) {
            console.error('Erro ao conectar ao RabbitMQ:', error);
        }
    }

    async sendToQueue(url) {
        if (!this.channel) {
            console.error('Channel not initialized');
            return;
        }
        try {
            this.channel.sendToQueue(
                this.queueName,
                Buffer.from(url),
                { persistent: true }
            );
            console.log('✅ URL enviada para a fila');
        } catch (error) {
            console.error('Erro ao enviar URL para a fila:', error);
        }
    }

    async consumeQueue() {
        if (!this.channel) {
            console.error("Channel not initialized")
        }
        try {
            console.log('🟢 Aguardando mensagens...');
            this.channel.consume(this.queueName, async (msg) => {
                if (!msg) return;
                const url = msg.content.toString();
                console.log(`📬 URL recebida: ${url}`);
                const core = new Core()

                const { title, price } = await core.product.findTitleAndPriceByUrl(url);
                const product = await core.product.create({ url: url, name: title, price })

                let lastPrice = await core.price.findLast({ productId: product.id });
                if (!lastPrice) {
                    lastPrice = await core.price.create({
                        product_id: product.id,
                        price
                    })

                }

                while (this.count <= 0) {
                    let message

                    lastPrice = lastPrice
                    if (!lastPrice) {
                        message = `O preço desse produto será observado, atual está ${price}`
                    } else if (lastPrice > price) {
                        message = `Preço aumentou de ${lastPrice} para R$${price}`
                    } else if (lastPrice === price) {
                        message = `O preço atual está ${price}`
                    } else {
                        message = `Preço ABAIXOu de ${lastPrice} para ${price} `
                    }

                    this.count++;
                }

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

                this.channel.ack(msg);

            });
        } catch (error) {
            console.error('Error when consuming messages:', error);
            this.channel.nack(msg, false, true);
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

export default RabbitModule;
