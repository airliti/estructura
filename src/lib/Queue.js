/**
 * @class {Queue}
 */
class Queue {
    /**
     * @constructor
     *
     * @example
     *
     * const Queue = require('estructura/queue')
     *
     * const aQueue = new Queue()
     */
    constructor() {
        /**
         * @private
         *
         * @type {Array.<*>}
         */
        this._itemCollection = []

        /**
         * @private
         *
         * @type {Number}
         */
        this._itemOffset = 0

        /**
         * The total size of the `#._itemCollection` for the current Queue.
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
     * Add an item to the Queue.
     *
     * `O(1)`
     *
     * @param {*} enqueueItem
     *
     * @return {Number} The new size of the Queue.
     *
     * @example
     *
     * const aQueue = new Queue()
     *
     * aQueue.enqueue('John Doe')
     * >>> 1
     */
    enqueue(enqueueItem) {
        this._itemCollection.push(enqueueItem)

        return ++this.size
    }

    /**
     * Get the value of the first item without removing it from the Queue.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const aQueue = new Queue()
     * aQueue.push('John Doe')
     * aQueue.push('Jane Doe')
     *
     * aQueue.peek()
     * >>> John Doe
     *
     * @alias peekFront
     */
    peek() {
        return this._itemCollection[this._itemOffset]
    }

    /**
     * Retrieve the first item within a Queue.
     *
     * Maximum of `O(n / 2)` due to the resizing of the internally used Array to
     * store each item within the Queue.
     *
     * @return {*}
     *
     * @example
     *
     * const aQueue = new Queue()
     * aQueue.push('John Doe')
     * aQueue.push('Jane Doe')
     *
     * aQueue.dequeue()
     * >>> John Doe
     */
    dequeue() {
        if (this.size === 0) return undefined

        //
        // @type {*}
        //
        const dequeueItem = this._itemCollection[this._itemOffset]

        this._itemCollection[this._itemOffset] = null

        //
        // @type {Number}
        //
        this._itemOffset++

        //
        // Resize a Queue when the #.dequeue method is frequently used. Otherwise
        // we'll end up with an enormous #._itemCollection full of "null";
        //
        if (this._itemOffset * 2 >= this._itemCollection.length) {
            this._itemCollection = this._itemCollection.slice(this._itemOffset)

            this._itemOffset = 0
        }

        this.size--

        return dequeueItem
    }

    /**
     * Convert the Queue back to an Array.
     *
     * @return {Array.<*>}
     *
     * @example
     *
     * const aQueue = new Queue()
     * aQueue.push('John Doe')
     * aQueue.push('Jane Doe')
     *
     * aQueue.toArray()
     * >>> [ "John Doe", "Jane Doe" ]
     */
    toArray() {
        return this._itemCollection.slice(this._itemOffset)
    }

    /**
     * Create a Queue from any given Iterable.
     *
     * @param {Iterable} iterateOver
     *
     * @return {Queue}
     *
     * @example
     *
     * const aQueue = Queue.from(['John Doe', 'Jane Doe'])
     */
    static from(iterateOver) {
        const aQueue = new Queue()

        for (const enqueueItem of iterateOver) aQueue.enqueue(enqueueItem)

        return aQueue
    }
}

module.exports = Queue