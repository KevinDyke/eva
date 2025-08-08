const assert = require('assert');

module.exports = eva => {

    // Self evaluating expressions : Numbers
    assert.strictEqual(eva.eval(1), 1);
    assert.strictEqual(eva.eval(42), 42);

    // Self evaluating expressions : Strings
    assert.strictEqual(eva.eval('"hello World!"'), 'hello World!');
};