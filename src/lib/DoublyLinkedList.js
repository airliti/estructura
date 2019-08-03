class NilPnQgTl5o {}

/**
 * Doubly Linked List.
 *
 * @class {DoublyLinkedList}
 */
class DoublyLinkedList {
    /**
     * @constructor
     *
     * @example
     *
     * const DoublyLinkedList = require('estructura/doubly-linked-list')
     *
     * const doublyLinkedList = new DoublyLinkedList()
     */
    constructor() {
        this.pHead_ = {
            aValue: new NilPnQgTl5o(),

            lNode: null,
            rNode: null
        }
        this.pTail_ = {
            aValue: new NilPnQgTl5o(),

            lNode: null,
            rNode: null
        }

        this.pHead_.rNode = this.pTail_
        this.pTail_.lNode = this.pHead_

        this.size = 0

        /**
         * @see #.peek
         *
         * @type {Function}
         */
        this.peekFront = this.peek
    }

    /**
     * Append an item to the Doubly Linked List.
     *
     * `O(1)`
     *
     * @param {*} aValue
     *
     * @return {Number} The new size of the Doubly Linked List.
     *
     * @example
     *
     * const doublyLinkedList = new DoublyLinkedList()
     *
     * doublyLinkedList.push('John Doe')
     * >>> 1
     */
    push(aValue) {
        const aNode = {
            aValue: aValue,

            lNode: this.pTail_.lNode,
            rNode: this.pTail_
        }

        this.pTail_.lNode.rNode = aNode
        this.pTail_.lNode = aNode

        return ++this.size
    }

    /**
     * Prepend an item to the Doubly Linked List.
     *
     * `O(1)`
     *
     * @param {*} aValue
     *
     * @return {Number} The new size of the Doubly Linked List.
     *
     * @example
     *
     * const doublyLinkedList = new DoublyLinkedList()
     *
     * doublyLinkedList.unshift('Jane Doe')
     * >>> 1
     */
    unshift(aValue) {
        const aNode = {
            aValue: aValue,

            lNode: this.pHead_,
            rNode: this.pHead_.rNode
        }

        this.pHead_.rNode.lNode = aNode
        this.pHead_.rNode = aNode

        return ++this.size
    }

    /**
     * Return and remove the last item within the Doubly Linked List.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const doublyLinkedList = new DoublyLinkedList()
     * doublyLinkedList.push('John Doe')
     * doublyLinkedList.push('Jane Doe')
     *
     * doublyLinkedList.pop()
     * >>> Jane Doe
     */
    pop() {
        if (this.pTail_.lNode.aValue === this.pHead_.aValue) return undefined

        const aNode = this.pTail_.lNode

        this.pTail_.lNode.lNode.rNode = this.pTail_
        this.pTail_.lNode = this.pTail_.lNode.lNode

        aNode.lNode = null
        aNode.rNode = null

        this.size--

        return aNode.aValue
    }

    /**
     * Return and remove the first item within the Doubly Linked List.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const doublyLinkedList = new DoublyLinkedList()
     * doublyLinkedList.push('John Doe')
     * doublyLinkedList.push('Jane Doe')
     *
     * doublyLinkedList.shift()
     * >>> John Doe
     */
    shift() {
        if (this.pHead_.rNode.aValue === this.pTail_.aValue) return undefined

        const aNode = this.pHead_.rNode

        this.pHead_.rNode.rNode.lNode = this.pHead_
        this.pHead_.rNode = this.pHead_.rNode.rNode

        aNode.lNode = null
        aNode.rNode = null

        this.size--

        return aNode.aValue
    }

    /**
     * Take a look at the first item within the Doubly Linked List.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const doublyLinkedList = new DoublyLinkedList()
     * doublyLinkedList.push('John Doe')
     * doublyLinkedList.push('Jane Doe')
     *
     * doublyLinkedList.peek()
     * >>> John Doe
     *
     * @alias peekFront
     */
    peek() {
        return this.pHead_.rNode.aValue !== this.pTail_.aValue ? this.pHead_.rNode.aValue : undefined
    }

    /**
     * Take a peek at the last item within the Doubly Linked List.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const doublyLinkedList = new DoublyLinkedList()
     * doublyLinkedList.push('John Doe')
     * doublyLinkedList.push('Jane Doe')
     *
     * doublyLinkedList.peekBack()
     * >>> Jane Doe
     *
     * @example
     *
     * <caption>
     * The `#.peekBack` method becomes an alias for the `#.peek` method when only 1
     * item is present within the Doubly Linked List.
     * </caption>
     *
     * const doublyLinkedList = new DoublyLinkedList()
     * doublyLinkedList.push('John Doe')
     *
     * doublyLinkedList.peekBack()
     * >>> John Doe
     */
    peekBack() {
        return this.pTail_.lNode.aValue !== this.pHead_.aValue ? this.pTail_.lNode.aValue : this.peekFront()
    }

    /**
     * Convert the Doubly Linked List to an Array.
     *
     * @return {Array.<*>}
     *
     * @example
     *
     * const doublyLinkedList = new DoublyLinkedList()
     * doublyLinkedList.push('John Doe')
     * doublyLinkedList.push('Jane Doe')
     *
     * doublyLinkedList.toArray()
     * >>> [ "John Doe", "Jane Doe" ]
     */
    toArray() {
        const inArray = []

        let aNode = this.pHead_.rNode

        while (aNode.aValue !== this.pTail_.aValue) {
            inArray.push(aNode.aValue)

            aNode = aNode.rNode
        }

        return inArray
    }

    /**
     * Create a Doubly Linked List from an Iterable.
     *
     * @param {Iterable} iterateOver
     *
     * @return {DoublyLinkedList}
     *
     * @example
     *
     * const doublyLinkedList = DoublyLinkedList.from(['John Doe', 'Jane Doe'])
     */
    static from(iterateOver) {
        const doublyLinkedList = new DoublyLinkedList()

        for (const aValue of iterateOver) doublyLinkedList.push(aValue)

        return doublyLinkedList
    }
}

module.exports = DoublyLinkedList