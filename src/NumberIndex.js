const
    util = require('@pfoerdie/utility');

/**
 * @template {number} Key 
 * @template {any} Value 
 * @template {number} Depth 
 */
class NumberIndex {

    #depth = 0;
    #size = 0;
    #index = Object.create(null);

    /**
     * @param {Depth} depth 
     */
    constructor(depth = 1) {
        util.assert.number.integer(depth, 1, 255);
        this.#depth = depth;
    }

    /** @type {number} */
    get size() { return this.#size; }

    /**
     * @param  {...Key} keys 
     * @returns {boolean}
     */
    has(...keys) {
        util.assert.equal(keys.length, this.#depth);
        let target = this.#index;
        for (let key of keys) {
            util.assert.number(key);
            if (!(key in target)) return false;
            target = target[key];
        }
        return true;
    }

    /**
     * @param  {...Key} keys 
     * @returns {Value|void}
     */
    get(...keys) {
        util.assert.equal(keys.length, this.#depth);
        let target = this.#index;
        for (let key of keys) {
            util.assert.number(key);
            if (!(key in target)) return;
            target = target[key];
        }
        return target;
    }

    /**
     * @param {Value} value 
     * @param {...Key} keys 
     * @returns {void} 
     */
    set(value, ...keys) {
        util.assert.equal(keys.length, this.#depth);
        const last = keys.pop();
        util.assert.number(last);
        let target = this.#index;
        for (let key of keys) {
            util.assert.number(key);
            target = target[key] || (target[key] = Object.create(null));
        }
        if (!(last in target)) this.#size++;
        target[last] = value;
    }

    /**
     * @param {Value} value 
     * @param {...Key} keys 
     * @returns {boolean} 
     */
    add(value, ...keys) {
        util.assert.equal(keys.length, this.#depth);
        const last = keys.pop();
        util.assert.number(last);
        let target = this.#index;
        for (let key of keys) {
            util.assert.number(key);
            target = target[key] || (target[key] = Object.create(null));
        }
        if (last in target) return false;
        this.#size++;
        target[last] = value;
        return true;
    }

    /**
     * @param {...(Key|null|undefined)} [filter] 
     * @returns {Iterator<[Value, ...Key]>} 
     */
    *match(...filter) {
        const search = new Array(this.#depth), max = search.length - 1;
        let i = 0, target = this.#index, stack = [];
        while (i >= 0) {
            // the search is finished if the index depth i drops below 0
            if (!search[i]) {
                // search entry does not yet exist
                if (filter.length > 0 && !util.is.null(filter[i])) {
                    // create search entry based on filter, if the filter is not null
                    const key = filter[i];
                    util.assert.number(key);
                    if (!(key in target)) return;
                    search[i] = [key];
                } else {
                    // create search entry based on object keys
                    search[i] = Object.keys(target);
                }
            }
            if (search[i].length > 0) {
                // search entry is not empty yet
                const key = search[i][0];
                if (i < max) {
                    // enter the next search depth 
                    // and push the previous target to the stack
                    i++;
                    stack.push(target);
                    target = target[key];
                } else {
                    // yield the target if i equals max
                    // and remove the key from search
                    const keys = search.map(arr => arr[0]);
                    yield [target[key], ...keys];
                    search[i].shift();
                }
            } else {
                // delete the search if it is empty
                // and get the last target back from stack
                delete search[i];
                if (--i < 0) continue;
                target = stack.pop();
                search[i].shift();
            }
        }
    }

    *[Symbol.iterator]() {
        // TODO
    }

}

module.exports = NumberIndex;

// const tmp = new NumberIndex(2);

// tmp.set('test1', -1, 1);
// tmp.set('test2', 1, 2);
// tmp.set('test3', 2, 1);
// tmp.set('test4', 2, 2);
// tmp.set('test5', 2, 3);
// tmp.set('test6', -1, Math.PI);

// console.log(Array.from(tmp.match()).map(entry => entry.join(' ')).join('\n'));
// debugger;