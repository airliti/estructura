const Comparator = require('./util/Comparator'), Heap = require('./Heap')

/**
 * @class {PriorityQueue}
 */
class PriorityQueue {
    /**
     * @constructor
     *
     * @param {Function} compareFn
     *
     * @example
     *
     * const PriorityQueue = require('estructura/priority-queue')
     */
    constructor(compareFn = Comparator.compareFnAscending) {
        this.aHeap_ = new Heap(compareFn)

        Object.defineProperty(this, 'size', {
            get: () => {
                return this.aHeap_.size
            }
        })

        this.peekFront = this.peek
    }

    /**
     * Add a value to the Priority Queue.
     *
     * `O(1)`
     *
     * @param {*} aValue
     *
     * @return {Number} The new size of the Queue.
     *
     * @example
     *
     * const priorityQueue = new PriorityQueue()
     *
     * priorityQueue.enqueue('John Doe')
     * >>> 1
     */
    enqueue(aValue) {
        this.aHeap_.push(aValue)

        return this.aHeap_.size
    }

    /**
     * Get the value of the first item without removing it from the Priority Queue.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const priorityQueue = new PriorityQueue()
     * priorityQueue.push('John Doe')
     * priorityQueue.push('Jane Doe')
     *
     * priorityQueue.peek()
     * >>> John Doe
     *
     * @alias peekFront
     */
    peek() {
        return this.aHeap_.peek()
    }

    /**
     * Retrieve the first item within a Queue.
     *
     * @return {*}
     *
     * @example
     *
     * const priorityQueue = new PriorityQueue()
     * priorityQueue.push('John Doe')
     * priorityQueue.push('Jane Doe')
     *
     * priorityQueue.dequeue()
     * >>> John Doe
     */
    dequeue() {
        return this.aHeap_.pop()
    }

    /**
     * Convert the Priority Queue to an Array.
     *
     * @return {Array.<*>}
     *
     * @example
     *
     * const priorityQueue = new PriorityQueue()
     * priorityQueue.push('John Doe')
     * priorityQueue.push('Jane Doe')
     *
     * priorityQueue.toArray()
     * >>> [ "John Doe", "Jane Doe" ]
     */
    toArray() {
        return this.aHeap_.toArray()
    }

    /**
     * Create a Priority Queue from an Iterable.
     *
     * @param {Iterable} iterateOver
     * @param {Function} compareFn
     *
     * @return {PriorityQueue}
     *
     * @example
     *
     * const priorityQueue = PriorityQueue.from(['John Doe', 'Jane Doe'])
     */
    static from(iterateOver, compareFn = Comparator.compareFnAscending) {
        const priorityQueue = new PriorityQueue(compareFn)

        for (const aValue of iterateOver) priorityQueue.enqueue(aValue)

        return priorityQueue
    }
}

module.exports = PriorityQueue