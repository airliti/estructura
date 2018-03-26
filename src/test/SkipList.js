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

        it('Should be possible to search for a value within the Skip List ( extended ).', () => {
            const skipList = new SkipList(), searchArr = []

            for (let idxNr = 0, maxNr = Math.pow(2, 16); idxNr < maxNr; idxNr++) {
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
})