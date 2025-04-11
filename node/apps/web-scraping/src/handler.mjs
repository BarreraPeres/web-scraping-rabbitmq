function handler(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res)
        } catch (e) {
            next(e);
        }
    }
}

export default handler;