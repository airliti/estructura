/**
 * @class {Deque}
 */
class Deque {
    /**
     * @constructor
     *
     * @example
     *
     * const Deque = require('estructura/deque')
     *
     * //
     * // Create a new instance of the Double-Ended Queue:
     * const aDeque = new Deque()
     */
    constructor() {
        /**
         * @private
         *
         * @type {Array.<*>}
         */
        this._fCollection = []

        /**
         * @private
         *
         * @type {Number}
         */
        this._fOffset = 0

        /**
         * @private
         *
         * @type {Array.<*>}
         */
        this._sCollection = []

        /**
         * @private
         *
         * @type {Number}
         */
        this._sOffset = 0

        /**
         * The total size of the Deque.
         *
         * @type {Number}
         */
        this.size = 0

        /**
         * @see #.peek
         *
         * @type {Function}
         */
        this.peekFront = this.peek
    }

    /**
     * Append an item to the Double-Ended Queue.
     *
     * `O(1)`
     *
     * @param {*} aValue
     *
     * @return {Number} The new size of the Deque.
     *
     * @example
     *
     * const aDeque = new Deque()
     *
     * aDeque.push('Add a new value to the end of the Deque.')
     * >>> 1
     */
    push(aValue) {
        this._sCollection.push(aValue)

        return ++this.size
    }

    /**
     * Prepend an item to the Deque.
     *
     * `O(1)`
     *
     * @param {*} aValue
     *
     * @return {Number} The new size of the Double-Ended Queue.
     *
     * @example
     *
     * const aDeque = new Deque()
     *
     * aDeque.unshift('Prepend a Value to the Deque.')
     * >>> 1
     */
    unshift(aValue) {
        this._fCollection.push(aValue)

        return ++this.size
    }

    /**
     * Return the last item within the Deque.
     *
     * Maximum of `O(n)` due to the internal structure used to store the Double-Ended
     * Queue and the built-in `#.slice` Function within JavaScript.
     *
     * @return {*} Return `undefined` when the `#.size` is equal to 0.
     *
     * @example
     *
     * const aDeque = new Deque()
     * aDeque.push('Hello John Doe!')
     *
     * aDeque.pop()
     * >>> Hello John Doe!
     */
    pop() {
        // return this.popOrShift('_sCollection', '_sOffset', '_fCollection', '_fOffset')

        //
        // this._fOffset = 0
        // this._fCollection = [ ]
        // 
        // this._sOffset = 2
        // this._sCollection = [ null, null, "A", "B", "C" ]
        // 
        // +---+---+---+---+---+
        // | 0 | 1 | 2 | 3 | 4 |
        // +---+---+---+---+---+
        // | N | N | A | B | C |
        // +---+---+---+---+---+
        // 
        // .shift() -> Position 0 became "null"
        // .shift() -> Position 1 became "null"
        // 
        // .push('A')
        // .push('B')
        // .push('C')
        // 
        // N: null
        // 
        // -> The #.shift method was used twice increasing the #._sOffset to 2. But
        // unless that value is equal to the length of the Array, we can still
        // #.pop an item of the back.
        //
        if (this._sOffset < this._sCollection.length) {
            this.size--

            return this._sCollection.pop()
        }

        //
        // this._fOffset = 2
        // this._fCollection = [ null, null, "A", "B", "C" ]
        // 
        // this._sOffset = 0
        // this._sCollection = [ ]
        // 
        // +---+---+---+---+---+
        // | 0 | 1 | 2 | 3 | 4 |
        // +---+---+---+---+---+
        // | N | N | A | B | C |
        // +---+---+---+---+---+
        // 
        // .pop() -> Position 0 became "null"
        // .pop() -> Position 1 became "null"
        // 
        // .unshift('A')
        // .unshift('B')
        // .unshift('C')
        // 
        // N: null
        // 
        // -> In our case, the #.pop method was used twice increasing the
        // #._fOffset to 2. But unless that value is equal to the length of
        // the Array, we can still #.pop an item of the back.
        //
        if (this._fOffset < this._fCollection.length) {
            this.size--

            //
            // @type {*}
            //
            const poppedItem = this._fCollection[this._fOffset]

            this._fCollection[this._fOffset] = null

            this._fOffset++

            //
            // this._fOffset = 2
            // this._fCollection = [ null, null, "A", "B", "C" ]
            // 
            // +---+---+---+---+---+
            // | 0 | 1 | 2 | 3 | 4 |
            // +---+---+---+---+---+
            // | N | N | A | B | C |
            // +---+---+---+---+---+
            // 
            // N: null
            // 
            // -> Resize the Array when +50 % of the Array is "null";
            //
            if (this._fOffset * 2 >= this._fCollection.length) {
                this._fCollection = this._fCollection.slice(this._fOffset)

                this._fOffset = 0
            }

            return poppedItem
        }

        return undefined
    }

    /**
     * Return the first item within the Double-Ended Queue.
     *
     * Maximum of `O(n)` due to the resizing of the Deque when necessary due to
     * the internal structure. Is dependent on the `#.slice` Function within
     * JavaScript.
     *
     * @return {*} Return the first item within the Deque or `undefined` when the
     *             `#.size` is equal to zero.
     *
     * @example
     *
     * const aDeque = new Deque()
     * aDeque.push('Hello Jane Doe!')
     *
     * aDeque.shift()
     * >>> Hello Jane Doe!
     */
    shift() {
        // return this.popOrShift('_fCollection', '_fOffset', '_sCollection', '_sOffset')

        //
        // this._fOffset = 2
        // this._fCollection = [ null, null, "A", "B", "C" ]
        // 
        // this._sOffset = 0
        // this._sCollection = [ ]
        // 
        // -> The #._sOffset and #._sCollection aren't taken into account yet, because
        // there is something within the #._fCollection to return.
        // 
        // +---+---+---+---+---+
        // | 0 | 1 | 2 | 3 | 4 |
        // +---+---+---+---+---+
        // | N | N | A | B | C |
        // +---+---+---+---+---+
        // 
        // .pop() -> Position 0 became "null"
        // .pop() -> Position 1 became "null"
        // 
        // .unshift('A') -> Inserted A at position 2
        // .unshift('B') -> Put B at position 3
        // .unshift('C') -> Append C to position 4
        // 
        // N: null
        // 
        // -> If the #._fOffset is smaller than the Array length, we can assume
        // there is an item to #.pop. Why #.pop instead of #.shift? Mainly for
        // performance.
        //
        if (this._fOffset < this._fCollection.length) {
            this.size--

            return this._fCollection.pop()
        }

        //
        // this._fOffset = 0
        // this._fCollection = [ ]
        // 
        // -> The #._fOffset and #._fCollection does NOT matter at the moment, it
        // has been handled.
        // 
        // this._sOffset = 2
        // this._sCollection = [ null, null, "A", "B", "C" ]
        // 
        // +---+---+---+---+---+
        // | 0 | 1 | 2 | 3 | 4 |
        // +---+---+---+---+---+
        // | N | N | A | B | C |
        // +---+---+---+---+---+
        // 
        // .shift() -> Position 0 became "null"
        // .shift() -> Position 1 became "null"
        // 
        // .push('A')
        // .push('B')
        // .push('C')
        // 
        // N: null
        // 
        // -> We've used the #.shift method twice, and therefore we've increased
        // the #._sOffset to 2.
        //
        if (this._sOffset < this._sCollection.length) {
            this.size--

            //
            // @type {*}
            //
            const shiftedItem = this._sCollection[this._sOffset]

            this._sCollection[this._sOffset] = null

            this._sOffset++

            //
            // this._sOffset = 2
            // 
            // +---+---+---+---+---+
            // | 0 | 1 | 2 | 3 | 4 |
            // +---+---+---+---+---+
            // | N | N | A | B | C |
            // +---+---+---+---+---+
            // 
            // N: null
            // 
            // -> Clear the Array of "null" values when +50 % of the values
            // within the Array are "null";
            //
            if (this._sOffset * 2 >= this._sCollection.length) {
                this._sCollection = this._sCollection.slice(this._sOffset)

                this._sOffset = 0
            }

            return shiftedItem
        }

        return undefined
    }

    /**
     * Take a look at the first item within the Deque.
     *
     * `O(1)`
     *
     * @return {*} Return the first item within the Double-Ended Queue without
     *             removing the item or "undefined" if the Deque is empty.
     *
     * @example
     *
     * const aDeque = new Deque()
     * aDeque.push('Hello John Doe!')
     *
     * aDeque.peek()
     * >>> Hello John Doe!
     *
     * @alias peekFront
     */
    peek() {
        if (this._fCollection.length > this._fOffset) {
            return this._fCollection[this._fCollection.length - 1]
        }

        if (this._sCollection.length > this._sOffset) {
            return this._sCollection[this._sOffset]
        }

        return undefined
    }

    /**
     * Take a peek at the last item within the Deque.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const aDeque = new Deque()
     * aDeque.push('Hello A.')
     * aDeque.push('Hello B.')
     *
     * aDeque.peekBack()
     * >>> Hello B.
     *
     * @example
     *
     * <caption>
     * The `#.peekBack` method will become an alias for the `#.peek` method if only
     * 1 item is present within the Double-Ended Queue.
     * </caption>
     *
     * const aDeque = new Deque()
     * aDeque.push('Hello A.')
     *
     * aDeque.peekBack()
     * >>> Hello A.
     */
    peekBack() {
        if (this._sCollection.length > this._sOffset) {
            return this._sCollection[this._sCollection.length - 1]
        }

        if (this._fCollection.length > this._fOffset) {
            return this._fCollection[this._fOffset]
        }

        return undefined
    }

    /**
     * @return {Array.<*>}
     *
     * @example
     *
     * const aDeque = new Deque()
     * aDeque.push('Hello John Doe!')
     * aDeque.push('Hello Jane Doe!')
     *
     * aDeque.toArray()
     * >>> [ "Hello John Doe!", "Hello Jane Doe!" ]
     */
    toArray() {
        const toArray = this._fCollection.slice(this._fOffset).reverse()

        return toArray.concat(this._sCollection.slice(this._sOffset))
    }

    /**
     * Create a Deque from an Iterable.
     *
     * @param {Iterable} iterateOver
     *
     * @return {Deque}
     *
     * @example
     *
     * const aDeque = Deque.from(["John Doe", "Jane Doe"])
     */
    static from(iterateOver) {
        const aDeque = new Deque()

        for (const aValue of iterateOver) aDeque.push(aValue)

        return aDeque
    }
}

module.exports = Deque