const should = require('chai').should()

const PriorityQueue = require('./../priority-queue')

describe('PriorityQueue', () => {
    const compareFn = (itemA, itemB) => {
        if (itemA.priorityNr > itemB.priorityNr) return +1
        if (itemA.priorityNr < itemB.priorityNr) return -1

        return 0
    }

    context('#.constructor', () => {
        it('Should use an ascending compare `Function` by default.', () => {
            const priorityQueue = new PriorityQueue()

            priorityQueue.enqueue(2)
            priorityQueue.enqueue(4)

            priorityQueue.dequeue().should.equal(2)
            priorityQueue.dequeue().should.equal(4)
        })

        it('Should be possible to use a custom `compareFn`.', () => {
            const priorityQueue = new PriorityQueue(compareFn)

            priorityQueue.enqueue({priorityNr: 0, aValue: 'A'})
            priorityQueue.enqueue({priorityNr: 2, aValue: 'B'})
            priorityQueue.enqueue({priorityNr: 2, aValue: 'B'})
            priorityQueue.enqueue({priorityNr: 0, aValue: 'A'})
            priorityQueue.enqueue({priorityNr: 4, aValue: 'C'})
            priorityQueue.enqueue({priorityNr: 2, aValue: 'B'})
            priorityQueue.enqueue({priorityNr: 4, aValue: 'C'})
            priorityQueue.enqueue({priorityNr: 2, aValue: 'B'})
            priorityQueue.enqueue({priorityNr: 0, aValue: 'A'})
            priorityQueue.enqueue({priorityNr: 0, aValue: 'A'})

            priorityQueue.dequeue().priorityNr.should.equal(0)
            priorityQueue.dequeue().priorityNr.should.equal(0)
            priorityQueue.dequeue().priorityNr.should.equal(0)
            priorityQueue.dequeue().priorityNr.should.equal(0)
            priorityQueue.dequeue().priorityNr.should.equal(2)
            priorityQueue.dequeue().priorityNr.should.equal(2)
            priorityQueue.dequeue().priorityNr.should.equal(2)
            priorityQueue.dequeue().priorityNr.should.equal(2)
            priorityQueue.dequeue().priorityNr.should.equal(4)
            priorityQueue.dequeue().priorityNr.should.equal(4)
        })
    })

    context('#.enqueue', () => {
        it('Should be possible to add a value to the queue.', () => {
            const priorityQueue = new PriorityQueue(compareFn)

            priorityQueue.enqueue({priorityNr: 1, aValue: 'A'})
            priorityQueue.enqueue({priorityNr: 2, aValue: 'B'})

            priorityQueue.size.should.equal(2)
        })
    })

    context('#.dequeue', () => {
        it('Should be possible to retrieve a value from the Priority Queue.', () => {
            const priorityQueue = new PriorityQueue(compareFn)

            priorityQueue.enqueue({priorityNr: 1, aValue: 'A'})
            priorityQueue.enqueue({priorityNr: 2, aValue: 'B'})
            priorityQueue.enqueue({priorityNr: 1, aValue: 'A'})
            priorityQueue.enqueue({priorityNr: 2, aValue: 'B'})

            priorityQueue.dequeue().priorityNr.should.equal(1)
            priorityQueue.dequeue().priorityNr.should.equal(1)
            priorityQueue.dequeue().priorityNr.should.equal(2)
            priorityQueue.dequeue().priorityNr.should.equal(2)
        })

        it('Should be possible to retrieve a value from the Priority Queue, extended.', () => {
            const priorityQueue = new PriorityQueue(compareFn)

            for (let idxNr = 0, maxNr = 65536; idxNr < maxNr; idxNr++) {
                const priorityNr = Math.floor(Math.random() * 5) // Priority between 0 & 4 ( inclusive )

                priorityQueue.enqueue({priorityNr: priorityNr, aValue: Math.random()})
            }

            let curValue = priorityQueue.dequeue(), maxPriorityNr = 0

            while (curValue) {
                curValue.priorityNr.should.be.at.least(maxPriorityNr)

                maxPriorityNr = curValue.priorityNr

                curValue = priorityQueue.dequeue()
            }
        })

        it('Should return "undefined" when using #.dequeue on an empty Priority Queue.', () => {
            const priorityQueue = new PriorityQueue()

            should.not.exist(priorityQueue.dequeue())
        })
    })

    context('#.peek', () => {
        it('Should return the 1th item within the Priority Queue.', () => {
            const priorityQueue = PriorityQueue.from([2, 4])

            priorityQueue.peek().should.equal(2)

            priorityQueue.size.should.equal(2)
        })

        it('Should return "undefined" when using #.peek on an empty Priority Queue.', () => {
            const priorityQueue = new PriorityQueue()

            should.not.exist(priorityQueue.peek())
        })
    })

    context('#.peekFront', () => {
        it('Should be an alias of #.peek.', () => {
            const priorityQueue = new PriorityQueue()

            priorityQueue.peekFront.should.equal(priorityQueue.peek)
        })
    })

    context('#.toArray', () => {
        it('Should return an Array with each item from the Priority Queue.', () => {
            const priorityQueue = PriorityQueue.from([4, 6, 2, 0, 4, 8])

            const toArray = priorityQueue.toArray()

            toArray[0].should.equal(0)
            toArray[1].should.equal(2)
            toArray[2].should.equal(4)
            toArray[3].should.equal(4)
            toArray[4].should.equal(6)
            toArray[5].should.equal(8)

            priorityQueue.dequeue().should.equal(0)
            priorityQueue.dequeue().should.equal(2)
            priorityQueue.dequeue().should.equal(4)
            priorityQueue.dequeue().should.equal(4)
            priorityQueue.dequeue().should.equal(6)
            priorityQueue.dequeue().should.equal(8)
        })
    })

    context('#.from', () => {
        it('Should create a Priority Queue from an Iterable.', () => {
            const priorityQueue = PriorityQueue.from([0, 6, 4, 2])

            priorityQueue.size.should.equal(4)

            priorityQueue.dequeue().should.equal(0)
            priorityQueue.dequeue().should.equal(2)
            priorityQueue.dequeue().should.equal(4)
            priorityQueue.dequeue().should.equal(6)
        })
    })
})