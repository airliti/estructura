/**
 * @class {Deque}
 */
class Deque {
    /**
     * @constructor
     *
     * @example
     *
     * const Deque = require('structural/deque')
     *
     * const aDeque = new Deque()
     */
    constructor() {
        this.pushCollection_ = []
        this.shftCollection_ = []

        this.pushOffset_ = 0
        this.shftOffset_ = 0

        this.size = 0

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
        this.pushCollection_.push(aValue)

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
        this.shftCollection_.push(aValue)

        return ++this.size
    }

    /**
     * Return the last item within the Deque.
     *
     * Maximum of `O(n)` due to the internal structure used to store the Double-Ended
     * Queue and the built-in `#.splice` Function within JavaScript.
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
        if (this.pushOffset_ < this.pushCollection_.length) {
            this.size--

            return this.pushCollection_.pop()
        }

        if (this.shftOffset_ < this.shftCollection_.length) {
            this.size--

            const aValue = this.shftCollection_[this.shftOffset_]

            this.shftCollection_[this.shftOffset_] = null

            if (++this.shftOffset_ << 1 >= this.shftCollection_.length) {
                this.shftCollection_.splice(0, this.shftOffset_)

                this.shftOffset_ = 0
            }

            return aValue
        }

        return undefined
    }

    /**
     * Return the first item within the Double-Ended Queue.
     *
     * Maximum of `O(n)` due to the resizing of the Deque when necessary due to
     * the internal structure. Is dependent on the `#.splice` Function within
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
        if (this.shftOffset_ < this.shftCollection_.length) {
            this.size--

            return this.shftCollection_.pop()
        }

        if (this.pushOffset_ < this.pushCollection_.length) {
            this.size--

            const aValue = this.pushCollection_[this.pushOffset_]

            this.pushCollection_[this.pushOffset_] = null

            if (++this.pushOffset_ << 1 >= this.pushCollection_.length) {
                this.pushCollection_.splice(0, this.pushOffset_)

                this.pushOffset_ = 0
            }

            return aValue
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
     */
    peek() {
        if (this.shftCollection_.length > this.shftOffset_) return this.shftCollection_[this.shftCollection_.length - 1]
        if (this.pushCollection_.length > this.pushOffset_) return this.pushCollection_[this.pushOffset_]

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
        if (this.pushCollection_.length > this.pushOffset_) return this.pushCollection_[this.pushCollection_.length - 1]
        if (this.shftCollection_.length > this.shftOffset_) return this.shftCollection_[this.shftOffset_]

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
        const toArray = []

        for (let idxNr = this.shftCollection_.length - 1, minNr = this.shftOffset_ - 1; idxNr > minNr; idxNr--) toArray.push(this.shftCollection_[idxNr])
        for (let idxNr = this.pushOffset_ - 0, maxNr = this.pushCollection_.length - 0; idxNr < maxNr; idxNr++) toArray.push(this.pushCollection_[idxNr])

        return toArray
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