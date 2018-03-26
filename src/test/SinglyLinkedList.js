const should = require('chai').should()

const SinglyLinkedList = require('./../singly-linked-list')

describe('SinglyLinkedList', () => {
    context('#.unshift', () => {
        it('Should prepend an item to the Single Linked List.', () => {
            const singlyLinkedList = new SinglyLinkedList()

            singlyLinkedList.unshift('A')
            singlyLinkedList.unshift('B')
            singlyLinkedList.unshift('C')
            singlyLinkedList.unshift('D')

            singlyLinkedList.size.should.equal(4)
        })
    })

    context('#.shift', () => {
        it('Should return the item at the front of the Single Linked List.', () => {
            const singlyLinkedList = new SinglyLinkedList()

            singlyLinkedList.unshift('A')
            singlyLinkedList.unshift('B')
            singlyLinkedList.unshift('C')
            singlyLinkedList.unshift('D')

            singlyLinkedList.size.should.equal(4)

            singlyLinkedList.shift().should.equal('D')
            singlyLinkedList.shift().should.equal('C')
            singlyLinkedList.shift().should.equal('B')
            singlyLinkedList.shift().should.equal('A')

            singlyLinkedList.size.should.equal(0)
        })

        it('Should return "undefined" when using #.shift on an empty Single Linked List.', () => {
            const singlyLinkedList = new SinglyLinkedList()

            should.not.exist(singlyLinkedList.shift())
        })
    })

    context('#.peek', () => {
        it('Should return the item at the front of the Single Linked List.', () => {
            const singlyLinkedList = new SinglyLinkedList()

            singlyLinkedList.unshift('A')
            singlyLinkedList.unshift('B')

            singlyLinkedList.peek().should.equal(
                singlyLinkedList.shift() // "A" should still be available.
            )
        })

        it('Should return "undefined" when the Single Linked List is empty.', () => {
            const singlyLinkedList = new SinglyLinkedList()

            should.not.exist(singlyLinkedList.peek())
        })
    })

    context('#.peekFront', () => {
        it('Should be an alias of #.peek.', () => {
            const singlyLinkedList = new SinglyLinkedList()

            singlyLinkedList.peekFront.should.equal(singlyLinkedList.peek)
        })
    })

    context('#.toArray', () => {
        it('Should convert a Single Linked List to an Array.', () => {
            const singlyLinkedList = new SinglyLinkedList()

            singlyLinkedList.unshift('A')
            singlyLinkedList.unshift('B')
            singlyLinkedList.unshift('C')
            singlyLinkedList.unshift('D')

            const toArray = singlyLinkedList.toArray()

            toArray[0].should.equal('D')
            toArray[1].should.equal('C')
            toArray[2].should.equal('B')
            toArray[3].should.equal('A')

            singlyLinkedList.size.should.equal(4)
        })
    })

    context('#.from', () => {
        it('Should be possible to create a Singly Linked List from an Iterable.', () => {
            const singlyLinkedList = SinglyLinkedList.from(['A', 'B', 'C', 'D'])

            console.log(singlyLinkedList)

            singlyLinkedList.shift().should.equal('A')
            singlyLinkedList.shift().should.equal('B')
            singlyLinkedList.shift().should.equal('C')
            singlyLinkedList.shift().should.equal('D')
        })
    })
})