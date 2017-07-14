const should = require('chai').should()

const Heap = require('./../heap')

describe('Heap', () => {
    context('#.push', () => {
        it('Should be possible to add an item to the Heap.', () => {
            const aHeap = new Heap()

            aHeap.push('Estructura')
            aHeap.push('by Airliti')

            aHeap.size.should.equal(2)
        })
    })

    /**
     * @param {Heap} aHeap
     * @param {Array.<*>} verifyAgainst
     */
    const verifyPop = (aHeap, verifyAgainst) => {
        aHeap.size.should.equal(verifyAgainst.length)

        for (let idxNr = 0, maxNr = verifyAgainst.length; idxNr < maxNr; idxNr++) {
            aHeap.pop().should.equal(verifyAgainst[idxNr])
        }
    }

    context('#.pop', () => {
        it('Should return the correct value.', () => {
            const aHeap = Heap.MinHeap.from([36, 12, 10, 44])

            verifyPop(aHeap, [10, 12, 36, 44])
        })

        it('Should return "undefined" when the Heap is empty.', () => {
            const aHeap = new Heap.MinHeap

            should.not.exist(aHeap.pop())
        })

        it('Should return a correct value.', () => {
            const aHeap = new Heap.MinHeap

            for (let idxNr = 0; idxNr < 18620; idxNr++) aHeap.push(Math.floor(Math.random() * 18620))

            /**
             * Go through each item in the Heap. Check whether the value is lower than
             * or equal to the previous item.
             */
            let prevValue = aHeap.pop(), curValue

            while ((curValue = aHeap.pop()) !== undefined) {
                curValue.should.be.at.least(prevValue)

                prevValue = curValue
            }
        })
    })

    context('#.peek', () => {
        it('Should be possible to retrieve the item at the front of the Heap.', () => {
            const aHeap = new Heap.MinHeap

            aHeap.push(48)
            aHeap.push(22)

            aHeap.peek().should.equal(22)

            aHeap.push(16)

            aHeap.peek().should.equal(16)
        })

        it('Should return "undefined" when using the #.peek method on an empty Heap.', () => {
            const aHeap = new Heap.MinHeap

            should.not.exist(aHeap.peek())
        })
    })

    context('#.toArray', () => {
        it('Should be possible to turn a Heap into an Array.', () => {
            const itemCollection = Heap.MinHeap.from(['A', 'C', 'D', 'B']).toArray()

            itemCollection.shift().should.equal('A')
            itemCollection.shift().should.equal('B')
            itemCollection.shift().should.equal('C')
            itemCollection.shift().should.equal('D')
        })
    })

    context('#.from', () => {
        it('Should be possible to create an Heap from an Iterable as an Set.', () => {
            const aHeap = Heap.MinHeap.from(new Set(['D', 'B', 'A', 'C']))

            verifyPop(aHeap, ['A', 'B', 'C', 'D'])
        })

        it('Should be possible to create an Heap from an Iterable such as an Array.', () => {
            const aHeap = Heap.MaxHeap.from(['A', 'C', 'D', 'B'])

            verifyPop(aHeap, ['D', 'C', 'B', 'A'])
        })
    })

    it('The standard Heap is a MinHeap.', () => {
        const aHeap = Heap.from(['D', 'A', 'B', 'C'])

        verifyPop(aHeap, ['A', 'B', 'C', 'D'])
    })

    context('Heap.MinHeap', () => {
        it('The MinHeap should have a default Comparator when using the Constructor.', () => {
            const aHeap = new Heap.MinHeap()

            aHeap.push('A')
            aHeap.push('C')
            aHeap.push('D')
            aHeap.push('B')

            verifyPop(aHeap, ['A', 'B', 'C', 'D'])
        })

        it('The MinHeap should have a default Comparator implemented.', () => {
            const aHeap = Heap.MinHeap.from(['D', 'A', 'B', 'C'])

            verifyPop(aHeap, ['A', 'B', 'C', 'D'])
        })
    })

    context('Heap.MaxHeap', () => {
        it('The MaxHeap should have a default Comparator when using the Constructor.', () => {
            const aHeap = new Heap.MaxHeap()

            aHeap.push('A')
            aHeap.push('C')
            aHeap.push('D')
            aHeap.push('B')

            verifyPop(aHeap, ['D', 'C', 'B', 'A'])
        })

        it('The MaxHeap should have a default Comparator implemented.', () => {
            const aHeap = Heap.MaxHeap.from(['A', 'C', 'D', 'B'])

            verifyPop(aHeap, ['D', 'C', 'B', 'A'])
        })
    })
})