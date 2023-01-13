const
    assert = require('assert'),
    max_buffer_size = 2 ** 32 - 1,
    max_bitarray_size = 8 * max_buffer_size;

// https://stackoverflow.com/questions/6972717/how-do-i-create-bit-array-in-javascript
class BitArray {

    // IDEA create a ram buffer with limited storage of maybe 32 byte
    // IDEA use an Int32Array and handle 32 bit chunks instead of 8 bit chunks
    // IDEA use the 32bit integer as buffer and only store the last value and index range
    // IDEA option to instantiate with a buffer to be able to create an expand method, that copies the buffer into a larger one

    #size = 0;
    /** @type {Buffer} */
    #buffer = null;

    constructor(size = 0, fill = false) {
        assert(size >= 0 && size < max_bitarray_size, 'size is out of range');
        this.#size = size;
        if (fill instanceof Buffer) {
            this.#buffer = Buffer.alloc(Math.ceil(size / 8));
            fill.copy(this.#buffer);
        } else {
            this.#buffer = Buffer.alloc(Math.ceil(size / 8), fill ? 255 : 0);
            if (fill && size > 0)
                this.#buffer[this.#buffer.length - 1] &= (1 << ((size - 1) % 8) + 1) - 1;
        }
    }

    get size() { return this.#size; }

    get(index) {
        assert(index >= 0 && index < this.#size, 'index is out of bounds');
        const
            byteIndex = Math.floor(index / 8),
            indexBit = 1 << (index % 8);
        return (this.#buffer[byteIndex] & indexBit) == indexBit;
    }

    set(index, value = true) {
        assert(index >= 0 && index < this.#size, 'index is out of bounds');
        const
            byteIndex = Math.floor(index / 8),
            indexBit = 1 << (index % 8);
        if (value) this.#buffer[byteIndex] |= indexBit;
        else this.#buffer[byteIndex] &= ~indexBit;
    }

    toggle(index) {
        assert(index >= 0 && index < this.#size, 'index is out of bounds');
        const
            byteIndex = Math.floor(index / 8),
            indexBit = 1 << (index % 8);
        this.#buffer[byteIndex] ^= indexBit;
    }

    expand(range) {
        return new BitArray(this.#size + range, this.#buffer);
    }

    // toString() {
    //     let str = '';
    //     for (let i = 0, length = this.#buffer.length; i < length; i++) {
    //         str += this.#buffer[i].toString(2).padStart(8, '0').split('').reverse().join('');
    //     }
    //     return str;
    // }

}

module.exports = BitArray;

// const tmp = new BitArray(1337, false);
// tmp.set(42, true);
// tmp.set(69, false);
// tmp.toggle(420);
// console.log(tmp.get(42), tmp.get(69), tmp.get(420));

// const tmp2 = new BitArray(6, true);
// const tmp3 = tmp2.expand(6);
// tmp3.toggle(10);
// tmp3.set(10, false);
// console.log('' + tmp2 + '\n' + tmp3);