class NilSaVj9xHc {

}

/**
 * @class {SingleLinkedList}
 */
class SingleLinkedList {
    /**
     * @constructor
     *
     * @example
     *
     * const SingleLinkedList = require('structural/single-linked-list')
     *
     * const singleLinkedList = new SingleLinkedList()
     */
    constructor() {
        this.pHead_ = {
            aValue: new NilSaVj9xHc(),

            rNode: null
        }

        this.size = 0
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
     * const singleLinkedList = new SingleLinkedList()
     *
     * singleLinkedList.unshift('Jane Doe')
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
     * const singleLinkedList = new SingleLinkedList()
     * singleLinkedList.unshift('Jane Doe')
     * singleLinkedList.unshift('John Doe')
     *
     * singleLinkedList.shift()
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
     * const singleLinkedList = new SingleLinkedList()
     * singleLinkedList.unshift('John Doe')
     * singleLinkedList.unshift('Jane Doe')
     *
     * singleLinkedList.peekFront()
     * >>> Jane Doe
     */
    peekFront() {
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
     * const singleLinkedList = new SingleLinkedList()
     * singleLinkedList.unshift('John Doe')
     * singleLinkedList.unshift('Jane Doe')
     *
     * singleLinkedList.toArray()
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
}

module.exports = SingleLinkedList