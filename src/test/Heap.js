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
     * @param {Number | undefined} heapSize
     */
    const verifyPop = (aHeap, verifyAgainst, heapSize = undefined) => {
        if (!heapSize) heapSize = verifyAgainst.length

        aHeap.size.should.equal(heapSize)

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

    context('#.peekFront', () => {
        it('Should be an alias of #.peek.', () => {
            const aHeap = new Heap()

            aHeap.peekFront.should.equal(aHeap.peek)
        })
    })

    context('#.toArray', () => {
        it('Should be possible to turn a Heap into an Array.', () => {
            const toArray = Heap.MinHeap.from(['A', 'C', 'D', 'B']).toArray()

            toArray.shift().should.equal('A')
            toArray.shift().should.equal('B')
            toArray.shift().should.equal('C')
            toArray.shift().should.equal('D')
        })
    })

    context('#.from', () => {
        it('Should be possible to create a Heap from an Iterable as an Set.', () => {
            const aHeap = Heap.MinHeap.from(new Set(['D', 'B', 'A', 'C']))

            verifyPop(aHeap, ['A', 'B', 'C', 'D'])
        })

        it('Should be possible to create a Heap from an Iterable such as an Array.', () => {
            const aHeap = Heap.MaxHeap.from(['A', 'C', 'D', 'B'])

            verifyPop(aHeap, ['D', 'C', 'B', 'A'])
        })
    })

    context('#.fromHeap', () => {
        it('Should be possible to create a Heap from another Heap.', () => {
            const aHeap = new Heap()

            aHeap.push(8)
            aHeap.push(4)
            aHeap.push(6)
            aHeap.push(2)

            verifyPop(aHeap, [2, 4], 4)

            const aHeapFromAnotherHeap = Heap.fromHeap(aHeap)

            aHeapFromAnotherHeap.size.should.equal(2)

            verifyPop(aHeapFromAnotherHeap, [6, 8])
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