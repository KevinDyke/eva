const Eva = require('../eva');
const Environment = require('../Environment');

const tests = [
    require('./self-eval-test.js'),
    require('./maths-test.js'),
    require('./variables-test.js'),
    require('./block-test.js'),
    require('./if-test.js'),
    require('./while-test.js'),
    require('./built-in-functions-test.js'),
    require('./user-defined-functions-test.js'),
];

const eva = new Eva();

tests.forEach(test => test(eva));

eva.eval(['print', '"Hello,"', '"World!"']);
console.log('All assertions passed!');