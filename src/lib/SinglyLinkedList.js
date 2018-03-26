class NilSaVj9xHc {

}

/**
 * @class {SinglyLinkedList}
 */
class SinglyLinkedList {
    /**
     * @constructor
     *
     * @example
     *
     * const SinglyLinkedList = require('estructura/single-linked-list')
     *
     * const singlyLinkedList = new SinglyLinkedList()
     */
    constructor() {
        this.pHead_ = {
            aValue: new NilSaVj9xHc(),

            rNode: null
        }

        this.size = 0

        this.peekFront = this.peek
    }

    /**
     * Prepend an item to the Single Linked List.
     *
     * `O(1)`
     *
     * @param {*} aValue
     *
     * @return {Number}
     *
     * @example
     *
     * const singlyLinkedList = new SinglyLinkedList()
     *
     * singlyLinkedList.unshift('Jane Doe')
     * >>> 1
     */
    unshift(aValue) {
        this.pHead_ = {
            aValue: aValue,

            rNode: this.pHead_
        }

        return ++this.size
    }

    /**
     * Remove and return the first item within the Single Linked List.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const singlyLinkedList = new SinglyLinkedList()
     * singlyLinkedList.unshift('Jane Doe')
     * singlyLinkedList.unshift('John Doe')
     *
     * singlyLinkedList.shift()
     * >>> John Doe
     */
    shift() {
        if (this.pHead_.aValue instanceof NilSaVj9xHc) return undefined

        const aNode = this.pHead_

        this.pHead_ = aNode.rNode
        aNode.rNode = null

        --this.size

        return aNode.aValue
    }

    /**
     * Take a look at the first item within the Single Linked List.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const singlyLinkedList = new SinglyLinkedList()
     * singlyLinkedList.unshift('John Doe')
     * singlyLinkedList.unshift('Jane Doe')
     *
     * singlyLinkedList.peek()
     * >>> Jane Doe
     *
     * @alias peekFront
     */
    peek() {
        if (this.pHead_.aValue instanceof NilSaVj9xHc) return undefined

        return this.pHead_.aValue
    }

    /**
     * Convert the Single Linked List to an Array.
     *
     * @return {Array.<*>}
     *
     * @example
     *
     * const singlyLinkedList = new SinglyLinkedList()
     * singlyLinkedList.unshift('John Doe')
     * singlyLinkedList.unshift('Jane Doe')
     *
     * singlyLinkedList.toArray()
     * >>> [ "Jane Doe", "John Doe" ]
     */
    toArray() {
        const inArray = []

        let aNode = this.pHead_

        while (!(aNode.aValue instanceof NilSaVj9xHc)) {
            inArray.push(aNode.aValue)

            aNode = aNode.rNode
        }

        return inArray
    }

    /**
     * Create a Single Linked List from an Iterable.
     *
     * @param {Iterable} iterateOver
     *
     * @return {SinglyLinkedList}
     *
     * @example
     *
     * const singlyLinkedList = SinglyLinkedList.from(['John Doe', 'Jane Doe'])
     */
    static from(iterateOver) {
        const singlyLinkedList = new SinglyLinkedList()

        let lNode = singlyLinkedList.pHead_

        for (const aValue of iterateOver) {
            const aNode = {
                aValue: aValue,

                rNode: null
            }

            lNode.rNode = aNode
            lNode = aNode

            singlyLinkedList.size++
        }

        if (singlyLinkedList.size > 0) singlyLinkedList.pHead_ = singlyLinkedList.pHead_.rNode

        return singlyLinkedList
    }
}

module.exports = SinglyLinkedList