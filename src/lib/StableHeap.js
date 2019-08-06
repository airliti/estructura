const Comparator = require('./util/Comparator')

/**
 * @param {Function} compareFn
 *
 * @return {Function}
 */
const wrapComparator = (compareFn) => {
    /**
     * @private
     *
     * @param {{aValue: *, insertNr: Number}} itemA
     * @param {{aValue: *, insertNr: Number}} itemB
     *
     * @return {Boolean}
     */
    return (itemA, itemB) => {
        const aVsB = compareFn(itemA.aValue, itemB.aValue)

        return aVsB !== 0 ? aVsB : (itemA.createdAt === itemB.createdAt ? (itemA.insertNr < itemB.insertNr ? +1 : -1) : (itemA.createdAt > itemB.createdAt ? +1 : -1))
    }
}

/**
 * @see {Heap}
 */
const Heap = require('./Heap')

/**
 * @class {StableHeap}
 */
class StableHeap extends Heap {
    /**
     * @constructor
     *
     * @param {Function} compareFn
     *
     * @example
     *
     * const StableHeap = require('estructura/stable-heap')
     *
     * const stableHeap = new StableHeap()
     *
     * @example
     *
     * <caption>
     * Or by supplying your own comparison `Function`. This is also possible with
     * the `MinHeap` and `MaxHeap`.
     * </caption>
     *
     * const StableHeap = require('estructura/stable-heap')
     *
     * const stableHeap = new StableHeap(
     *     (itemA, itemB) => {
     *         // return -1, 0 or +1
     *     }
     * )
     *
     * @example
     *
     * const StableMinHeap = require('estructura/stable-heap').MinHeap
     *
     * const stableMinHeap = new StableMinHeap()
     *
     * @example
     *
     * const StableMaxHeap = require('estructura/stable-heap').MaxHeap
     *
     * const stableMaxHeap = new StableMaxHeap()
     */
    constructor(compareFn = Comparator.compareFnAscending) {
        super(
            wrapComparator(compareFn)
        )

        /**
         * @private
         *
         * @type {Number}
         */
        this.earlierCreatedAt_ = Date.now()

        /**
         * @private
         *
         * @type {Number}
         */
        this.insertNr_ = Number.MAX_SAFE_INTEGER

        this.peekFront = this.peek
    }

    /**
     * Insert a new item within the Stable Heap.
     *
     * `O(log n)`, when `this._insertNr < 1`, the Stable Heap will be renumbered
     *
     * @param {*} aValue
     */
    push(aValue) {
        const createdAt = Date.now()

        if (createdAt > this.earlierCreatedAt_) {
            this.earlierCreatedAt_ = createdAt

            this.insertNr_ = Number.MAX_SAFE_INTEGER
        }

        return super.push({aValue: aValue, createdAt: createdAt, insertNr: this.insertNr_--})
    }

    /**
     * Receive the `Min` or `Max` item within the Stable Heap, dependent on the
     * comparison Function, without removing it.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @alias peekFront
     */
    peek() {
        return super.peek().aValue
    }

    /**
     * Return the `Min` or `Max` item, dependent on the comparison Function, and
     * remove it from the Stable Heap.
     *
     * `O(log n)`
     *
     * @return {*}
     */
    pop() {
        const poppedObject = super.pop()

        return poppedObject ? poppedObject.aValue : undefined
    }

    /**
     * Create a Heap by giving Iterable.
     *
     * @param {Iterable} iterateOver
     * @param {Function} compareFn
     *
     * @return {Heap}
     */
    static from(iterateOver, compareFn = Comparator.compareFnAscending) {
        const aHeap = new StableHeap(compareFn)

        for (const pushItem of iterateOver) aHeap.push(pushItem)

        return aHeap
    }
}

/**
 * @class {StableMinHeap}
 */
class StableMinHeap extends StableHeap {

}

/**
 * @class {StableMaxHeap}
 */
class StableMaxHeap extends StableHeap {
    /**
     * @constructor
     *
     * @param {Function} compareFn
     */
    constructor(compareFn = Comparator.compareFnDescending) {
        super(compareFn)
    }

    /**
     * @param {Iterable} iterateOver
     * @param {Function} compareFn
     *
     * @return {Heap}
     */
    static from(iterateOver, compareFn = Comparator.compareFnDescending) {
        return StableHeap.from(iterateOver, compareFn)
    }
}

StableHeap.MinHeap = StableMinHeap
StableHeap.MaxHeap = StableMaxHeap

module.exports = StableHeap