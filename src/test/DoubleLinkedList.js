const should = require('chai').should()

const DoubleLinkedList = require('./../double-linked-list')

describe('DoubleLinkedList', () => {
    context('#.push', () => {
        it('Should add an item to the back of the Double Linked List.', () => {
            const doubleLinkedList = new DoubleLinkedList()

            doubleLinkedList.push('A')
            doubleLinkedList.push('B')
            doubleLinkedList.push('C')
            doubleLinkedList.push('D')

            doubleLinkedList.size.should.equal(4)
        })
    })

    context('#.unshift', () => {
        it('Should prepend an item to the Double Linked List.', () => {
            const doubleLinkedList = new DoubleLinkedList()

            doubleLinkedList.unshift('A')
            doubleLinkedList.unshift('B')
            doubleLinkedList.unshift('C')
            doubleLinkedList.unshift('D')

            doubleLinkedList.size.should.equal(4)
        })
    })

    context('#.pop', () => {
        it('Should return the item at the back of the Double Linked List.', () => {
            const doubleLinkedList = new DoubleLinkedList()

            doubleLinkedList.unshift('A')
            doubleLinkedList.push('B')
            doubleLinkedList.unshift('C')
            doubleLinkedList.push('D')

            doubleLinkedList.size.should.equal(4)

            doubleLinkedList.pop().should.equal('D')
            doubleLinkedList.pop().should.equal('B')
            doubleLinkedList.pop().should.equal('A')
            doubleLinkedList.pop().should.equal('C')

            doubleLinkedList.size.should.equal(0)

            should.not.exist(doubleLinkedList.pop())
        })

        it('Should return "undefined" when using #.pop on an empty Double Linked List', () => {
            const doubleLinkedList = new DoubleLinkedList()

            should.not.exist(doubleLinkedList.pop())
        })
    })

    context('#.shift', () => {
        it('Should return the item at the front of the Double Linked List.', () => {
            const doubleLinkedList = new DoubleLinkedList()

            doubleLinkedList.unshift('A')
            doubleLinkedList.push('B')
            doubleLinkedList.unshift('C')
            doubleLinkedList.push('D')

            doubleLinkedList.size.should.equal(4)

            doubleLinkedList.shift().should.equal('C')
            doubleLinkedList.shift().should.equal('A')
            doubleLinkedList.shift().should.equal('B')
            doubleLinkedList.shift().should.equal('D')

            doubleLinkedList.size.should.equal(0)
        })

        it('Should return "undefined" when using #.shift on an empty Double Linked List.', () => {
            const doubleLinkedList = new DoubleLinkedList()

            should.not.exist(doubleLinkedList.shift())
        })
    })

    context('#.peek', () => {
        it('Should return the item at the front of the Double Linked List.', () => {
            const doubleLinkedList = new DoubleLinkedList()

            doubleLinkedList.push('B')
            doubleLinkedList.unshift('A')

            doubleLinkedList.peek().should.equal(
                doubleLinkedList.shift() // A should still be available.
            )
        })

        it('Should return "undefined" when the Double Linked List is empty.', () => {
            const doubleLinkedList = new DoubleLinkedList()

            should.not.exist(doubleLinkedList.peek())
        })
    })

    context('#.peekBack', () => {
        it('Should return the item at the back of the Double Linked List.', () => {
            const doubleLinkedList = new DoubleLinkedList()

            doubleLinkedList.push('B')
            doubleLinkedList.unshift('A')

            doubleLinkedList.peekBack().should.equal(
                doubleLinkedList.pop() // B should still be available.
            )
        })

        it('Should become an alias for #.peek if only 1 item is present.', () => {
            const doubleLinkedList = new DoubleLinkedList()

            doubleLinkedList.push('A')

            doubleLinkedList.peekBack().should.equal('A')
        })

        it('Should return "undefined" when the Double Linked List is empty.', () => {
            const doubleLinkedList = new DoubleLinkedList()

            should.not.exist(doubleLinkedList.peekBack())
        })
    })

    context('#.toArray', () => {
        it('Should convert a Double Linked List to an Array.', () => {
            const doubleLinkedList = new DoubleLinkedList()

            doubleLinkedList.push('A')
            doubleLinkedList.push('B')
            doubleLinkedList.push('C')
            doubleLinkedList.push('D')

            const toArray = doubleLinkedList.toArray()

            toArray[0].should.equal('A')
            toArray[1].should.equal('B')
            toArray[2].should.equal('C')
            toArray[3].should.equal('D')

            doubleLinkedList.size.should.equal(4)
        })
    })

    context('#.from', () => {
        it('Should create a Double Linked List from an Iterable.', () => {
            const doubleLinkedList = DoubleLinkedList.from(['A', 'B', 'C', 'D'])

            doubleLinkedList.size.should.equal(4)

            doubleLinkedList.shift().should.equal('A')
            doubleLinkedList.shift().should.equal('B')
            doubleLinkedList.shift().should.equal('C')
            doubleLinkedList.shift().should.equal('D')
        })
    })
})