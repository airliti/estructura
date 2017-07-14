const should = require('chai').should()

const CircularBuffer = require('./../circular-buffer')

describe('Circular Buffer', () => {
    context('#.push', () => {
        it('Should append an item to the Circular Buffer.', () => {
            const circularBuffer = new CircularBuffer(4)

            circularBuffer.push('A')
            circularBuffer.push('B')
            circularBuffer.push('C')
            circularBuffer.push('D')

            circularBuffer.size.should.equal(4)
        })

        it('Should append an item to the Circular Buffer and overwrite the oldest value if the `#.maxSize` is surpassed.', () => {
            const circularBuffer = new CircularBuffer(2)

            circularBuffer.push('A')
            circularBuffer.push('B')

            circularBuffer.size.should.equal(2)

            circularBuffer.push('C')
            circularBuffer.push('D')

            circularBuffer.size.should.equal(2)

            circularBuffer.pop().should.equal('D')
            circularBuffer.pop().should.equal('C')
        })
    })

    context('#.pop', () => {
        it('Should return an item from the back of the Circular Buffer.', () => {
            const circularBuffer = new CircularBuffer(4)

            circularBuffer.push('A')

            circularBuffer.push('B')
            circularBuffer.push('C')
            circularBuffer.push('D')

            circularBuffer.pop().should.equal('D')
            circularBuffer.pop().should.equal('C')

            circularBuffer.size.should.equal(2)
        })

        it('Should return "undefined" when the Circular Buffer is empty.', () => {
            const circularBuffer = new CircularBuffer(4)

            should.not.exist(circularBuffer.pop())
        })
    })

    context('#.shift', () => {
        it('Should be possible to retrieve an item from the front of the Circular Buffer.', () => {
            const circularBuffer = new CircularBuffer(4)

            circularBuffer.push('A')
            circularBuffer.push('B')
            circularBuffer.push('C')
            circularBuffer.push('D')

            circularBuffer.shift().should.equal('A')
            circularBuffer.shift().should.equal('B')

            circularBuffer.size.should.equal(2)

            circularBuffer.push('E')
            circularBuffer.push('F')

            circularBuffer.size.should.equal(4)

            circularBuffer.shift().should.equal('C')
            circularBuffer.shift().should.equal('D')
            circularBuffer.shift().should.equal('E')
            circularBuffer.shift().should.equal('F')

            circularBuffer.size.should.equal(0)
        })

        it('Should return "undefined" when the Circular Buffer is empty.', () => {
            const circularBuffer = new CircularBuffer(4)

            should.not.exist(circularBuffer.shift())
        })
    })

    it('Should be able to manage #.pop, #.shift and #.push when used mixed.')

    context('#.peek', () => {
        it('Should return the item in front of the Circular Buffer.', () => {
            const circularBuffer = new CircularBuffer(4)

            circularBuffer.push('A')
            circularBuffer.push('B')
            circularBuffer.push('C')

            circularBuffer.shift()

            circularBuffer.peek().should.equal(circularBuffer.shift())
        })

        it('Should return "undefined" when using the #.peek method on an empty Circular Buffer.', () => {
            const circularBuffer = new CircularBuffer(4)

            should.not.exist(circularBuffer.peek())
        })
    })

    context('#.peekBack', () => {
        it('Should return the item at the back of the Circular Buffer.', () => {
            const circularBuffer = new CircularBuffer(4)

            circularBuffer.push('A')

            circularBuffer.peekBack().should.equal('A') // idxNr: 0

            circularBuffer.push('B')
            circularBuffer.push('C')
            circularBuffer.push('D')

            circularBuffer.peekBack().should.equal('D') // idxNr: 3

            circularBuffer.pop()
            circularBuffer.pop()

            circularBuffer.peekBack().should.equal('B') // idxNr: 1

            circularBuffer.push('C')
            circularBuffer.push('D')
            circularBuffer.push('E')
            circularBuffer.push('F')
            circularBuffer.push('G')

            circularBuffer.peekBack().should.equal('G') // idxNr: 2
        })

        it('Should become an alias for #.peek when only 1 item is present within the Circular Buffer.', () => {
            const circularBuffer = new CircularBuffer(4)

            circularBuffer.push('A')

            circularBuffer.peekBack().should.equal('A')
        })

        it('Should return "undefined" when the Circular Buffer is empty.', () => {
            const circularBuffer = new CircularBuffer(4)

            should.not.exist(circularBuffer.peekBack())
        })
    })

    context('#.toArray', () => {
        it('Should convert a Circular Buffer into an Array.', () => {
            const circularBuffer = new CircularBuffer(4)

            circularBuffer.push('A')
            circularBuffer.push('B')

            let toArray = circularBuffer.toArray()

            toArray[0].should.equal('A')
            toArray[1].should.equal('B')

            toArray.length.should.equal(2)

            /**
             * Ex. [ A, B, *, * ]
             *
             * --> [ E, B, C, D ] within the Circular Buffer is equal to [ B, C, D, E ]
             */
            circularBuffer.push('C')
            circularBuffer.push('D')
            circularBuffer.push('E')

            toArray = circularBuffer.toArray()

            toArray[0].should.equal('B')
            toArray[1].should.equal('C')
            toArray[2].should.equal('D')
            toArray[3].should.equal('E')

            toArray.length.should.equal(4)

            /**
             * Ex. [ E, B, C, D ] with B as `#._headOffset`
             *
             * --> [ E, *, *, D ] within the Circular Buffer is equal to [ D, E ]
             */
            circularBuffer.shift()
            circularBuffer.shift()

            toArray = circularBuffer.toArray()

            toArray[0].should.equal('D')
            toArray[1].should.equal('E')

            toArray.length.should.equal(2)
        })
    })

    context('#.from', () => {
        it('Should create a Circular Buffer from an Iterable.', () => {
            const circularBuffer = CircularBuffer.from(['A', 'B', 'C', 'D'])

            circularBuffer.size.should.equal(4)

            circularBuffer.shift().should.equal('A')
            circularBuffer.shift().should.equal('B')

            circularBuffer.pop().should.equal('D')
            circularBuffer.pop().should.equal('C')

            circularBuffer.size.should.equal(0)

            circularBuffer.maxSize.should.equal(4)
        })
    })
})