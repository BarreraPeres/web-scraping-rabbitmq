import express from 'express'
import cookieParser from 'cookie-parser'
import { env } from './env/env.mjs'
import Core from './core/core.mjs'
import RabbitProducerModule from './core/module/Rabbit-Producer.mjs'
import { errorHandler } from './error-handler.mjs'
import makeAuthEndpoint from './http/auth.mjs'
import makeEndpoint from './http/routes.mjs'

const app = express()
const rabbitProducer = new RabbitProducerModule()

app.use(cookieParser(env.JWT_SECRET))
app.use(express.json())

app.use((req, _, next) => {
    const core = new Core();
    req.core = core;

    next()
})


function allowCrossOrigin(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, user_id"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
}

app.use(allowCrossOrigin);

makeAuthEndpoint(app)
makeEndpoint(app)
app.use(errorHandler)

setTimeout(async () => {
    await rabbitProducer.connect("monitor_prices")
    app.listen(env.API_PORT)
}, 1000)


