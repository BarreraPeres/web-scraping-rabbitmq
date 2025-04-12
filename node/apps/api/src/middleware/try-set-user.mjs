
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

        const user = await req.core.user.findById(jsonToken.user_id);

        req.user = user;
    } catch (e) {
        e.status = 401
        throw e
    }
    next();
}
export default trySetUserMiddleware;
