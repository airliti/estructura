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

        this.circularBuffer_ = []

        this.headOffset_ = 0

        this.size = 0
        this.maxSize = maxSize

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
            this.circularBuffer_[this.headOffset_] = aValue

            this.headOffset_ = (this.headOffset_ + 1) % this.maxSize
        }
        else {
            this.circularBuffer_[(this.headOffset_ + this.size) % this.maxSize] = aValue

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

        this.size--

        const idxNr = (this.headOffset_ + this.size) % this.maxSize, aValue = this.circularBuffer_[idxNr]

        this.circularBuffer_[idxNr] = null

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

        const aValue = this.circularBuffer_[this.headOffset_]

        this.circularBuffer_[this.headOffset_] = null

        this.headOffset_ = (this.headOffset_ + 1) % this.maxSize

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

        return this.circularBuffer_[this.headOffset_]
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

        return this.circularBuffer_[(this.headOffset_ + this.size - 1) % this.maxSize]
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
        const ePos = this.headOffset_ + this.size

        const toArray = this.circularBuffer_.slice(
            this.headOffset_, Math.min(ePos, this.maxSize)
        )

        if (ePos < this.maxSize) return toArray

        return toArray.concat(
            this.circularBuffer_.slice(
                0, Math.max(0, ePos % this.maxSize)
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

        circularBuffer.maxSize = circularBuffer.size

        return circularBuffer
    }
}

module.exports = CircularBuffer