const should = require('chai').should()

const SkipList = require('./../skip-list')

describe('SkipList', () => {
    context('#.insert', () => {
        it('Should insert a new value into the Skip List.', () => {
            const skipList = new SkipList()

            skipList.insert('A')
            skipList.insert('C')
            skipList.insert('D')
            skipList.insert('B')

            skipList.size.should.equal(4)
        })
    })

    context('#.search', () => {
        it('Should be possible to search for a value within the Skip List.', () => {
            const skipList = new SkipList()

            skipList.insert('A')
            skipList.insert('C')
            skipList.insert('D')
            skipList.insert('B')

            skipList.search('A').should.equal('A')
            skipList.search('B').should.equal('B')
            skipList.search('C').should.equal('C')
            skipList.search('D').should.equal('D')
        })

        it('Should be possible to search for a value within the Skip List, extended version.', () => {
            const skipList = new SkipList(), searchArr = []

            for (let idxNr = 0, maxNr = 32768; idxNr < maxNr; idxNr++) {
                const randomNr = Math.random()

                skipList.insert(randomNr)

                if (Math.random() > .5) searchArr.push(randomNr)
            }

            skipList.toArray()

            searchArr.forEach(aValue => {
                skipList.search(aValue).should.equal(aValue)
            })
        })
    })

    context('#.delete', () => {
        it('Should be possible to delete a value from the Skip List.', () => {
            const skipList = new SkipList()

            skipList.insert('D')
            skipList.insert('B')
            skipList.insert('C')
            skipList.insert('A')

            skipList.delete('D').should.equal(true)
            skipList.delete('B').should.equal(true)

            skipList.delete('E').should.equal(false)

            skipList.size.should.equal(2)
        })

        it('Should be possible to delete a value from the Skip List, extended version.', () => {
            const skipList = new SkipList(), deleteArr = []

            for (let idxNr = 0; idxNr < 32768; idxNr++) {
                const randomNr = Math.random()

                skipList.insert(randomNr)

                if (Math.random() > .5) deleteArr.push(randomNr)
            }

            deleteArr.forEach(function (aValue) {
                skipList.delete(aValue).should.equal(true)
            })

            skipList.size.should.equal(32768 - deleteArr.length)
        })
    })

    context('#.peek', () => {
        it('Should be possible to take a look at the first value within the Skip List.', () => {
            const skipList = new SkipList()

            skipList.insert('A')

            skipList.peek().should.equal('A')

            skipList.size.should.equal(1)
        })

        it('Should be possible to take a look at the first value within the Skip List, extended version.', () => {
            const skipList = new SkipList(
                (itemA, itemB) => itemB > itemA
            )

            for (let idxNr = 0; idxNr < 32768; idxNr++) skipList.insert(
                Math.random()
            )

            skipList.insert(1)

            skipList.peek().should.equal(1)

            skipList.size.should.equal(32768 + 1 /** Inserted at the end. **/)
        })

        it('Should return "undefined" when the Skip List is empty.', () => {
            const skipList = new SkipList()

            should.not.exist(skipList.peek())
        })
    })

    context('#.peekFront', () => {
        it('Should be an alias of #.peek.', () => {
            const skipList = new SkipList()

            skipList.peekFront.should.equal(skipList.peek)
        })
    })

    context('#.toArray', () => {
        it('Should be possible to convert the Skip List into an array.', () => {
            const skipList = new SkipList()

            skipList.insert('A')
            skipList.insert('D')
            skipList.insert('B')
            skipList.insert('C')

            const toArray = skipList.toArray()

            toArray[0].should.equal('A')
            toArray[1].should.equal('B')
            toArray[2].should.equal('C')
            toArray[3].should.equal('D')
        })
    })

    context('#.from', () => {
        it('Should be possible to create a Skip List from an Iterable.', () => {
            const skipList = SkipList.from(['A', 'C', 'D', 'B'])

            skipList.size.should.equal(4)

            skipList.search('A').should.equal('A')
            skipList.search('B').should.equal('B')
            skipList.search('C').should.equal('C')
            skipList.search('D').should.equal('D')
        })
    })
})