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
     * @param {Function} compareFunction A Function used to order each item within the
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
    constructor(compareFunction = Comparator.compareFnAscending) {
        /**
         * @private
         *
         * @type {Function}
         */
        this._compareFunction = compareFunction

        /**
         * @private
         *
         * @type {*}
         */
        this._itemCollection = []

        /**
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
     * @private
     *
     * @param {Function} compareFunction
     * @param {Array.<*>} itemCollection
     * @param {*} pushedItem
     * @param {Number} idxNr
     */
    _bubbleUp(compareFunction, itemCollection, pushedItem, idxNr) {
        //
        // @type {Number}
        //
        let parentIdxNr

        //
        // Go from the last item within the Collection - the "pushedItem" - to each
        // Parent until we reach our final destination.
        //
        while ((parentIdxNr = ((idxNr - 1) >> 1)) >= 0 && compareFunction(itemCollection[parentIdxNr], pushedItem) > 0) {
            itemCollection[idxNr] = itemCollection[parentIdxNr]
            itemCollection[parentIdxNr] = pushedItem

            idxNr = parentIdxNr
        }
    }

    /**
     * Add an item to the Heap.
     *
     * `O(log n)`
     *
     * @param {*} pushItem
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
    push(pushItem) {
        //
        // @type {Array.<*>}
        //
        const itemCollection = this._itemCollection

        //
        // @see this._itemCollection
        //
        itemCollection.push(pushItem)

        this._bubbleUp(this._compareFunction, itemCollection, pushItem, this.size)

        return ++this.size
    }

    /**
     * @private
     *
     * @param {Function} compareFunction
     * @param {Array.<*>} itemCollection
     */
    _sinkDown(compareFunction, itemCollection, shiftedItem, idxNr) {
        //
        // Create a reference to the first and second Child.
        //
        // @type {Number}
        //
        let fChildIdxNr, sChildIdxNr

        while (true) {
            fChildIdxNr = (idxNr << 1) + 1, sChildIdxNr = fChildIdxNr + 1

            if (fChildIdxNr >= itemCollection.length) break

            //
            // Based on whether the current Heap is a Min or Max Heap, we'll use
            // either the "lesser" or "bigger" Child.
            //
            if (sChildIdxNr < itemCollection.length && compareFunction(itemCollection[fChildIdxNr], itemCollection[sChildIdxNr]) > 0) {
                fChildIdxNr = sChildIdxNr
            }

            //
            // The Child is "bigger" or "smaller" than the item we've appended to
            // our item Collection. Is dependent on #._compareFunction.
            //
            if (compareFunction(itemCollection[fChildIdxNr], shiftedItem) <= 0) {
                itemCollection[idxNr] = itemCollection[fChildIdxNr]
                itemCollection[fChildIdxNr] = shiftedItem
            }

            idxNr = fChildIdxNr
        }
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
        return this._itemCollection[0]
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
        if (this.size === 0) return undefined

        //
        // @type {Number}
        //
        this.size--

        if (this.size === 0) return this._itemCollection.pop()

        //
        // @type {Array.<*>}
        //
        const itemCollection = this._itemCollection

        //
        // @type {*}
        //
        const rootItem = itemCollection[0]

        //
        // Replace the old Root with the last item within the Heap.
        //
        // @type {*}
        //
        const shiftedItem = itemCollection[0] = itemCollection.pop()

        this._sinkDown(this._compareFunction, itemCollection, shiftedItem, 0)

        return rootItem
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
        const aHeap = this.constructor.fromHeap(this)

        //
        // Store the current Heap as an Array.
        //
        // @type {Array.<*>}
        //
        const itemCollection = []

        //
        // Pop each item of the Heap and append it to the item Collection.
        //
        while (aHeap.size) itemCollection.push(aHeap.pop())

        return itemCollection
    }

    /**
     * Create a Heap by giving an Array, Set or another Iterable.
     *
     * @param {Iterable} iterateOver
     * @param {Function} compareFunction
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
    static from(iterateOver, compareFunction = Comparator.compareFnAscending) {
        const aHeap = new Heap(compareFunction)

        for (const pushItem of iterateOver) aHeap.push(pushItem)

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

        //
        // Link the current comparison Function to the new Heap.
        //
        // @type {Function}
        //
        aHeap._compareFunction = useHeap._compareFunction

        //
        // Copy the current Data Structure instead of using the #.from Function and
        // then appending each item.
        //
        // @type {Array.<*>}
        //
        aHeap._itemCollection = useHeap._itemCollection.slice()

        //
        // Update the #.size value of the Heap to match the Data Structure.
        //
        // @type {Number}
        //
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
     * @param {Function} compareFunction
     *
     * @example
     *
     * const MinHeap = require('estructura/heap').MinHeap
     *
     * const minHeap = new MinHeap()
     */
    constructor(compareFunction = Comparator.compareFnAscending) {
        super(compareFunction)
    }

    /**
     * @param {Iterable} iterateOver
     * @param {Function} compareFunction
     *
     * @return {Heap}
     *
     * @example
     *
     * const minHeap = MinHeap.from(['A', 'C', 'B', 'D'])
     */
    static from(iterateOver, compareFunction = Comparator.compareFnAscending) {
        return Heap.from(iterateOver, compareFunction)
    }
}

/**
 * @class {MaxHeap}
 */
class MaxHeap extends Heap {
    /**
     * @constructor
     *
     * @param {Function} compareFunction
     *
     * @example
     *
     * const MaxHeap = require('estructura/heap').MaxHeap
     *
     * const maxHeap = new MaxHeap()
     */
    constructor(compareFunction = Comparator.compareFnDescending) {
        super(compareFunction)
    }

    /**
     * @param {Iterable} iterateOver
     * @param {Function} compareFunction
     *
     * @return {Heap}
     *
     * @example
     *
     * const maxHeap = MaxHeap.from(['A', 'C', 'B', 'D'])
     */
    static from(iterateOver, compareFunction = Comparator.compareFnDescending) {
        return Heap.from(iterateOver, compareFunction)
    }
}

Heap.MinHeap = MinHeap
Heap.MaxHeap = MaxHeap

module.exports = Heap