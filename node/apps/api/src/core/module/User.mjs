
import { InvalidCredencialsError } from "../errors/invalid-credentials-error.mjs"
import { ValidationError } from "../errors/validation-error.mjs"

import bcryptjs from "bcryptjs"
import BaseModule from "./BaseModule.mjs"
import { ResourceNotFound } from "../errors/resource-not-found.mjs"
const { compare, hash } = bcryptjs

class UserModule extends BaseModule {
    async create(userData) {
        this.validate({
            email: "string",
            name: "string",
            password: "string",
        }, userData);

        const hashedPassword = await hash(userData.password, 8);

        const user = await this.knex('users').insert({
            ...userData,
            password: hashedPassword
        }).returning('*');

        if (!user || !user.length) {
            throw new ValidationError("Unknow error while insert user!");
        }

        return user[0]
    }
    async findByEmail({ email }) {
        this.validate({
            email: "string"
        }, { email })

        const user = await this
            .knex("users")
            .where({ email })
            .first();

        if (!user) {
            throw new InvalidCredencialsError()
        }

        return user
    }
    async findByEmailOrNull({ email }) {
        this.validate({
            email: "string"
        }, { email })

        const user = await this
            .knex("users")
            .where({ email })
            .first();

        return user || null
    }
    async findById(id) {
        this.validate({ id: "string" }, { id })

        const user = await this.knex("users").where({ id }).first();
        if (!user) {
            throw new ResourceNotFound()
        }
        return user
    }

    async del(id) {
        this.validate({ id: "string" }, id)

        await this.knex("users")
            .where({ id })
            .del()
    }
}

export default UserModule;