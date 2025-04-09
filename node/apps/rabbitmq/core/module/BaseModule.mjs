import { ZodError, z } from "zod";


class BaseModule {
    constructor() {
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
            if (ex instanceof ZodError) {
                throw new Error(
                    ex.errors.map((e) => `Field=${e.path} - expected=${e.expected} - received=${e.received}`)
                        .join('\n')
                );
            }
            throw ex
        }
    }
}

export default BaseModule;