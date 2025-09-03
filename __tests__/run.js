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
    require('./lambda-test.js'),
    require('./switch-test.js'),
    require('./for-test.js'),
    require('./inc-test.js'),
    require('./dec-test.js'),
    require('./inc-val-test.js'),
    require('./dec-val-test.js'),
    require('./mul-val-test.js'),
    require('./div-val-test.js'),


    require('./class-test.js'),
];

const eva = new Eva();

tests.forEach(test => test(eva));

eva.eval(['print', '"Hello,"', '"World!"']);
console.log('All assertions passed!');