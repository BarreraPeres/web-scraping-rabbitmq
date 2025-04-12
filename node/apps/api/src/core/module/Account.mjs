import Core from "../core.mjs";
import BaseModule from "./BaseModule.mjs";

import bcryptjs from "bcryptjs"
import { InvalidCredencialsError } from "../errors/invalid-credentials-error.mjs";
import { EmailAlreadyExists } from "../errors/email-already-exists.mjs";

const { compare } = bcryptjs

class AccountModule extends BaseModule {
    async login(email, password) {
        this.validate({
            email: "string",
            password: "string"
        }, { email, password })
        const core = new Core()

        const user = await core.user.findByEmail({ email })
        const isSamePassword = await compare(password, user.password)

        if (!isSamePassword) {
            throw new InvalidCredencialsError()
        }

        return user
    }

    async signup({ name, email, password }) {
        this.validate({
            name: "string",
            email: "string",
            password: "string"
        }, { name, email, password })

        const core = new Core()

        const userAlreadyExists = await core.user.findByEmailOrNull({ email })
        if (userAlreadyExists) {
            throw new EmailAlreadyExists()
        }

        const user = await core.user.create({
            name,
            email,
            password
        })

        if (!user) {
            throw new Error(`Error on creating user ${name, email, password}`)
        }
        return user
    }
}

export default AccountModule;