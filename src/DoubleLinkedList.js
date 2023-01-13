class ListItem {

    constructor(value) { this._value = value; }
    get value() { return this._value; }
    set value(value) { this._value = value; }

    find(value) {
        if (this._value === value) return this;
        let target = this;
        while (target._next) {
            target = target._next;
            if (target._value === value) return target;
        }
        target = this;
        while (target._prev) {
            target = target._prev;
            if (target._value === value) return target;
        }
        return null;
    }

    add(value) {
        const listItem = new ListItem(value);
        listItem._next = this._next;
        listItem._prev = this;
        this._next = listItem;
        return listItem;
    }

    delete() {
        if (this._prev) this._prev._next = this._next;
        if (this._next) this._next._prev = this._prev;
        this._prev = null;
        this._next = null;
    }

}