import assert from 'node:assert';
import it, { after, afterEach, beforeEach, describe } from 'node:test';
import { execSync } from 'node:child_process';

import UserModule from '../../../src/core/module/User.mjs';
import Db from '../../../src/core/db.mjs';

describe("User Model", async () => {
    beforeEach(async () => {
        const db = new Db();
        await db.knex.raw('start transaction')
    });
    afterEach(async () => {
        const db = new Db();
        await db.knex.raw('rollback')
    });
    after(async () => {
        const db = new Db();
        await db.knex.destroy();
    })

    it('should be initialize User module', async () => {
        const user = new UserModule();

        assert(user);
    });

    it('should be possible to create User ', async () => {
        const sus = new UserModule();

        const user = await sus.create({
            name: "Test",
            email: "test@test.com",
            password: "123456789"
        })

        assert(user)
        assert(user.name)
        assert(user.email === "test@test.com")
    });



})