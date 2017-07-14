const should = require('chai').should()

const Heap = require('./../heap')
const StableHeap = require('./../stable-heap')

describe('StableHeap', () => {
    it('Should ensure a First In First Out mechanism between each item that is equal.', () => {
        /**
         * @type {Array.<{itemCount: Number, aValue: String}>}
         */
        const aCollection = [
            {aNr: 2, aValue: 'A'},
            {aNr: 4, aValue: 'B'},
            {aNr: 2, aValue: 'C'},
            {aNr: 2, aValue: 'D'}
        ]

        /**
         * @type {Function}
         */
        const useComparator = (itemA, itemB) => itemA.aNr === itemB.aNr ? 0 : itemA.aNr > itemB.aNr ? 1 : -1

        /**
         * @type {Heap}
         */
        const aHeap = Heap.from(aCollection, useComparator)

        let toArray = aHeap.toArray()

        toArray[0].aValue.should.equal('A')
        toArray[1].aValue.should.equal('D')
        toArray[2].aValue.should.equal('C')
        toArray[3].aValue.should.equal('B')

        /**
         * @type {Heap}
         */
        const stableHeap = StableHeap.from(aCollection, useComparator)

        toArray = stableHeap.toArray()

        toArray[0].aValue.should.equal('A')
        toArray[1].aValue.should.equal('C')
        toArray[2].aValue.should.equal('D')
        toArray[3].aValue.should.equal('B')
    })
})