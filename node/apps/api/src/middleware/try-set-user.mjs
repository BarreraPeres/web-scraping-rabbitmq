
import jwt from "jsonwebtoken"
import { env } from "../env/env.mjs";

async function trySetUserMiddleware(req, res, next) {
    const token = req.signedCookies.token;
    if (!token) {
        return next();
    }

    try {
        jwt.verify(token, env.JWT_SECRET)
        const jsonToken = jwt.decode(token)

        const user = await req.ctx.user.findById(jsonToken.user_id);
        const store = req.query.store ?
            await req.ctx.store.findByLinkAndUserId(req.query.store, user.id) :
            await req.ctx.store.findById(jsonToken.store_id);

        req.user = user;
        req.store = store;
    } catch (e) {
        e.status = 401
        if (e instanceof ResourceNotFound) {
            return res.status(401).json({
                ok: false,
                message: e.message
            })
        }
    }
    next();
}
export default trySetUserMiddleware;
