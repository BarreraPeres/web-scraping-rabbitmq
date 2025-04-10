import assert from 'node:assert';
import it, { after, afterEach, beforeEach, describe } from 'node:test';

import Db from '../../../src/core/db.mjs';
import UserModule from '../../../src/core/module/User.mjs';
import AccountModule from '../../../src/core/module/Account.mjs';

describe("Account Model", async () => {
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

    it('should be initialize Account module', async () => {
        const account = new AccountModule();

        assert(account);
    });

    it('should be possible to login', async () => {
        const userModule = new UserModule();
        const sut = new AccountModule();

        const user = await userModule.create({
            name: "Test",
            email: "test@test.com",
            password: "123456789"
        })
        const userInLogin = await sut.login(
            "test@test.com",
            "123456789"
        )

        assert(userInLogin)
        assert(userInLogin.name)
        assert(userInLogin.email === "test@test.com")
    });
    it('should be possible to signup', async () => {
        const sut = new AccountModule();

        const user = await sut.signup({
            name: "Test",
            email: "test@test.com",
            password: "123456789"
        })

        assert(user)
        assert(user.name)
        assert(user.email === "test@test.com")
    });




})