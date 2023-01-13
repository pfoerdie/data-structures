exports.ListNode = class ListNode {

    constructor(value = null) {
        this.value = value;
        Object.defineProperties(this, {
            _head: { value: this, enumerable: false, writable: true, configurable: false },
            _next: { value: null, enumerable: false, writable: true, configurable: false }
        });
    }

    get head() { return this._head; }
    get next() { return this._next; }

    append(value) {
        const node = (value instanceof ListNode) ? value : new ListNode(value);
        node._head = this._head;
        node._next = this._next;
        this._next = node;
        return this._next;
    }

    find(value) {
        if (value instanceof ListNode) {
            if (value === this) return this;
        } else {
            if (value === this.value) return this;
        }
        if (this._next) return this._next.find(value);
    }

    collect() {
        const values = [];
        let target = this._head;
        while (target._next) {
            values.push(target.value);
            target = target._next;
        }
        values.push(target.value);
        return values;
    }

};

const test = new exports.ListNode(0);
test.append(1).append(2).append(3);
test.append(4).append(5).append(new exports.ListNode(6));
console.log(test.find(2).collect());