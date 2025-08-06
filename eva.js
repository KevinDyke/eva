/**
 * Eva interpreter.
 */
const assert = require('assert');

class Eva {
    eval(exp) {

        
        if (isNumber(exp)) {
            return exp;
        }

        if (isString(exp)) {
            return exp.slice(1, -1);
        }

        if (exp[0] === '+') {
            return this.eval(exp[1]) + this.eval(exp[2]);
        }

        if (exp[0] === '-') {
            return this.eval(exp[1]) - this.eval(exp[2]);
        }

        if (exp[0] === '*') {
            return this.eval(exp[1]) * this.eval(exp[2]);
        }

        if (exp[0] === '/') {
            return this.eval(exp[1]) / this.eval(exp[2]);
        }


        throw 'Unimplementted';
    }
}

function isNumber(exp) {
    return typeof exp === 'number';
}

function isString(exp) {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}


// -------------------------------------------------
// Tests:

const eva = new Eva();

// Self evaluating expressions : Numbers
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval(42), 42);

// Self evaluating expressions : Strings
assert.strictEqual(eva.eval('"hello World!"'), 'hello World!');

// Mathematical operations
assert.strictEqual(eva.eval(['+',1 ,1]), 2);
assert.strictEqual(eva.eval(['+', ['+',1 ,1],1]), 3);
assert.strictEqual(eva.eval(['+',1 ,['+',5,5]]), 11);
assert.strictEqual(eva.eval(['+',['+',9,10] ,['+',5,5]]), 29);

assert.strictEqual(eva.eval(['-',10 ,1]), 9);
assert.strictEqual(eva.eval(['-',['-',10,1] ,1]), 8);
assert.strictEqual(eva.eval(['-',20, ['-',10,1]]), 11);
assert.strictEqual(eva.eval(['-',['-',30,10], ['-',10,1]]), 11);

assert.strictEqual(eva.eval(['*',10 ,2]), 20);
assert.strictEqual(eva.eval(['*',['*',5,3],10]), 150);
assert.strictEqual(eva.eval(['*',3,['*',5,3]]), 45);
assert.strictEqual(eva.eval(['*',['*',4,5],['*',5,3]]), 300);

assert.strictEqual(eva.eval(['/',10 ,2]), 5);
assert.strictEqual(eva.eval(['/',['/',20,2] ,5]), 2);
assert.strictEqual(eva.eval(['/',60,['/',30,2]]), 4);
assert.strictEqual(eva.eval(['/',['/',80,2] ,['/',5,1]]), 8);

assert.strictEqual(eva.eval(['+',['-',['*',['/',10 ,2],5],1],36]), 60);


console.log('All assertions passed!');