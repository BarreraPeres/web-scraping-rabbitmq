import assert from 'node:assert';
import it from 'node:test';

import Core from '../../src/core/core.mjs';

it('should be initialize Core', async () => {
    const core = new Core();
    assert(core);
    assert(core.user);
    assert(core.product);
    assert(core.price);
    assert(core.rabbitProducer);
    assert(core.account);
});