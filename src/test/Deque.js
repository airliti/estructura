const should = require('chai').should()

const Deque = require('./../deque')

describe('Deque', () => {
    context('#.push', () => {
        it('Should append an item to the Deque.', () => {
            const aDeque = new Deque()

            aDeque.push('A')
            aDeque.push('B')
            aDeque.push('C')
            aDeque.push('D')

            aDeque.size.should.equal(4)
        })
    })

    context('#.unshift', () => {
        it('Should be possible to prepend an item.', () => {
            const aDeque = new Deque()

            aDeque.unshift('A')
            aDeque.unshift('B')
            aDeque.unshift('C')
            aDeque.unshift('D')

            aDeque.pop().should.equal('A')
            aDeque.pop().should.equal('B')

            aDeque.size.should.equal(2)
        })
    })

    context('#.pop', () => {
        it('Should return an item from the back of the Deque.', () => {
            const aDeque = new Deque()

            aDeque.push('A')
            aDeque.push('B')
            aDeque.push('C')
            aDeque.push('D')

            aDeque.pop().should.equal('D')
            aDeque.pop().should.equal('C')

            aDeque.size.should.equal(2)
        })

        it('Should return "undefined" when the Deque is empty.', () => {
            const aDeque = new Deque()

            should.not.exist(aDeque.pop())
        })
    })

    context('#.shift', () => {
        it('Should be possible to retrieve an item from the front of the Deque.', () => {
            const aDeque = new Deque()

            aDeque.push('C')
            aDeque.push('D')

            aDeque.unshift('B')
            aDeque.unshift('A')

            aDeque.shift().should.equal('A')
            aDeque.shift().should.equal('B')
        })

        it('Should return "undefined" when the Deque is empty.', () => {
            const aDeque = new Deque()

            should.not.exist(aDeque.shift())
        })
    })

    it('Should be able to manage #.pop, #.shift, #.unshift and #.push when used mixed.', () => {
        const aDeque = new Deque()

        aDeque.push('A')
        aDeque.push('B')

        aDeque.unshift('C')
        aDeque.unshift('D')

        aDeque.push('E')
        aDeque.push('F')

        aDeque.shift().should.equal('D')
        aDeque.shift().should.equal('C')

        aDeque.pop().should.equal('F')
        aDeque.pop().should.equal('E')

        aDeque.shift().should.equal('A')
        aDeque.shift().should.equal('B')

        aDeque.size.should.equal(0)
    })

    context('#.peek', () => {
        it('Should return the item in front of the Deque.', () => {
            const aDeque = new Deque()

            aDeque.push('A')
            aDeque.push('B')
            aDeque.push('C')

            aDeque.shift()

            aDeque.peek().should.equal(aDeque.shift())

            const sDeque = new Deque()

            sDeque.unshift('A')
            sDeque.unshift('B')
            sDeque.unshift('C')

            sDeque.peek().should.equal(sDeque.shift())
        })

        it('Should return "undefined" when using the #.peek method on an empty Deque.', () => {
            const aDeque = new Deque()

            should.not.exist(aDeque.peek())
        })
    })

    context('#.peekFront', () => {
        it('Should be an alias of #.peek.', () => {
            const aDeque = new Deque()

            aDeque.peekFront.should.equal(aDeque.peek)
        })
    })

    context('#.peekBack', () => {
        it('Should return the item at the back of the Deque.', () => {
            const aDeque = new Deque()

            aDeque.push('A')
            aDeque.push('B')
            aDeque.push('C')

            aDeque.pop()

            aDeque.peekBack().should.equal('B')

            const sDeque = new Deque()

            sDeque.unshift('C')
            sDeque.unshift('B')
            sDeque.unshift('A')

            sDeque.shift()

            sDeque.peekBack().should.equal('C')
        })

        it('Should become an alias for #.peek when only 1 item is present within the Double-Ended Queue.', () => {
            const aDeque = new Deque()

            aDeque.push('A')

            aDeque.peekBack().should.equal('A')
        })

        it('Should return the item at the back of the Deque, with keeping in mind the #.unshift method has been used.', () => {
            const aDeque = new Deque()

            aDeque.unshift('A')
            aDeque.unshift('B')

            aDeque.peekBack().should.equal('A')
        })

        it('Should return "undefined" when the Deque is empty.', () => {
            const aDeque = new Deque()

            should.not.exist(aDeque.peekBack())
        })
    })

    context('#.toArray', () => {
        it('Should convert a Double-Ended Queue into an Array.', () => {
            const aDeque = new Deque()

            aDeque.unshift('A')
            aDeque.unshift('B')
            aDeque.unshift('C')

            aDeque.pop()

            aDeque.push('D')
            aDeque.push('E')
            aDeque.push('F')

            /**
             * @type {Array.<*>}
             */
            let toArray = aDeque.toArray()

            toArray[0].should.equal('C')
            toArray[1].should.equal('B')
            toArray[2].should.equal('D')
            toArray[3].should.equal('E')
            toArray[4].should.equal('F')

            aDeque.shift()
            aDeque.shift()
            aDeque.shift()

            /**
             * @type {Array.<*>}
             */
            toArray = aDeque.toArray()

            toArray[0].should.equal('E')
            toArray[1].should.equal('F')
        })
    })

    context('#.from', () => {
        it('Should create a Deque from an Iterable.', () => {
            const aDeque = Deque.from(['A', 'B', 'C', 'D'])

            aDeque.size.should.equal(4)

            aDeque.shift().should.equal('A')
            aDeque.shift().should.equal('B')

            aDeque.pop().should.equal('D')
            aDeque.pop().should.equal('C')

            aDeque.size.should.equal(0)
        })
    })
})