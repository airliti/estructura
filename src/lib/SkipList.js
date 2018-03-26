const Comparator = require('./util/Comparator')

/**
 * @class {NilXj4AxRgY}
 */
class NilXj4AxRgY {

}

/**
 * @class {SkipList}
 */
class SkipList {
    /**
     * @constructor
     *
     * @param {Function} compareFn
     * @param {Number} maxHeight
     * @param {Number} promotingProbability
     *
     * @example
     *
     * const SkipList = require('estructura/skip-list')
     *
     * const skipList = new SkipList( 16, .5 )
     */
    constructor(compareFn = Comparator.compareFnAscending, maxHeight = 32, promotingProbability = .5) {
        this.pHead_ = {
            aValue: new NilXj4AxRgY,

            rNode: null,
            dwnArr: []
        }

        this.compareFn_ = compareFn

        this.curHeight_ = 0
        this.maxHeight_ = maxHeight

        this.promotingProbability_ = promotingProbability

        this.size = 0

        this.peekFront = this.peek
    }

    /**
     * @private
     *
     * @return {Number}
     */
    getHeight_() {
        let lvlNr = 0

        while (Math.random() < this.promotingProbability_) lvlNr++

        return Math.min(Math.min(lvlNr, this.curHeight_ + 1), this.maxHeight_)
    }

    /**
     * Insert a new value within the Skip List.
     *
     * @param {*} aValue
     *
     * @return {Number}
     *
     * @example
     *
     * const skipList = new SkipList()
     *
     * skipList.insert('Jane Doe')
     * >>> 1
     */
    insert(aValue) {
        let curHght = this.curHeight_

        let prvNode = null
        let lftNode = this.pHead_

        const lMost = []

        const compareFn = this.compareFn_

        while (lftNode) {
            if (lftNode.aValue instanceof NilXj4AxRgY) {
                if (lftNode.rNode) {
                    prvNode = lftNode
                    lftNode = prvNode.rNode
                }
                else {
                    lMost.push(lftNode)

                    prvNode = null
                    lftNode = lftNode.dwnArr[--curHght]
                }
            }
            else if (compareFn(aValue, lftNode.aValue) > 0) {
                prvNode = lftNode
                lftNode = prvNode.rNode

                if (!lftNode) {
                    lMost.push(prvNode)

                    lftNode = prvNode.dwnArr[--curHght]
                    prvNode = null
                }
            }
            else {
                lMost.push(prvNode)

                lftNode = prvNode.dwnArr[--curHght]
                prvNode = null
            }
        }

        let insertAt = this.getHeight_()

        lMost.reverse()

        if (insertAt > this.curHeight_) {
            this.pHead_ = {
                aValue: this.pHead_.aValue,

                rNode: null,
                dwnArr: this.pHead_.dwnArr.slice().concat([this.pHead_])
            }

            this.curHeight_ = insertAt

            lMost.push(this.pHead_)
        }

        const dwnArr = []

        for (let lvlNr = 0, maxNr = insertAt; lvlNr <= maxNr; lvlNr++) {
            const lNode = lMost[lvlNr], rNode = {
                aValue: aValue,

                rNode: lNode.rNode,
                dwnArr: dwnArr.slice()
            }

            lNode.rNode = rNode

            dwnArr.push(rNode)
        }

        return ++this.size
    }

    /**
     * Search a value within the Skip List.
     *
     * Average O(log n), Worst Case O(n)
     *
     * @param {*} aValue
     *
     * @example
     *
     * const skipList = new SkipList()
     * skipList.insert('John Doe')
     * skipList.insert('Jane Doe')
     *
     * skipList.search('Jane Doe')
     * >>> Jane Doe
     */
    search(aValue) {
        let prvNode = null
        let lftNode = this.pHead_

        let curHght = this.curHeight_

        let searchValue = undefined

        while (lftNode && !searchValue) {
            if (lftNode.aValue instanceof NilXj4AxRgY) {
                if (lftNode.rNode) {
                    prvNode = lftNode
                    lftNode = prvNode.rNode
                }
                else {
                    prvNode = null
                    lftNode = lftNode.dwnArr[--curHght]
                }

                continue
            }

            const compareOu = this.compareFn_(aValue, lftNode.aValue)

            if (compareOu === 0) {
                searchValue = lftNode.aValue
            }
            else if (compareOu > 0) {
                prvNode = lftNode
                lftNode = prvNode.rNode

                if (!lftNode) {
                    lftNode = prvNode.dwnArr[--curHght]
                    prvNode = null
                }
            }
            else {
                lftNode = prvNode.dwnArr[--curHght]
                prvNode = null
            }
        }

        return searchValue
    }

    /**
     * Remove a value from the Skip List.
     *
     * Average O(log n), Worst Case O(n)
     *
     * @param {*} aValue
     *
     * @return {Boolean}
     *
     * @example
     *
     * const skipList = new SkipList()
     * skipList.insert('Jane Doe')
     * skipList.insert('John Doe')
     *
     * skipList.delete('John Doe')
     * >>> true
     *
     * @example
     *
     * const skipList = new SkipList()
     * skipList.insert('John Doe')
     *
     * skipList.delete('Jane Doe')
     * >>> false
     */
    delete(aValue) {
        let prvNode = null
        let lftNode = this.pHead_

        let curHght = this.curHeight_

        let valueDeleted = false

        while (lftNode && valueDeleted === false) {
            if (lftNode.aValue instanceof NilXj4AxRgY) {
                if (lftNode.rNode) {
                    prvNode = lftNode
                    lftNode = prvNode.rNode
                }
                else {
                    prvNode = null
                    lftNode = lftNode.dwnArr[--curHght]
                }

                continue
            }

            const compareOu = this.compareFn_(aValue, lftNode.aValue)

            if (compareOu > 0) {
                prvNode = lftNode
                lftNode = prvNode.rNode

                if (!lftNode) {
                    lftNode = prvNode.dwnArr[--curHght]
                    prvNode = null
                }
            }
            else {
                if (compareOu === 0) {
                    prvNode.rNode = lftNode.rNode
                    lftNode.rNode = null

                    if (curHght < 1) valueDeleted = true, this.size--
                }

                lftNode = prvNode.dwnArr[--curHght]
                prvNode = null
            }
        }

        return valueDeleted

        /**
         * (!) Performance vs. Memory
         *
         * If we keep a lNode for each value, then it should be possible to lftNode.dwnArr instead of iterating through
         * each level.
         *
         */
    }

    /**
     * Take a look at the first value within the Skip List.
     *
     * `O(1)`
     *
     * @return {*}
     *
     * @example
     *
     * const skipList = new SkipList()
     * skipList.insert('D')
     * skipList.insert('A')
     * skipList.insert('C')
     * skipList.insert('B')
     *
     * skipList.peek()
     * >>> A
     */
    peek() {
        const fstNode = (this.pHead_.dwnArr.length > 0 ? this.pHead_.dwnArr[0] : this.pHead_).rNode

        return fstNode ? fstNode.aValue : undefined
    }

    /**
     * Convert the Skip List to an array.
     *
     * `O(n)`
     *
     * @return {Array.<*>}
     *
     * @example
     *
     * const skipList = new SkipList()
     * skipList.insert('A')
     * skipList.insert('C')
     * skipList.insert('D')
     * skipList.insert('B')
     *
     * skipList.toArray()
     * >>> [ "A", "B", "C", "D" ]
     */
    toArray() {
        const toArray = []

        let lNode = (this.pHead_.dwnArr.length > 0 ? this.pHead_.dwnArr[0] : this.pHead_).rNode

        while (lNode) {
            toArray.push(lNode.aValue)

            lNode = lNode.rNode
        }

        return toArray
    }

    /**
     * Create a Skip List from an Iterable.
     *
     * @param {Iterable} iterateOver
     * @param {Function} compareFn
     *
     * @return {SkipList}
     *
     * @example
     *
     * const skipList = SkipList.from(['A', 'C', 'D', 'B'])
     */
    static from(iterateOver, compareFn = Comparator.compareFnAscending) {
        const skipList = new SkipList(compareFn)

        for (const aValue of iterateOver) skipList.insert(aValue)

        return skipList
    }

    /*for (let lvlNr = 0, maxNr = this.curHeight_; lvlNr < maxNr; lvlNr++) {
        let rNode = (this.pHead_.dwnArr[lvlNr] || this.pHead_).rNode, arrLength = 0

        while (rNode) {
            arrLength++

            rNode = rNode.rNode
        }

        console.log('#.toArray', '\n', 'At', lvlNr, 'with', arrLength, 'item(s).')
    }*/
}

module.exports = SkipList