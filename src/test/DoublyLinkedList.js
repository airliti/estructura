const should = require('chai').should()

const DoublyLinkedList = require('./../doubly-linked-list')

describe('DoublyLinkedList', () => {
    context('#.push', () => {
        it('Should add an item to the back of the Doubly Linked List.', () => {
            const doublyLinkedList = new DoublyLinkedList()

            doublyLinkedList.push('A')
            doublyLinkedList.push('B')
            doublyLinkedList.push('C')
            doublyLinkedList.push('D')

            doublyLinkedList.size.should.equal(4)
        })
    })

    context('#.unshift', () => {
        it('Should prepend an item to the Doubly Linked List.', () => {
            const doublyLinkedList = new DoublyLinkedList()

            doublyLinkedList.unshift('A')
            doublyLinkedList.unshift('B')
            doublyLinkedList.unshift('C')
            doublyLinkedList.unshift('D')

            doublyLinkedList.size.should.equal(4)
        })
    })

    context('#.pop', () => {
        it('Should return the item at the back of the Doubly Linked List.', () => {
            const doublyLinkedList = new DoublyLinkedList()

            doublyLinkedList.unshift('A')
            doublyLinkedList.push('B')
            doublyLinkedList.unshift('C')
            doublyLinkedList.push('D')

            doublyLinkedList.size.should.equal(4)

            doublyLinkedList.pop().should.equal('D')
            doublyLinkedList.pop().should.equal('B')
            doublyLinkedList.pop().should.equal('A')
            doublyLinkedList.pop().should.equal('C')

            doublyLinkedList.size.should.equal(0)

            should.not.exist(doublyLinkedList.pop())
        })

        it('Should return "undefined" when using #.pop on an empty Doubly Linked List', () => {
            const doublyLinkedList = new DoublyLinkedList()

            should.not.exist(doublyLinkedList.pop())
        })
    })

    context('#.shift', () => {
        it('Should return the item at the front of the Doubly Linked List.', () => {
            const doublyLinkedList = new DoublyLinkedList()

            doublyLinkedList.unshift('A')
            doublyLinkedList.push('B')
            doublyLinkedList.unshift('C')
            doublyLinkedList.push('D')

            doublyLinkedList.size.should.equal(4)

            doublyLinkedList.shift().should.equal('C')
            doublyLinkedList.shift().should.equal('A')
            doublyLinkedList.shift().should.equal('B')
            doublyLinkedList.shift().should.equal('D')

            doublyLinkedList.size.should.equal(0)
        })

        it('Should return "undefined" when using #.shift on an empty Doubly Linked List.', () => {
            const doublyLinkedList = new DoublyLinkedList()

            should.not.exist(doublyLinkedList.shift())
        })
    })

    context('#.peek', () => {
        it('Should return the item at the front of the Doubly Linked List.', () => {
            const doublyLinkedList = new DoublyLinkedList()

            doublyLinkedList.push('B')
            doublyLinkedList.unshift('A')

            doublyLinkedList.peek().should.equal(
                doublyLinkedList.shift()
            )
        })

        it('Should return "undefined" when the Doubly Linked List is empty.', () => {
            const doublyLinkedList = new DoublyLinkedList()

            should.not.exist(doublyLinkedList.peek())
        })
    })

    context('#.peekFront', () => {
        it('Should be an alias of #.peek.', () => {
            const doublyLinkedList = new DoublyLinkedList()

            doublyLinkedList.peekFront.should.equal(doublyLinkedList.peek)
        })
    })

    context('#.peekBack', () => {
        it('Should return the item at the back of the Doubly Linked List.', () => {
            const doublyLinkedList = new DoublyLinkedList()

            doublyLinkedList.push('B')
            doublyLinkedList.unshift('A')

            doublyLinkedList.peekBack().should.equal(
                doublyLinkedList.pop() // B should still be available.
            )
        })

        it('Should become an alias for #.peek if only 1 item is present.', () => {
            const doublyLinkedList = new DoublyLinkedList()

            doublyLinkedList.push('A')

            doublyLinkedList.peekBack().should.equal('A')
        })

        it('Should return "undefined" when the Doubly Linked List is empty.', () => {
            const doublyLinkedList = new DoublyLinkedList()

            should.not.exist(doublyLinkedList.peekBack())
        })
    })

    context('#.toArray', () => {
        it('Should convert a Doubly Linked List to an Array.', () => {
            const doublyLinkedList = new DoublyLinkedList()

            doublyLinkedList.push('A')
            doublyLinkedList.push('B')
            doublyLinkedList.push('C')
            doublyLinkedList.push('D')

            const toArray = doublyLinkedList.toArray()

            toArray[0].should.equal('A')
            toArray[1].should.equal('B')
            toArray[2].should.equal('C')
            toArray[3].should.equal('D')

            doublyLinkedList.size.should.equal(4)
        })
    })

    context('#.from', () => {
        it('Should create a Doubly Linked List from an Iterable.', () => {
            const doublyLinkedList = DoublyLinkedList.from(['A', 'B', 'C', 'D'])

            doublyLinkedList.size.should.equal(4)

            doublyLinkedList.shift().should.equal('A')
            doublyLinkedList.shift().should.equal('B')
            doublyLinkedList.shift().should.equal('C')
            doublyLinkedList.shift().should.equal('D')
        })
    })

    context('#.push, #.unshift, #.pop, and #.shift', () => {
        it('Should be possible to use #.push, #.unshift, #.pop, and #.shift together.', () => {
            const isEqual = function (doublyLinkedList, compareAgainst) {
                const checkMe = doublyLinkedList.toArray()

                if (checkMe.length !== compareAgainst.length) return false

                for (let idxNr = 0, maxNr = compareAgainst.length; idxNr < maxNr; idxNr++) if (checkMe[idxNr] !== compareAgainst[idxNr]) return false

                return true
            }

            const doublyLinkedList = new DoublyLinkedList()

            let compareItAgainst = []

            for (let iNr = 0; iNr < 32768; iNr++) {
                const rndNr = ['.push', '.unshift', '.pop', '.shift'][Math.floor(Math.random() * 4)]

                switch (rndNr) {
                    case '.push':
                        doublyLinkedList.push(iNr)
                        compareItAgainst.push(iNr)

                        isEqual(doublyLinkedList, compareItAgainst).should.be.true

                        break
                    case '.unshift':
                        doublyLinkedList.unshift(iNr)
                        compareItAgainst = [iNr].concat(compareItAgainst)

                        isEqual(doublyLinkedList, compareItAgainst).should.be.true

                        break
                    case '.pop':
                        doublyLinkedList.pop()
                        compareItAgainst.pop()

                        isEqual(doublyLinkedList, compareItAgainst).should.be.true

                        break
                    case '.shift':
                        doublyLinkedList.shift()
                        compareItAgainst.splice(0, 1)

                        isEqual(doublyLinkedList, compareItAgainst).should.be.true

                        break
                }
            }
        })
    })
})