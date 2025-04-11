
import { ZodError } from "zod";

export const errorHandler = (error, req, res, next) => {
    if (error instanceof ZodError) {
        return res.status(400).send({
            message: "Validation Error",
            errors: error.flatten().fieldErrors
        })
    }

    return res.status(500).send({ message: "Internal Server Error!" })
}