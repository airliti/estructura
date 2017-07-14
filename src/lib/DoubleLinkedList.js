/**
 * @class {DoubleLinkedList}
 */
class DoubleLinkedList {
    /**
     * @constructor
     *
     * @example
     *
     * const DoubleLinkedList = require('estructura/double-linked-list')
     *
     * //
     * // Create a new instance of a Double Linked List:
     * const doubleLinkedList = new DoubleLinkedList()
     */
    constructor() {
        /**
         * @private
         *
         * @type {{aValue: *, lNode: *, rNode: *}}
         */
        this._headNode = null

        /**
         * @private
         *
         * @type {{aValue: *, lNode: *, rNode: *}}
         */
        this._tailNode = null

        /**
         * The total size of the Double Linked List.
         *
         * @type {Number}
         */
        this.size = 0
    }

    /**
     * Append an item to the Double Linked List.
     *
     * `O(1)`
     *
     * @param {*} aValue
     *
     * @return {Number} The new size of the Double Linked List.
     *
     * @example
     *
     * const doubleLinkedList = new DoubleLinkedList()
     *
     * doubleLinkedList.push('John Doe')
     * >>> 1
     */
    push(aValue) {
        if (!this._headNode) {
            //
            //  The first insertion of a new value within the Linked List.
            //  
            //  @type {{aValue: , lNode: null, rNode: }}
            //
            this._headNode = {
                aValue: aValue, lNode: null, rNode: null
            }
        }
        else if (!this._tailNode) {
            //
            // The second insertion of a new value within the Linked List.
            //  
            // @type {{aValue: *, lNode: *, rNode: *}}
            //
            this._tailNode = {
                aValue: aValue, lNode: this._headNode, rNode: null
            }

            this._headNode.rNode = this._tailNode
        }
        else {
            //
            // Append "aValue" to the end of the Double Linked List.
            //  
            // @type {{aValue: *, lNode: *, rNode: *}}
            //
            this._tailNode.rNode = {
                aValue: aValue, lNode: this._tailNode, rNode: null
            }

            this._tailNode = this._tailNode.rNode
        }

        return ++this.size
    }

    /**
     * Prepend an item to the Double Linked List.
     *
     * `O(1)`
     *
     * @param {*} aValue
     *
     * @return {Number} The new size of the Double Linked List.
     *
     * @example
     *
     * const doubleLinkedList = new DoubleLinkedList()
     *
     * doubleLinkedList.unshift('Jane Doe')
     * >>> 1
     */
    unshift(aValue) {
        if (!this._headNode) {
            //
            // Because there is nothing in the List, use the new value as Head
            // for the List.
            // 
            // @type {{aValue: *, lNode: *, rNode: *}}
            //
            this._headNode = {
                aValue: aValue, lNode: null, rNode: null
            }
        }
        else {
            //
            // Prepend "aValue" to the Collection. Replace the current Head with
            // a new one.
            //
            // @type {{aValue: *, lNode: *, rNode: *}}
            //
            this._headNode.lNode = {
                aValue: aValue, lNode: null, rNode: this._headNode
            }

            this._headNode = this._headNode.lNode

            //
            // There is no Tail, yet there are now 2 items within the Linked List,
            // use the old Head as the new Tail.
            //
            if (!this._tailNode) this._tailNode = this._headNode.rNode
        }

        return ++this.size
    }

    /**
     * Return and remove the last item within the Double Linked List.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const doubleLinkedList = new DoubleLinkedList()
     * doubleLinkedList.push('John Doe')
     * doubleLinkedList.push('Jane Doe')
     *
     * doubleLinkedList.pop()
     * >>> Jane Doe
     */
    pop() {
        if (this._tailNode) {
            this.size--

            //
            // Copy the current value of the Tail.
            //
            // @type {*}
            //
            const aValue = this._tailNode.aValue

            if (this.size > 1) {
                //
                // There are enough item(s) within the Linked List, set the Tail
                // to the Left Child of the Tail.
                //
                // @type {{aValue: *, lNode: null, rNode: *}}
                //
                this._tailNode = this._tailNode.lNode
                this._tailNode.rNode = null
            }
            else {
                //
                // We are back at the beginning of the Linked List. Use the Tail
                // as the new Head.
                //
                // @type {{aValue: *, lNode: null, rNode: *}}
                //
                this._headNode = this._tailNode.lNode
                this._headNode.rNode = null

                //
                // As we've just replaced the Head with the Tail, we'll need to
                // unset the Tail.
                //
                // @type {null}
                //
                this._tailNode = null
            }

            return aValue
        }
        else if (this._headNode) {
            this.size--

            //
            // Copy the value of the Head to return later on.
            //
            // @type {*}
            //
            const aValue = this._headNode.aValue

            //
            // There is nothing left within the Linked List. Set the Head Node
            // to "null" and return "aValue";
            //
            // @type {null}
            //
            this._headNode = null

            return aValue
        }

        return undefined
    }

    /**
     * Return and remove the first item within the Double Linked List.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const doubleLinkedList = new DoubleLinkedList()
     * doubleLinkedList.push('John Doe')
     * doubleLinkedList.push('Jane Doe')
     *
     * doubleLinkedList.shift()
     * >>> John Doe
     */
    shift() {
        if (this._headNode) {
            this.size--

            //
            // Temporarily copy the value of the Head Node, we'll return it
            // later on.
            //
            // @type {*}
            //
            const aValue = this._headNode.aValue

            if (this.size > 1) {
                //
                // There are enough item(s) left within the Collection. Replace
                // the Head with the right Child.
                //
                // @type {{aValue: *, lNode: *, rNode: *}}
                //
                this._headNode = this._headNode.rNode
            }
            else {
                //
                // We're back at the beginning of the Linked List.
                //
                // @type {{aValue: *, lNode: null, rNode: *} | null}
                //
                this._headNode = this._tailNode

                this._tailNode = null
            }

            //
            // We've just replaced the Head Node with either the right Child of
            // the Linked List or the Tail. As the Node is the new Head, it cannot
            // have a left Child. Delete the Reference.
            //
            if (this._headNode) this._headNode.lNode = null

            return aValue
        }

        return undefined
    }

    /**
     * Take a look at the first item within the Double Linked List.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const doubleLinkedList = new DoubleLinkedList()
     * doubleLinkedList.push('John Doe')
     * doubleLinkedList.push('Jane Doe')
     *
     * doubleLinkedList.peek()
     * >>> John Doe
     */
    peek() {
        return this._headNode ? this._headNode.aValue : undefined
    }

    /**
     * Take a peek at the last item within the Double Linked List.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const doubleLinkedList = new DoubleLinkedList()
     * doubleLinkedList.push('John Doe')
     * doubleLinkedList.push('Jane Doe')
     *
     * doubleLinkedList.peekBack()
     * >>> Jane Doe
     *
     * @example
     *
     * <caption>
     * The `#.peekBack` method becomes an alias for the `#.peek` method when only 1
     * item is present within the Double Linked List.
     * </caption>
     *
     * const doubleLinkedList = new DoubleLinkedList()
     * doubleLinkedList.push('John Doe')
     *
     * doubleLinkedList.peekBack()
     * >>> John Doe
     */
    peekBack() {
        return this._tailNode ? this._tailNode.aValue : this._headNode ? this._headNode.aValue : undefined
    }

    /**
     * Convert the Double Linked List to an Array.
     *
     * @return {Array.<*>}
     *
     * @example
     *
     * const doubleLinkedList = new DoubleLinkedList()
     * doubleLinkedList.push('John Doe')
     * doubleLinkedList.push('Jane Doe')
     *
     * doubleLinkedList.toArray()
     * >>> [ "John Doe", "Jane Doe" ]
     */
    toArray() {
        //
        // @type {Array}
        //
        const itemCollection = []

        //
        // Go through each Node and append the value to the #._itemCollection.
        //
        // @type {{aValue: *, lNode: null, rNode: *} | null}
        //
        let appendNode = this._headNode

        while (appendNode) {
            itemCollection.push(appendNode.aValue)

            appendNode = appendNode.rNode
        }

        return itemCollection
    }

    /**
     * Create a Double Linked List from any given Iterable.
     *
     * @param {Iterable} iterateOver
     *
     * @return {DoubleLinkedList}
     *
     * @example
     *
     * const doubleLinkedList = DoubleLinkedList.from(['John Doe', 'Jane Doe'])
     */
    static from(iterateOver) {
        const doubleLinkedList = new DoubleLinkedList()

        for (const pushItem of iterateOver) doubleLinkedList.push(pushItem)

        return doubleLinkedList
    }
}

module.exports = DoubleLinkedList