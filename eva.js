/**
 * Eva interpreter.
 */
const assert = require('assert');

const Environment = require('./Environment');    

/**
 * Eva interpreter
 */
class Eva {

    /**
     * Creates an Eva instance with the global environment. 
     */
    constructor(global = new Environment()) {
        this.global = global;
    }

    /**
     * Evaluates an expression in the given environment. 
     */
    eval(exp, env = this.global) {
        
        if (isNumber(exp)) {
            return exp;
        }

        if (isString(exp)) {
            return exp.slice(1, -1);
        }

        // ------------------------------------------------------
        // Maths operations:
        if (exp[0] === '+') {
            return this.eval(exp[1], env) + this.eval(exp[2], env);
        }

        if (exp[0] === '-') {
            return this.eval(exp[1], env) - this.eval(exp[2], env);
        }

        if (exp[0] === '*') {
            return this.eval(exp[1], env) * this.eval(exp[2], env);
        }

        if (exp[0] === '/') {
            return this.eval(exp[1], env) / this.eval(exp[2], env);
        }

        // ------------------------------------------------------
        // Block: sequence of expressions

        if (exp[0] === 'begin') {
            const blockEnv = new Environment({}, env);

            return this._evalBlock(exp, blockEnv);
        }

        // ------------------------------------------------------
        // Variable declaration: (var foo 10)
        if (exp[0] === 'var') {
            const [_, name, value] = exp;
            return env.define(name, this.eval(value, env));   
        }

        // ------------------------------------------------------
        // Variable update: (set foo 10)
        if (exp[0] === 'set') {
            const [_, name, value] = exp;
            return env.assign(name, this.eval(value, env));  
        }

        // ------------------------------------------------------
        // Variable access: (foo)
        if (isVariableName(exp)) {
            return env.lookup(exp);   
        }

        throw `Unimplementted: ${JSON.stringify(exp)}`;
    }

    _evalBlock(block, env) {
        let result;

        const [_tag, ...expressions] = block;

        expressions.forEach(exp => {
            result = this.eval(exp, env);
        });
        return result;
    }
}

function isNumber(exp) {
    return typeof exp === 'number';
}

function isString(exp) {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp) {
    return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}

// -------------------------------------------------
// Tests:

const eva = new Eva(new Environment({
    null: null,

    true: true,
    false: false,

    VERSION: '0.1'
}));

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

// Variables
assert.strictEqual(eva.eval(['var', 'x', 10]), 10);
assert.strictEqual(eva.eval('x'), 10);
assert.strictEqual(eva.eval(['var', 'y', 100]), 100);
assert.strictEqual(eva.eval('y'), 100);

assert.strictEqual(eva.eval('VERSION'), '0.1');
assert.strictEqual(eva.eval(['var','isUser','true']), true);

assert.strictEqual(eva.eval(['var', 'z', ['*', 2, 21]]), 42);
assert.strictEqual(eva.eval('z'), 42);

// Blocks
assert.strictEqual(eva.eval(
    ['begin',

        ['var', 'x', 10],
        ['var', 'y', 20],

        ['+', ['*', 'x', 'y'], 30],

    ]),
230);

assert.strictEqual(eva.eval(
    ['begin',

        ['var', 'x', 10],
       
        ['begin',

            ['var', 'x', 20],
            'x'

        ],

        'x'

    ]),
10);

assert.strictEqual(eva.eval(
    ['begin',

        ['var', 'value', 10],

        ['var', 'result', ['begin',

            ['var', 'x', ['+', 'value', 10]],
            'x'

        ]],

        'result'

    ]),
20);

assert.strictEqual(eva.eval(
    ['begin',

        ['var', 'data', 10],

        ['begin',

            ['set', 'data', 100],
 
        ],

        'data'

    ]),
100);





console.log('All assertions passed!');