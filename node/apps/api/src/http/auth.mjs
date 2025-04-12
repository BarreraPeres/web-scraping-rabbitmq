import express from "express"
import { z } from "zod";
import jwt from "jsonwebtoken";

import handler from "../handler.mjs";
import trySetUserMiddleware from "../middleware/try-set-user.mjs";
import { env } from "../env/env.mjs";

const router = express.Router();

function getRequestDomain(req) {
    if (process.env.DOMAIN) { return process.env.DOMAIN }
    return (req.headers.origin || req.headers.host || "")
        .replace("http://", "")
        .replace("https://", "")
        .replace(/:\d+$/, "")
}

function setCookie(req, res, user) {
    const tokenData = {
        user_id: user.id,
    }
    const token = jwt.sign(tokenData, env.JWT_SECRET)
    console.log("token", token)

    res.cookie("token", token, {
        domain: getRequestDomain(req),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        signed: true // cookie assinado
    })
}

async function handleGetIndex(req, res) {
    try {
        const { user } = req

        return res.status(200).json({
            ok: true,
            store,
            user
        })
    } catch (e) {
        throw e
    }

}

async function handlePostSignUp(req, res) {
    const schemaParams = z.object({
        password: z.string(),
        email: z.string(),
        name: z.string()
    })
    const { name, password, email } = schemaParams.parse(req.body)

    try {
        const user = await req.core.account.signup({
            email,
            name,
            password
        })

        setCookie(req, res, user)

        return res.status(200).json({
            name: user.name,
            email: user.email
        })

    } catch (e) {
        throw e
    }

}
async function handlePostLogin(req, res) {
    try {
        const schemaParams = z.object({
            password: z.string(),
            email: z.string()
        })
        const { password, email } = schemaParams.parse(req.body)

        const user = await req.ctx.user.login(
            email,
            password
        )

        setCookie(req, res, user)

        return res.status(201).json({
            name: user.name,
            email: user.email,
        })
    } catch (e) {
        throw e
    }
}

router.post("/signup", handler(handlePostSignUp));

router.post("/login", handler(handlePostLogin));

router.get("/", trySetUserMiddleware, handler(handleGetIndex))

export default function makeAuthEndpoint(app) {
    app.use("/auth", router)
}
