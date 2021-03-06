const Comparator = require('./util/Comparator')

/**
 * The standard Heap Object is a MinHeap.
 *
 * @class {Heap}
 */
class Heap {
    /**
     * @constructor
     *
     * @param {Function} compareFn A Function used to order each item within the
     *                               Heap.
     *
     * @example
     *
     * const Heap = require('estructura/heap')
     *
     * const aHeap = new Heap()
     *
     * @example
     *
     * <caption>
     * Or supply your own comparison Function.
     * </caption>
     *
     * const Heap = require('estructura/heap')
     *
     * const aHeap = new Heap(
     *     (itemA, itemB) => {
     *         // return -1, 0 or +1
     *     }
     * )
     */
    constructor(compareFn = Comparator.compareFnAscending) {
        this.compareFn_ = compareFn
        this.heapData_ = []

        this.size = 0

        this.peekFront = this.peek
    }

    /**
     * Add an item to the Heap.
     *
     * `O(log n)`
     *
     * @param {*} aValue
     *
     * @return {Number} The new size of the Heap.
     *
     * @example
     *
     * const aHeap = new Heap()
     *
     * aHeap.push('John Doe')
     * >>> 1
     */
    push(aValue) {
        const heapData = this.heapData_, compareFn = this.compareFn_
        heapData.push(aValue)

        // #.bubbleUp
        let idxNr = this.size, parentIdxNr

        while ((parentIdxNr = ((idxNr - 1) >> 1)) >= 0 && compareFn(heapData[parentIdxNr], aValue) > 0) {
            heapData[idxNr] = heapData[parentIdxNr]
            heapData[parentIdxNr] = aValue

            idxNr = parentIdxNr
        }

        return ++this.size
    }

    /**
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * <caption>
     * Dependent on the used comparison `Function`. The default comparison `Function`
     * will sort in an ascending manner.
     * </caption>
     *
     * const aHeap = new Heap()
     * aHeap.push(4)
     * aHeap.push(2)
     *
     * aHeap.peek()
     * >>> 2
     *
     * @alias peekFront
     */
    peek() {
        return this.heapData_[0]
    }

    /**
     * `O(log n)`
     *
     * @return {*}
     *
     * @example
     *
     * <caption>
     * Based on the comparison `Function`. Return the `Min` or `Max` value within
     * the `Heap`.
     * </caption>
     *
     * const aHeap = new Heap()
     * aHeap.push(4)
     * aHeap.push(2)
     *
     * aHeap.pop()
     * >>> 2
     */
    pop() {
        if (this.size < 1) return undefined

        const heapData = this.heapData_
        const heapSize = --this.size

        const retValue = heapData[0]
        const dwnValue = heapData.pop()

        if (heapSize < 1) return retValue

        heapData[0] = dwnValue

        const compareFn = this.compareFn_

        // #.sinkDown
        let idxNr = 0, fChildIdxNr = (idxNr << 1) + 1, sChildIdxNr = fChildIdxNr + 1

        while (fChildIdxNr < heapSize) {
            if (sChildIdxNr < heapSize && compareFn(heapData[fChildIdxNr], heapData[sChildIdxNr]) > 0) {
                fChildIdxNr = sChildIdxNr
            }

            if (compareFn(heapData[fChildIdxNr], dwnValue) <= 0) {
                heapData[idxNr] = heapData[fChildIdxNr]
                heapData[fChildIdxNr] = dwnValue
            }

            idxNr = fChildIdxNr, fChildIdxNr = (idxNr << 1) + 1, sChildIdxNr = fChildIdxNr + 1
        }

        return retValue
    }

    /**
     * Turn the current Data Structure into an Array.
     *
     * @return {*}
     *
     * @example
     *
     * <caption>
     * Based on whether the current `Heap` is a `MinHeap` or `MaxHeap`. Take a look at
     * the comparison `Function`.
     * </caption>
     *
     * const aHeap = new Heap()
     * aHeap.push('A')
     * aHeap.push('B')
     *
     * aHeap.toArray()
     * >>> [ "A", "B" ]
     */
    toArray() {
        const aHeap = this.constructor.fromHeap(this), heapData = []

        while (aHeap.size) heapData.push(
            aHeap.pop()
        )

        return heapData
    }

    /**
     * Create a Heap by giving an Array, Set or another Iterable.
     *
     * @param {Iterable} iterateOver
     * @param {Function} compareFn
     *
     * @return {Heap}
     *
     * @example
     *
     * const aHeap = Heap.from(['A', 'C', 'B', 'D'])
     *
     * @example
     *
     * <caption>
     * Or by supplying your own comparison `Function`.
     * </caption>
     *
     * const aHeap = Heap.from(['A', 'C', 'B', 'D'],
     *     (itemA, itemB) => {
     *         // return -1, 0 or +1
     *     }
     * )
     */
    static from(iterateOver, compareFn = Comparator.compareFnAscending) {
        const aHeap = new Heap(compareFn)

        for (const aValue of iterateOver) aHeap.push(aValue)

        return aHeap
    }

    /**
     * Create a copy of a Heap.
     *
     * @param {Heap} useHeap
     *
     * @return {Heap}
     *
     * @example
     *
     * const heapA = new Heap()
     * heapA.push('A')
     * heapA.push('C')
     * heapA.push('B')
     * heapA.push('D')
     *
     * const heapB = Heap.fromHeap(heapA)
     * heapB.push('F')
     * heapB.push('E')
     *
     * heapA.size
     * >>> 4
     *
     * heapB.size
     * >>> 6
     */
    static fromHeap(useHeap) {
        const aHeap = new useHeap.constructor(null)

        // Copy the current `compareFn_`:
        aHeap.compareFn_ = useHeap.compareFn_

        // Create a shallow copy and insert the `heapData_`:
        aHeap.heapData_ = useHeap.heapData_.slice()

        aHeap.size = useHeap.size

        return aHeap
    }
}

/**
 * @class {MinHeap}
 */
class MinHeap extends Heap {
    /**
     * @constructor
     *
     * @param {Function} compareFn
     *
     * @example
     *
     * const MinHeap = require('estructura/heap').MinHeap
     *
     * const minHeap = new MinHeap()
     */
    constructor(compareFn = Comparator.compareFnAscending) {
        super(compareFn)
    }

    /**
     * @param {Iterable} iterateOver
     * @param {Function} compareFn
     *
     * @return {Heap}
     *
     * @example
     *
     * const minHeap = MinHeap.from(['A', 'C', 'B', 'D'])
     */
    static from(iterateOver, compareFn = Comparator.compareFnAscending) {
        return Heap.from(iterateOver, compareFn)
    }
}

/**
 * @class {MaxHeap}
 */
class MaxHeap extends Heap {
    /**
     * @constructor
     *
     * @param {Function} compareFn
     *
     * @example
     *
     * const MaxHeap = require('estructura/heap').MaxHeap
     *
     * const maxHeap = new MaxHeap()
     */
    constructor(compareFn = Comparator.compareFnDescending) {
        super(compareFn)
    }

    /**
     * @param {Iterable} iterateOver
     * @param {Function} compareFn
     *
     * @return {Heap}
     *
     * @example
     *
     * const maxHeap = MaxHeap.from(['A', 'C', 'B', 'D'])
     */
    static from(iterateOver, compareFn = Comparator.compareFnDescending) {
        return Heap.from(iterateOver, compareFn)
    }
}

Heap.MinHeap = MinHeap
Heap.MaxHeap = MaxHeap

module.exports = Heap