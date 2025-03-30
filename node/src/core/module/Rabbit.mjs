import amqp from 'amqplib';
import BaseModule from './BaseModule.mjs';
import Core from '../core.mjs';

class RabbitModule extends BaseModule {
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
        try {
            console.log('🟢 Aguardando mensagens...');
            this.channel.consume(this.queueName, async (msg) => {
                if (!msg) return;
                const url = msg.content.toString();
                console.log(`📬 URL recebida: ${url}`);
                const core = new Core()

                // Perform web scraping
                const { title, price } = await core.product.findTitleAndPriceByUrl(url);
                const product = await core.product.save({ url: url, name: title, price })

                console.log("procut", product)

                const { message, currentPrice } = await core.price.findLast({ productId: product.id });


                console.log(message, currentPrice)
                // if (!lastPrice) {
                //     console.log(`📈 Preço aumentou de ${lastPrice} para R$${price}`);
                //     // await sendEmail(price, lastPrice, url);
                // } else if (lastPrice && price > lastPrice) {
                //     console.log(`O preço desse produto será observado, atual está ${price}`)
                // } else {
                //     console.log(`Ultimo preço ${lastPrice} e preço atual ${price}`)
                // }

            });
        } catch (error) {
            console.error('Erro ao consumir mensagens:', error);
            this.channel.nack(msg, false, true);
        }
    }

    async close() {
        try {
            await this.channel.close();
            await this.connection.close();
            console.log('🚪 Conexão RabbitMQ fechada!');
        } catch (error) {
            console.error('Erro ao fechar conexão RabbitMQ:', error);
        }
    }
}

export default RabbitModule;
