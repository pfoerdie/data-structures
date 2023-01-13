/**
 * @extends Array 
 * @template Value 
 */
class ArraySet extends Array {

    static get [Symbol.species]() {
        return ArraySet;
    }

    /**
     * @param {Iterable<Value>} arrayLike 
     * @param {(value: Value, index: number) => Value} [mapFn] 
     * @param {any} [thisArg] 
     * @returns {ArraySet<Value>}
     */
    static from(arrayLike, mapFn, thisArg) {
        let value = Array.from.call(this, arrayLike, mapFn, thisArg);
        return value.clean();
    }

    /**
     * @param {...Value} values 
     * @returns {ArraySet<Value>}
     */
    static of(...values) {
        let value = Array.of.apply(this, values);
        return value.clean();
    }

    /**
     * @inheritdoc
     */
    constructor(...args) {
        super(...args);
        this.clean();
    }

    /**
     * @type {number}
     */
    get size() {
        return this.length;
    }

    /**
     * @param {Value} value 
     * @returns {this}
     */
    add(value) {
        for (let i = 0, max = this.length - 1; i <= max; i++) {
            if (this[i] === value) {
                return this;
            }
        }
        super.push(value);
        return this;
    }

    /**
     * @returns {void}
     */
    clear() {
        for (let i = 0, max = this.length - 1; i <= max; i++) {
            super.pop();
        }
    }

    /**
     * @returns {this}
     */
    clean() {
        for (let i = 1, max = this.length - 1; i <= max; i++) {
            if (super.lastIndexOf(this[i], i - 1) >= 0) {
                this[i] = this[max--];
                super.pop();
            }
        }
        return this;
    }

    /**
     * @param {Value} value 
     * @param {boolean} [safe=false] 
     * @returns {boolean}
     */
    delete(value, safe = false) {
        if (safe) {
            let found = false;
            for (let i = 0, max = this.length - 1; i <= max; i++) {
                if (this[i] === value) {
                    found = true;
                    this[i] = this[max--];
                    super.pop();
                }
            }
            return found;
        } else {
            for (let i = 0, max = this.length - 1; i <= max; i++) {
                if (this[i] === value) {
                    this[i] = this[max--];
                    super.pop();
                    return true;
                }
            }
            return false;
        }
    }

    /**
     * @param {Value} value 
     * @returns {boolean}
     */
    has(value) {
        for (let i = 0, max = this.length - 1; i <= max; i++) {
            if (this[i] === value) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param {Value} value 
     * @returns {number}
     */
    count(value) {
        let found = 0;
        for (let i = 0, max = this.length - 1; i <= max; i++) {
            if (this[i] === value) {
                found++;
            }
        }
        return found;
    }

};

module.exports = ArraySet;