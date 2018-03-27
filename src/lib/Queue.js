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
        this.aQueue_ = [], this.headOffset_ = 0

        this.size = 0

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
        this.aQueue_.push(enqueueItem)

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
        return this.aQueue_[this.headOffset_]
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

        const aValue = this.aQueue_[this.headOffset_]

        this.aQueue_[this.headOffset_] = null

        if (++this.headOffset_ * 2 >= this.aQueue_.length) {
            this.aQueue_ = this.aQueue_.slice(this.headOffset_)

            this.headOffset_ = 0
        }

        this.size--

        return aValue
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
        return this.aQueue_.slice(this.headOffset_)
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

        for (const aValue of iterateOver) aQueue.enqueue(aValue)

        return aQueue
    }
}

module.exports = Queue