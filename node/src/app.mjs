import express from 'express'
import cookieParser from 'cookie-parser'
import Routes from './http/routes.mjs'
import { env } from './env/env.mjs'
import Core from './core/core.mjs'

const app = express()

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


Routes(app)

app.listen(env.API_PORT, () => {
    console.log(`🚀 Server is running on port ${env.API_PORT}`)
})

