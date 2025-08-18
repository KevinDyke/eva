const { onParseBegin } = require("../parser/evaParser");

/**
 * AST Transformer.
 */
class Transformer {

    /**
     * Translates 'def'-expression (function declaration)
     * into a variable declaration with a lambda
     * expression
     */
    transformDefToVarLambda(defExp) {
        const [_tag, name, params, body] = defExp;
        return ['var', name, ['lambda', params, body]];
    }

    /** 
     * Transforms 'switch' to nested 'if'-expressions.
     */
    transformSwitchToIf(switchExp) {
        const [_tag, ...cases] = switchExp;

        const ifExp = ['if', null, null, null];

        let current = ifExp;

        for (let i = 0; i < cases.length - 1; i++) {
            const [currentCond, currentBlock] = cases[i];

            current[1] = currentCond;
            current[2] = currentBlock;

            const next = cases[i + 1];
            const [nextCond, nextBlock] = next;

            current[3] = nextCond === 'else'
                ? nextBlock
                : ['if'];

            current = current[3];
        }

        return ifExp;
    }

    /**
     * Transforms `for` to `while`
     * 
     * / Syntactic sugar for: (begin init (while condition (begin body modifier)))
     */
    transformForToWhile(forExp) {
       const [_tag, init, condition, modifier, exp] = forExp;
       
       return ['begin', init, ['while', condition, ['begin', exp, modifier]]];
    }

    /**
     * Transforms 'inc' to set
     */

    transferIncToSet(setExp) {
        const [_tag, exp] = setExp;
        
        return ['set', exp, ['+', exp, 1]];
    }

    /**
     * Transforms 'dec' to set
     */

    transferDecToSet(setExp) {
        const [_tag, exp] = setExp;
        
        return ['set', exp, ['-', exp, 1]];
    }

    /**
     * Transforms `+= foo val` to (set foo (+ foo val))
     */
    transformIncValToSet(incExp) {
        const [_tag, exp, val] = incExp;
        return ['set', exp, ['+', exp, val]];
    }

    /**
     * Transforms `+= foo val` to (set foo (+ foo val))
     */
    transformDecValToSet(decExp) {
        const [_tag, exp, val] = decExp;
        return ['set', exp, ['-', exp, val]];
    }

    /**
     * Transforms `*= foo val` to (set foo (* foo val))
     */
    transformMulValToSet(mulExp) {
        const [_tag, exp, val] = mulExp;
        return ['set', exp, ['*', exp, val]];
    }

    /**
     * Transforms `/= foo val` to (set foo (/ foo val))
     */
    transformDivValToSet(divExp) {
        const [_tag, exp, val] = divExp;
        return ['set', exp, ['/', exp, val]];
    }





}

module.exports = Transformer;