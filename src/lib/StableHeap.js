const Comparator = require('./util/Comparator')

/**
 * Used to wrap any given Function to the Stable Heap in order to ensure a First
 * In First Out mechanism between each and every item that is equal.
 *
 * @param {Function} compareFunction
 *
 * @return {Function}
 */
const wrapComparator = (compareFunction) => {
    /**
     * @private
     *
     * @param {{aValue: *, insertNr: Number}} itemA
     * @param {{aValue: *, insertNr: Number}} itemB
     *
     * @return {Boolean}
     */
    return (itemA, itemB) => {
        const comparisonOutput = compareFunction(itemA.aValue, itemB.aValue)

        return comparisonOutput !== 0 ? comparisonOutput : itemA.insertNr < itemB.insertNr ? +1 : -1
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
     * @param {Function} compareFunction
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
    constructor(compareFunction = Comparator.compareFnAscending) {
        super(
            wrapComparator(compareFunction)
        )

        /**
         * @private
         *
         * @type {Number}
         */
        this._insertNr = Number.MAX_SAFE_INTEGER

        this.peekFront = this.peek
    }

    /**
     * Insert a new item within the Stable Heap.
     *
     * `O(log n)`
     *
     * @param {*} pushItem
     */
    push(pushItem) {
        return super.push({aValue: pushItem, insertNr: this._insertNr--})
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
        return super.pop().aValue
    }

    /**
     * Create a Heap by giving Iterable.
     *
     * @param {Iterable} iterateOver
     * @param {Function} compareFunction
     *
     * @return {Heap}
     */
    static from(iterateOver, compareFunction = Comparator.compareFnAscending) {
        const aHeap = new StableHeap(compareFunction)

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
     * @param {Function} compareFunction
     */
    constructor(compareFunction = Comparator.compareFnDescending) {
        super(compareFunction)
    }

    /**
     * @param {Iterable} iterateOver
     * @param {Function} compareFunction
     *
     * @return {Heap}
     */
    static from(iterateOver, compareFunction = Comparator.compareFnDescending) {
        return StableHeap.from(iterateOver, compareFunction)
    }
}

StableHeap.MinHeap = StableMinHeap
StableHeap.MaxHeap = StableMaxHeap

module.exports = StableHeap