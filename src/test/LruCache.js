const should = require('chai').should()

const LruCache = require('./../lru-cache')

describe('LruCache', () => {
    /**
     * Maximum Size of 8. Max Age set to Infinity.
     *
     * @return {LruCache}
     */
    let stringNumberCache = () => {
        const lruCache = new LruCache({maxSize: 8})

        for (let idxNr = 1; idxNr < 9; idxNr++) lruCache.set(`Key-0${idxNr}`, idxNr)

        lruCache.size.should.equal(8)

        return lruCache
    }

    context('#.sizeCalculator', () => {
        it('Should be possible to define a custom size Function.', () => {
            const lruCache = new LruCache({sizeCalculator: (aValue, uniqueId) => aValue * 2})

            lruCache.set('A', 1)
            lruCache.set('B', 2)

            lruCache.size.should.equal(6)
        })
    })

    context('#.get', () => {
        it('Should be possible to retrieve an item based on a "uniqueId";', () => {
            const lruCache = stringNumberCache()

            for (let idxNr = 1; idxNr < 9; idxNr++) lruCache.get(`Key-0${idxNr}`).should.equal(idxNr)
        })

        it('Should discard an item when it is violating the "maxAge";', (whenDone) => {
            const lruCache = stringNumberCache()
            lruCache.maxAge = 60

            lruCache.get('Key-01').should.equal(1)
            lruCache.get('Key-02').should.equal(2)

            setTimeout(() => {
                should.not.exist(lruCache.get('Key-01'))
                should.not.exist(lruCache.get('Key-02'))

                lruCache.size.should.equal(6)

                whenDone()
            }, 80)
        })
    })

    context('#.getOrCreate', () => {
        it('Should use the "ifNotDefined" Function go generate a value if the Key-Value pair does NOT exist.', async() => {
            const lruCache = new LruCache()

            const aValue = await lruCache.getOrCreate('Key-01', async() => new Promise(onResolve => setTimeout(() => onResolve('Create Key-01.'), 80)))

            aValue.should.equal('Create Key-01.')
        })

        it('Should use the "ifNotDefined" Function when the "maxAge" has exceeded it limitation.', () => {
            const lruCache = new LruCache()
            lruCache.maxAge = 20

            lruCache.set('Key-01', 'I should be overwritten.')

            const testPromise = new Promise(onResolve => {
                setTimeout(async() => {
                    const aValue = await lruCache.getOrCreate('Key-01', async() => new Promise(onResolve => setTimeout(() => onResolve('Overwrite Key-01.'), 80)))

                    onResolve(aValue)
                }, 40)
            })

            return testPromise.then((aValue) => {
                aValue.should.equal('Overwrite Key-01.')
            })
        })

        it('Should ignore the "ifNotDefined" Function when the Key-Value pair is available and has NOT surpassed the "maxAge";', async() => {
            const lruCache = new LruCache()
            lruCache.maxAge = 20

            lruCache.set('Key-01', 'I should NOT be overwritten by a new value.')

            const aValue = await lruCache.getOrCreate('Key-01', () => 'Try to overwrite Key-01.')

            aValue.should.equal('I should NOT be overwritten by a new value.')
        })
    })

    context('#.getOrCreateSync', () => {
        it('Should execute the "ifNotDefined" Function if the Key-Value pair is NOT present within the Cache.', () => {
            const lruCache = new LruCache()

            const aValue = lruCache.getOrCreateSync('Key-01', () => 'Create Key-01.')

            aValue.should.equal('Create Key-01.')
        })

        it('Should execute the "ifNotDefined" Function if the "maxAge" has been exceeded.', (whenDone) => {
            const lruCache = new LruCache()
            lruCache.maxAge = 20

            lruCache.set('Key-01', 'I should be overwritten.')

            setTimeout(() => {
                const aValue = lruCache.getOrCreateSync('Key-01', () => 'I am Key-01.')

                aValue.should.equal('I am Key-01.')

                whenDone()
            }, 40)
        })

        it('Should ignore the supplied "ifNotDefined" Function if the Key-Value pair is present and has NOT surpassed the "maxAge";', () => {
            const lruCache = new LruCache()
            lruCache.maxAge = 20

            lruCache.set('Key-01', 'I should NOT be overwritten by a new value.')

            const aValue = lruCache.getOrCreateSync('Key-01', () => 'Try to overwrite Key-01.')

            aValue.should.equal('I should NOT be overwritten by a new value.')
        })
    })

    context('#.set', () => {
        it('Should discard the Least Recently Used item within the Cache.', () => {
            const lruCache = stringNumberCache()

            lruCache.set('Key-09', 'I am discarding Key-01.')
            lruCache.set('Key-10', 'I am discarding Key-02.')

            lruCache.size.should.equal(8)

            should.not.exist(lruCache.get('Key-01'))
            should.not.exist(lruCache.get('Key-02'))

            lruCache.get('Key-09').should.equal('I am discarding Key-01.')
            lruCache.get('Key-10').should.equal('I am discarding Key-02.')
        })

        it('Should discard the Least Recently Used item within the Cache and emit the "dispose" event.', (whenDone) => {
            const lruCache = new LruCache({maxSize: 1})
            lruCache.on('dispose', (aValue, uniqueId) => {
                uniqueId.should.equal('Key-01')
                aValue.should.equal('I am Key-01.')

                lruCache.size.should.equal(1)

                whenDone()
            })

            lruCache.set('Key-01', 'I am Key-01.')
            lruCache.set('Key-02', 'I should discard Key-01.')
        })

        it('Should be possible to overwrite an Key-Value pair.', () => {
            const lruCache = stringNumberCache()

            lruCache.get('Key-01').should.equal(1)
            lruCache.get('Key-02').should.equal(2)

            lruCache.size.should.equal(8)

            lruCache.set('Key-01', 'Should overwrite Key-01.')
            lruCache.set('Key-02', 'Should overwrite Key-02.')

            lruCache.size.should.equal(8)

            lruCache.get('Key-01').should.equal('Should overwrite Key-01.')
            lruCache.get('Key-02').should.equal('Should overwrite Key-02.')
        })

        it('Should be possible to overwrite a Key-Value pair and use the "dispose" event to handle it.', (whenDone) => {
            const lruCache = new LruCache()
            lruCache.on('dispose', (aValue, uniqueId) => {
                uniqueId.should.equal('Key-09')
                aValue.should.equal('I am Key-09.')

                lruCache.size.should.equal(1)

                whenDone()
            })

            lruCache.set('Key-09', 'I am Key-09.')
            lruCache.set('Key-09', 'The "dispose" event should have been emitted.')
        })
    })

    context('#.has', () => {
        it('Should return a Boolean based on whether an item exist within the Lru Cache.', () => {
            const lruCache = stringNumberCache()

            for (let idxNr = 1; idxNr < 9; idxNr++) lruCache.has(`Key-0${idxNr}`).should.equal(true)

            lruCache.has('Key-09').should.equal(false)
            lruCache.has('Key-10').should.equal(false)
        })

        it('Should return "false" when an item is exceeding the "maxAge" value.', (whenDone) => {
            const lruCache = stringNumberCache()
            lruCache.maxAge = 60

            lruCache.get('Key-01').should.equal(1)
            lruCache.get('Key-02').should.equal(2)

            setTimeout(() => {
                lruCache.has('Key-01').should.equal(false)
                lruCache.has('Key-02').should.equal(false)

                whenDone()
            }, 80)
        })
    })

    context('#.delete', () => {
        it('Should be possible to remove an item from the Cache.', () => {
            const lruCache = stringNumberCache()

            for (let idxNr = 1; idxNr < 9; idxNr++) {
                const aKey = `Key-0${idxNr}`

                lruCache.get(aKey).should.equal(idxNr)

                /**
                 * @see #.delete
                 */
                lruCache.delete(aKey)

                /**
                 * The #.has method should return "false" as we've deleted the
                 * item.
                 */
                lruCache.has(aKey).should.equal(false)

                /**
                 * And when we use the #.get method we shouldn't be able to
                 * retrieve the value any longer.
                 */
                should.not.exist(
                    lruCache.get(aKey)
                )

                /**
                 * Verify whether the #.size value has been updated by the Lru
                 * Cache.
                 */
                lruCache.size.should.equal(8 - idxNr)
            }
        })

        it('Should be possible to delete an item from the Cache and use the "dispose" event to handle it.', (whenDone) => {
            const lruCache = new LruCache()
            lruCache.on('dispose', (aValue, uniqueId) => {
                uniqueId.should.equal('Key-01')
                aValue.should.equal('I am the deleted Key-01.')

                whenDone()
            })

            lruCache.set('Key-01', 'I am the deleted Key-01.')

            lruCache.delete('Key-01')
        })

        it('Should delete an item even when the "maxAge" has been surpassed.', () => {
            const lruCache = stringNumberCache()
            lruCache.maxAge = 60

            lruCache.get('Key-01').should.equal(1)
            lruCache.get('Key-02').should.equal(2)

            lruCache.size.should.equal(8)

            setTimeout(() => {
                lruCache.delete('Key-01')
                lruCache.delete('Key-02')

                lruCache.size.should.equal(6)
            }, 80)
        })

        it('Should ignore a request for deletion of an unknown item.', () => {
            const lruCache = stringNumberCache()

            lruCache.size.should.equal(8)

            lruCache.delete('Key-09')
            lruCache.delete('Key-10')

            lruCache.size.should.equal(8)
        })
    })

    context('#.prune', () => {
        it('Should be possible to prune the Cache.', (whenDone) => {
            const lruCache = stringNumberCache()
            lruCache.maxAge = 60

            lruCache.size.should.equal(8)

            setTimeout(() => {
                lruCache.prune()

                lruCache.size.should.equal(0)

                whenDone()
            }, 80)
        })

        it('Should be possible to prune the Cache and use the "dispose" event to handle it.', (whenDone) => {
            const lruCache = new LruCache()
            lruCache.maxAge = 60

            lruCache.on('dispose', (aValue, uniqueId) => {
                uniqueId.should.equal('Key-01')
                aValue.should.equal('I am the Key-Value pair that should be disposed.')

                whenDone()
            })

            lruCache.set('Key-01', 'I am the Key-Value pair that should be disposed.')

            setTimeout(() => {
                lruCache.prune()
            }, 80)
        })
    })

    context('#.prune and #.maxAge', () => {
        it('Should automatically remove each item older than the new `maxAge`;', (whenDone) => {
            const lruCache = new LruCache()

            lruCache.set('A', 'I am A.')
            lruCache.set('B', 'I am B.')

            setTimeout(
                () => {
                    lruCache.set('C', 'I am C.')
                    lruCache.set('D', 'I am D.')

                    lruCache.maxAge = 60

                    lruCache.get('C').should.equal('I am C.')
                    lruCache.get('D').should.equal('I am D.')

                    lruCache.size.should.equal(2)

                    whenDone()
                }, 80
            )
        })
    })

    context('#.get #.set #.has #.delete', () => {
        it('Should be possible to use a Function as "uniqueId";', () => {
            const lruCache = new LruCache()

            const functionA = () => 'Hello World!'
            const functionB = () => 'Hello World by another Function!'
            const functionC = () => 'I should NOT be within the Cache.'

            lruCache.set(functionA, functionA)
            lruCache.set(functionB, functionB)

            lruCache.has(functionA).should.equal(true)
            lruCache.has(functionB).should.equal(true)

            lruCache.has(functionC).should.equal(false)

            lruCache.get(functionA)().should.equal('Hello World!')
            lruCache.get(functionB)().should.equal('Hello World by another Function!')

            should.not.exist(lruCache.get(functionC))

            lruCache.delete(functionA)
            lruCache.delete(functionB)

            lruCache.has(functionA).should.equal(false)
            lruCache.has(functionB).should.equal(false)

            should.not.exist(lruCache.get(functionA))
            should.not.exist(lruCache.get(functionB))
        })

        it('Should be possible to use an Object as "uniqueId";', () => {
            const lruCache = new LruCache()

            const objectA = {helloWorld: 'Hello World!'}
            const objectB = {helloWorld: 'Hello World by another Object!'}
            const objectC = {helloWorld: 'I should NOT be within the Cache.'}

            lruCache.set(objectA, objectA)
            lruCache.set(objectB, objectB)

            lruCache.has(objectA).should.equal(true)
            lruCache.has(objectB).should.equal(true)

            lruCache.has(objectC).should.equal(false)

            lruCache.get(objectA).helloWorld.should.equal('Hello World!')
            lruCache.get(objectB).helloWorld.should.equal('Hello World by another Object!')

            should.not.exist(lruCache.get(objectC))

            lruCache.delete(objectA)
            lruCache.delete(objectB)

            lruCache.has(objectA).should.equal(false)
            lruCache.has(objectB).should.equal(false)

            should.not.exist(lruCache.get(objectA))
            should.not.exist(lruCache.get(objectB))
        })
    })

    context('Management of the Lru Cache', () => {
        it('Should resize the Cache when the #.maxSize value has been modified.', () => {
            const lruCache = new LruCache()

            lruCache.set('Key-01', 'I am Key-01')
            lruCache.set('Key-02', 'I am Key-02')

            lruCache.maxSize = 1

            lruCache.size.should.equal(1)
        })

        it('Should #.prune the Cache when the #.maxAge has been modified.', (whenDone) => {
            const lruCache = new LruCache()

            lruCache.set('Key-01', 'I am Key-01')
            lruCache.set('Key-02', 'I am Key-02')

            setTimeout(() => {
                lruCache.maxAge = 20

                should.not.exist(lruCache.get('Key-01'))
                should.not.exist(lruCache.get('Key-02'))

                whenDone()
            }, 40)
        })
    })

    context('Recorder', () => {
        context('#.get', () => {
            it('Should update the #.getHitMissRatio', () => {
                const testCase = [[20, 15, .5714], [15, 20, .4286], [40, 0, 1], [0, 40, 0]]

                testCase.forEach(aCase => {
                    const lruCache = LruCache.withRecording()

                    /**
                     * Create a Lru Cache based on the "hitCount" and "missCount"
                     * that has been configured.
                     */
                    const hitCount = aCase[0], missCount = aCase[1]

                    /**
                     * @type {Number}
                     */
                    const hitMissRatio = aCase[2]

                    for (let idxNr = 0; idxNr < hitCount; idxNr++) {
                        const aKey = `Key-${('0' + idxNr).slice(-2)}`

                        lruCache.set(aKey, idxNr)
                        lruCache.get(aKey)
                    }

                    for (let idxNr = 0; idxNr < missCount; idxNr++) lruCache.get(`Unknown`)

                    /**
                     * .0000 Precision.
                     *
                     * @type {Number}
                     */
                    const getHitMissRatio = (Math.round(lruCache.getHitMissRatio * 1e4) / 1e4)

                    getHitMissRatio.should.equal(hitMissRatio)

                    /**
                     * The #.getHitCount value should equal the number of times
                     * we've retrieved an actual item.
                     */
                    lruCache.getHitCount.should.equal(hitCount);

                    /**
                     * #.getMissCount should equal when we've tried to receive
                     * "Unknown" values.
                     */
                    lruCache.getMissCount.should.equal(missCount);
                })
            })
        })

        context('#.set', () => {
            it('Should update the #.nrDefined value.', () => {
                const lruCache = LruCache.withRecording()

                lruCache.set('Key-01', 'I am Key-01.')
                lruCache.set('Key-02', 'I am Key-02.')

                lruCache.nrDefined.should.equal(2)

                lruCache.set('Key-01', 'I should overwrite Key-01.')
                lruCache.set('Key-02', 'I should overwrite Key-02.')

                lruCache.nrDefined.should.equal(4)
            })
        })

        context('#.has', () => {
            it('Should update the #.hasHitMissRatio', () => {
                const testCase = [[40, 30, .5714], [30, 40, .4286], [60, 0, 1], [0, 60, 0]]

                testCase.forEach(aCase => {
                    const lruCache = LruCache.withRecording()

                    /**
                     * Store the Hit and Miss Count, so we can create a sufficient
                     * Lru Cache.
                     */
                    const hitCount = aCase[0], missCount = aCase[1]

                    /**
                     * @type {Number}
                     */
                    const hitMissRatio = aCase[2]

                    for (let idxNr = 0; idxNr < hitCount; idxNr++) {
                        const aKey = `Key-${('0' + idxNr).slice(-2)}`

                        lruCache.set(aKey, idxNr)
                        lruCache.has(aKey)
                    }

                    for (let idxNr = 0; idxNr < missCount; idxNr++) lruCache.has(`Unknown`)

                    /**
                     * @type {Number}
                     */
                    const hasHitMissRatio = (Math.round(lruCache.hasHitMissRatio * 1e4) / 1e4)

                    hasHitMissRatio.should.equal(hitMissRatio)

                    /**
                     * Check if the #.hasHitCount has been updated to when we
                     * actually verified whether an existing item was present
                     * within the Cache.
                     */
                    lruCache.hasHitCount.should.equal(hitCount);

                    /**
                     * Equal to when we tried to check whether the "Unknown" Key-
                     * Value pair was present within the Cache.
                     */
                    lruCache.hasMissCount.should.equal(missCount);
                })
            })
        })

        context('#.delete', () => {
            it('Should update the #.nrDisposed when an item is deleted.', () => {
                const lruCache = LruCache.withRecording()

                lruCache.set('Key-01', 'I am Key-01.')
                lruCache.set('Key-02', 'I am Key-02.')

                lruCache.delete('Key-01')

                lruCache.nrDisposed.should.equal(1)
            })
        })
    })
})