import { ZodError, z } from "zod";
import Db from "../db.mjs";


class BaseModule {
    constructor() {
        this.db = new Db();
        this.knex = this.db.knex;
    }

    validate(schema, obj) {
        let errors;
        const zodSchema = {};

        for (const key in schema) {
            zodSchema[key] = z[schema[key]]();
        }

        try {
            const res = z.object(zodSchema).parse(obj);
            errors = res.errors;
        } catch (ex) {
            throw ex
        }
    }
}

export default BaseModule;