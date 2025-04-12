
import { ZodError } from "zod";
import { InvalidCredencialsError } from "./core/errors/invalid-credentials-error.mjs";
import { EmailAlreadyExists } from "./core/errors/email-already-exists.mjs";

export const errorHandler = (error, req, res, next) => {
    if (error instanceof ZodError) {
        console.error(error.message)
        return res.status(400).send({
            message: "Validation Error",
            errors: error.flatten().fieldErrors
        })
    }
    if (error instanceof InvalidCredencialsError) {
        console.error(error.message)
        return res.status(403).send({
            message: "Invalid Credentials",
        })
    }

    if (error instanceof EmailAlreadyExists) {
        console.error(error.message)
        return res.status(401).send({
            message: error.message
        })
    }

    return res.status(500).send({ message: "Internal Server Error!" })

}