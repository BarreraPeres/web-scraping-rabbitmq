import assert from 'node:assert';
import it from 'node:test';

import BaseModule from '../../../src/core/module/BaseModule.mjs';

it('should be initialize BaseModule', async () => {
    const base = new BaseModule();
    assert(base);
    assert(base.db);
    assert(base.knex);
});

