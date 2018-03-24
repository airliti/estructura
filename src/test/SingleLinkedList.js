const should = require('chai').should()

const SingleLinkedList = require('./../single-linked-list')

describe('SingleLinkedList', () => {
    context('#.unshift', () => {
        it('Should prepend an item to the Single Linked List.', () => {
            const singleLinkedList = new SingleLinkedList()

            singleLinkedList.unshift('A')
            singleLinkedList.unshift('B')
            singleLinkedList.unshift('C')
            singleLinkedList.unshift('D')

            singleLinkedList.size.should.equal(4)
        })
    })

    context('#.shift', () => {
        it('Should return the item at the front of the Single Linked List.', () => {
            const singleLinkedList = new SingleLinkedList()

            singleLinkedList.unshift('A')
            singleLinkedList.unshift('B')
            singleLinkedList.unshift('C')
            singleLinkedList.unshift('D')

            singleLinkedList.size.should.equal(4)

            singleLinkedList.shift().should.equal('D')
            singleLinkedList.shift().should.equal('C')
            singleLinkedList.shift().should.equal('B')
            singleLinkedList.shift().should.equal('A')

            singleLinkedList.size.should.equal(0)
        })

        it('Should return "undefined" when using #.shift on an empty Single Linked List.', () => {
            const singleLinkedList = new SingleLinkedList()

            should.not.exist(singleLinkedList.shift())
        })
    })

    context('#.peekFront', () => {
        it('Should return the item at the front of the Single Linked List.', () => {
            const singleLinkedList = new SingleLinkedList()

            singleLinkedList.unshift('A')
            singleLinkedList.unshift('B')

            singleLinkedList.peekFront().should.equal(
                singleLinkedList.shift() // "A" should still be available.
            )
        })

        it('Should return "undefined" when the Single Linked List is empty.', () => {
            const singleLinkedList = new SingleLinkedList()

            should.not.exist(singleLinkedList.peekFront())
        })
    })

    context('#.toArray', () => {
        it('Should convert a Single Linked List to an Array.', () => {
            const singleLinkedList = new SingleLinkedList()

            singleLinkedList.unshift('A')
            singleLinkedList.unshift('B')
            singleLinkedList.unshift('C')
            singleLinkedList.unshift('D')

            const toArray = singleLinkedList.toArray()

            toArray[0].should.equal('D')
            toArray[1].should.equal('C')
            toArray[2].should.equal('B')
            toArray[3].should.equal('A')

            singleLinkedList.size.should.equal(4)
        })
    })
})