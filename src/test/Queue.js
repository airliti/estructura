const should = require('chai').should()

const Queue = require('./../queue')

describe('Queue', () => {
    context('#.enqueue', () => {
        it('Should be possible to add an item to the back of the Queue.', () => {
            const aQueue = new Queue()

            aQueue.enqueue('A')
            aQueue.enqueue('B')

            aQueue.size.should.equal(2)
        })
    })

    context('#.dequeue', () => {
        it('Should remove an item from the front of the Queue.', () => {
            const aQueue = new Queue()

            aQueue.enqueue('A')
            aQueue.enqueue('B')

            aQueue.dequeue().should.equal('A')

            aQueue.enqueue('C')
            aQueue.enqueue('D')

            aQueue.dequeue().should.equal('B')

            aQueue.size.should.equal(2)
        })

        it('Should return "undefined" when using #.dequeue on an empty Queue.', () => {
            const aQueue = new Queue()

            should.not.exist(aQueue.dequeue())
        })
    })

    context('#.peek', () => {
        it('Should return the 1th item within the Queue.', () => {
            const aQueue = Queue.from(['A', 'B'])

            aQueue.peek().should.equal('A')

            aQueue.size.should.equal(2)
        })

        it('Should return "undefined" when using #.peek on an empty Queue.', () => {
            const aQueue = new Queue()

            should.not.exist(aQueue.peek())
        })
    })

    context('#.toArray', () => {
        it('Should return an Array with each item from the Queue.', () => {
            const aQueue = Queue.from(['A', 'B', 'C', 'D'])

            const toArray = aQueue.toArray()

            toArray[0].should.equal('A')
            toArray[1].should.equal('B')
            toArray[2].should.equal('C')
            toArray[3].should.equal('D')

            aQueue.dequeue().should.equal('A')
            aQueue.dequeue().should.equal('B')
            aQueue.dequeue().should.equal('C')
            aQueue.dequeue().should.equal('D')
        })

        it('#.toArray should keep the #._itemOffset in mind.', () => {
            const aQueue = Queue.from(['A', 'B', 'C', 'D', 'E'])

            aQueue.dequeue()
            aQueue.dequeue()

            /**
             * Check if the Array returned by .toArray() doesn't return "null" at
             * the beginning due to ._itemOffset;
             *
             * @type {Array.<*>}
             */
            const toArray = aQueue.toArray()

            toArray[0].should.equal('C')
            toArray[1].should.equal('D')
            toArray[2].should.equal('E')
        })
    })

    context('#.from', () => {
        it('Should create a Queue from an Iterable.', () => {
            const aQueue = Queue.from(['A', 'B', 'C', 'D'])

            aQueue.size.should.equal(4)

            aQueue.dequeue().should.equal('A')
            aQueue.dequeue().should.equal('B')
            aQueue.dequeue().should.equal('C')
            aQueue.dequeue().should.equal('D')
        })
    })

    context('Management of the Queue.', () => {
        it('Should resize the Array when necessary.', () => {
            const aQueue = Queue.from(['A', 'B', 'C', 'D'])

            aQueue.dequeue()
            aQueue.dequeue()

            aQueue._itemCollection.length.should.equal(2)
        })
    })
})