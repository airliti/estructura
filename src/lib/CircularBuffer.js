/**
 * @class {CircularBuffer}
 */
class CircularBuffer {
    /**
     * @constructor
     *
     * @param {Number} maxSize
     *
     * @example
     *
     * const circularBuffer = require('estructura/circular-buffer')
     */
    constructor(maxSize) {
        if (isNaN(maxSize) === true) throw new Error(`${maxSize} is NaN.`)

        /**
         * @private
         *
         * @type {Array.<*>} _sCollection
         */
        this._sCollection = []

        /**
         * @private
         *
         * @type {Number}
         */
        this._headOffset = 0

        /**
         * @type {Number}
         */
        this.size = 0

        /**
         * The maximum length of our internal Array.
         *
         * @type {Number}
         */
        this.maxSize = maxSize

        /**
         * @see #.peek
         *
         * @type {Function}
         */
        this.peekFront = this.peek
    }

    /**
     * Append an item to the Circular Buffer.
     *
     * `O(1)`
     *
     * @param {*} aValue
     *
     * @return {Number} The new size of the Circular Buffer.
     *
     * @example
     *
     * const circularBuffer = new CircularBuffer()
     *
     * circularBuffer.push('Add a new value to the end of the Circular Buffer.')
     * >>> 1
     */
    push(aValue) {
        if (this.size === this.maxSize) {
            /**
             * Replace the oldest item within the Buffer with a new
             * value.
             *
             * @type {*}
             */
            this._sCollection[this._headOffset] = aValue

            /**
             * Increase the `_headOffset` to account for the replacement
             * of the oldest value.
             *
             * @type {Number}
             */
            this._headOffset = (this._headOffset + 1) % this.maxSize
        }
        else {
            /**
             * @type {*}
             */
            this._sCollection[(this._headOffset + this.size) % this.maxSize] = aValue

            /**
             * @type {Number}
             */
            this.size++
        }

        return this.size
    }

    /**
     * Return the last item within the Circular Buffer.
     *
     * `O(1)`
     *
     * @return {*} Return `undefined` when the `#.size` is equal to 0.
     *
     * @example
     *
     * const circularBuffer = new CircularBuffer()
     * circularBuffer.push('Hello John Doe!')
     *
     * circularBuffer.pop()
     * >>> Hello John Doe!
     */
    pop() {
        if (this.size === 0) return undefined

        /**
         * @type {Number}
         */
        this.size--

        /**
         * @type {Number}
         */
        const idxNr = (this._headOffset + this.size) % this.maxSize

        /**
         * @type {*}
         */
        const aValue = this._sCollection[idxNr]

        this._sCollection[idxNr] = null

        return aValue
    }

    /**
     * Return the first item within the Circular Buffer.
     *
     * `O(1)`
     *
     * @return {*} Return `undefined` when the `#.size` is equal to zero.
     *
     * @example
     *
     * const circularBuffer = new CircularBuffer()
     * circularBuffer.push('Hello Jane Doe!')
     *
     * circularBuffer.shift()
     * >>> Hello Jane Doe!
     */
    shift() {
        if (this.size === 0) return undefined

        /**
         * @type {*}
         */
        const aValue = this._sCollection[this._headOffset]

        this._sCollection[this._headOffset] = null

        /**
         * We've shifted the first item within the Buffer. Move the `#._headOffset`
         * to the next item.
         *
         * @type {Number}
         */
        this._headOffset = (this._headOffset + 1) % this.maxSize

        /**
         * @type {Number}
         */
        this.size--

        return aValue
    }

    /**
     * Take a look at the first item within the Circular Buffer.
     *
     * `O(1)`
     *
     * @return {*} Return the first item within the Circular Buffer without
     *             removing the item or `undefined` if the Buffer is empty.
     *
     * @example
     *
     * const circularBuffer = new CircularBuffer()
     * circularBuffer.push('Hello Jane Doe!')
     *
     * circularBuffer.peek()
     * >>> Hello Jane Doe!
     *
     * @alias peekFront
     */
    peek() {
        if (this.size === 0) return undefined

        return this._sCollection[this._headOffset]
    }

    /**
     * Take a peek at the last value within the Circular Buffer.
     *
     * `O(1)`
     *
     * @return {*} Will return `undefined` if the Buffer is empty or
     *             the last item within the Circular Buffer.
     *
     * @example
     *
     * const circularBuffer = new CircularBuffer()
     * circularBuffer.push('Hello A.')
     * circularBuffer.push('Hello B.')
     *
     * circularBuffer.peekBack()
     * >>> Hello B.
     *
     * @example
     *
     * <caption>
     * The `#.peekBack` method will become an alias for the `#.peek` method if only
     * 1 item is present within the Circular Buffer.
     * </caption>
     *
     * const circularBuffer = new CircularBuffer()
     * circularBuffer.push('Hello A.')
     *
     * circularBuffer.peekBack()
     * >>> Hello A.
     */
    peekBack() {
        if (this.size === 0) return undefined

        return this._sCollection[(this._headOffset + this.size - 1) % this.maxSize]
    }

    /**
     * @return {Array.<*>}
     *
     * @example
     *
     * const circularBuffer = new CircularBuffer()
     * circularBuffer.push('Hello Jane Doe!')
     * circularBuffer.push('Hello John Doe!')
     *
     * circularBuffer.toArray()
     * >>> [ "Hello Jane Doe!", "Hello John Doe!" ]
     */
    toArray() {
        /**
         * @type {Number}
         */
        const sliceEnd = this._headOffset + this.size

        /**
         * @type {Array.<*>}
         */
        const toArray = this._sCollection.slice(
            this._headOffset, Math.min(sliceEnd, this.maxSize)
        )

        if (sliceEnd < this.maxSize) return toArray

        return toArray.concat(
            this._sCollection.slice(
                0, Math.max(0, sliceEnd % this.maxSize)
            )
        )
    }

    /**
     * Create a Circular Buffer from an Iterable.
     *
     * @param {Iterable} iterateOver
     *
     * @return {CircularBuffer}
     *
     * @example
     *
     * const circularBuffer = CircularBuffer.from(["John Doe", "Jane Doe"])
     */
    static from(iterateOver) {
        const circularBuffer = new CircularBuffer(Infinity)

        for (const aValue of iterateOver) circularBuffer.push(aValue)

        /**
         * Replace `Infinity` with an actual value.
         *
         * @type {Number}
         */
        circularBuffer.maxSize = circularBuffer.size

        return circularBuffer
    }
}

module.exports = CircularBuffer