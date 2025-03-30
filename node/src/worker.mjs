import Core from "./core/core.mjs";
import ProductModule from "./core/module/Product.mjs";
import RabbitModule from "./core/module/Rabbit.mjs";
// import { sendEmail } from "./email.js";

async function startWorker() {

    const core = new Core()
    const product = new ProductModule()

    const rabbitModule = new RabbitModule(core)
    await rabbitModule.connect()

    try {
        console.log(`🟢 Aguardando URLs para scraping... ${core.rabbit.queueName}`);
        rabbitModule.consumeQueue()

    } catch (error) {
        console.error('Erro ao configurar consumidor:', error);
        await rabbitModule.close();
        process.exit(1);
    }
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Encerrando consumidor...');
        await rabbitModule.close();
        process.exit(0);
    });
}

startWorker().catch(error => {
    console.error('Erro no consumidor de scraping:', error);
    process.exit(1);
});
