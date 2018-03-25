const EventEmitter = require('events'), Heap = require('./Heap')

class NilW8q7dOsP {

}

/**
 * @class {LruCache}
 */
class LruCache {
    /**
     * @constructor
     *
     * @param {{maxSize: Number, maxAge: Number, sizeCalculator: Function}} cacheConfig
     *
     * @example
     *
     * const LruCache = require('estructura/lru-cache')
     *
     * const lruCache = new LruCache()
     *
     * @example
     *
     * <caption>
     * Or by supplying additional information limiting the size of the Cache and
     * the age of each item independently. Both are optional and result into
     * `Infinity` if not defined. The `maxAge` is defined in Milliseconds.
     * </caption>
     *
     * const LruCache = require('estructura/lru-cache')
     *
     * const lruCache = new LruCache({maxSize: 20, sizeCalculator: function() { return 1 }, maxAge: 60 * 1000})
     */
    constructor(cacheConfig = {}) {
        this.maxSize_ = cacheConfig.maxSize || Infinity

        Object.defineProperty(this, 'maxSize', {
            get: () => this.maxSize_,
            set: (newValue) => {
                this.maxSize_ = newValue, this.trim_()
            }
        })

        this.sizeCalculator = cacheConfig.sizeCalculator || function () {
            return 1
        }

        this.maxAge_ = cacheConfig.maxAge || Infinity

        Object.defineProperty(this, 'maxAge', {
            get: () => this.maxAge_,
            set: (newValue) => {
                this.maxAge_ = newValue, this.prune()
            }
        })

        this.itemMap_ = new Map()

        this.pHead_ = {
            aValue: new NilW8q7dOsP(),

            lNode: null,
            rNode: null
        }
        this.pTail_ = {
            aValue: new NilW8q7dOsP(),

            lNode: null,
            rNode: null
        }

        this.pHead_.rNode = this.pTail_
        this.pTail_.lNode = this.pHead_

        this.eventEmitter_ = new EventEmitter()

        this.size = 0
    }

    /**
     * @private
     *
     * @param {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *}} aNode
     */
    unshiftNode_(aNode) {
        if (aNode === this.pHead_.rNode) return

        if (aNode.lNode) aNode.lNode.rNode = aNode.rNode
        if (aNode.rNode) aNode.rNode.lNode = aNode.lNode

        aNode.lNode = this.pHead_
        aNode.rNode = this.pHead_.rNode

        this.pHead_.rNode.lNode = aNode
        this.pHead_.rNode = aNode
    }

    /**
     * @private
     *
     * @param {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *}} aNode
     */
    unlinkNode_(aNode) {
        aNode.lNode.rNode = aNode.rNode
        aNode.rNode.lNode = aNode.lNode

        aNode.lNode = null
        aNode.rNode = null
    }

    /**
     * @private
     *
     * @param {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *} | undefined} aNode
     *
     * @return {Boolean}
     */
    destroyNode_(aNode) {
        if (typeof aNode !== 'object' || this.itemMap_.delete(aNode.uniqueId) === false) return false

        this.size = this.size - aNode.sizeAttribute

        // Remove the Node and manage the reference(s):
        this.unlinkNode_(aNode)

        // Use the Event Emitter to broadcast the `dispose` event:
        this.eventEmitter_.emit('dispose', aNode.aValue, aNode.uniqueId)

        return true
    }

    /**
     * @protected
     *
     * @param {String | Function | Object} uniqueId
     *
     * @return {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *} | undefined}
     */
    getNodeIfNotStale_(uniqueId) {
        const aNode = this.itemMap_.get(uniqueId)

        if (!aNode) return undefined

        if (this.isStale_(aNode) === true) {
            this.destroyNode_(aNode)

            return undefined
        }

        return aNode
    }

    /**
     * @private
     *
     * @see #.maxSize
     */
    trim_() {
        if (this.maxSize === Infinity) return

        let aNode = this.pTail_ || this.pHead_

        while (aNode && this.size > this.maxSize) {
            this.destroyNode_(aNode)

            aNode = aNode.lNode
        }
    }

    /**
     * @private
     *
     * @param {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *}} aNode
     *
     * @return {Boolean}
     */
    isStale_(aNode) {
        return aNode.createdOrUpdatedAt !== Infinity && aNode.createdOrUpdatedAt + this.maxAge < Date.now()
    }

    /**
     * Add a Key-Value pair to the Lru Cache.
     *
     * @param {String | Function | Object} uniqueId
     * @param {*} aValue
     *
     * @example
     *
     * const lruCache = new LruCache()
     *
     * lruCache.set('Key-01', 'John Doe')
     * lruCache.set('Key-02', 'Jane Doe')
     */
    set(uniqueId, aValue) {
        let aNode

        // Replace:
        if (this.itemMap_.has(uniqueId) === true) {
            aNode = this.itemMap_.get(uniqueId)

            this.size = this.size - aNode.sizeAttribute
            this.size = this.size + this.sizeCalculator(aValue, uniqueId)

            this.eventEmitter_.emit('dispose', aNode.aValue, aNode.uniqueId)
        }
        else {
            aNode = {
                uniqueId: uniqueId,

                lNode: null,
                rNode: null,

                createdOrUpdatedAt: null,
                aValue: null,

                sizeAttribute: this.sizeCalculator(aValue, uniqueId)
            }

            this.size = this.size + aNode.sizeAttribute
        }

        aNode.createdOrUpdatedAt = Date.now()
        aNode.aValue = aValue

        this.trim_()
        this.unshiftNode_(aNode)

        this.itemMap_.set(uniqueId, aNode)

        return this.size
    }

    /**
     * Check if an item is present within the Cache.
     *
     * @param {String | Function | Object} uniqueId
     *
     * @return {Boolean}
     *
     * @example
     *
     * const lruCache = new LruCache()
     * lruCache.set('Key-01', 'John Doe')
     *
     * lruCache.has('Key-01')
     * >>> true
     *
     * @example
     *
     * const lruCache = new LruCache()
     *
     * lruCache.has('An-Undefined-Key')
     * >>> false
     */
    has(uniqueId) {
        if (this.itemMap_.has(uniqueId) === false) return false

        return !this.isStale_(
            this.itemMap_.get(uniqueId)
        )
    }

    /**
     * Retrieve a value from the Cache by using a Unique Id.
     *
     * @param {String | Function | Object} uniqueId
     *
     * @return {*} If the Key-Value is NOT found, it will return `undefined`.
     *
     * @example
     *
     * const lruCache = new LruCache()
     * lruCache.set('Key-01', 'John Doe')
     *
     * lruCache.get('Key-01')
     * >>> John Doe
     */
    get(uniqueId) {
        const aNode = this.getNodeIfNotStale_(uniqueId)

        if (!aNode) return undefined

        aNode.createdOrUpdatedAt = Date.now()

        this.unshiftNode_(aNode)

        return aNode.aValue
    }

    /**
     * A combination of `#.has`, `#.set` and `#.get`, in an asynchronous manner.
     *
     * @param {String | Function | Object} uniqueId
     * @param {Function} ifNotDefined
     *
     * @return {Promise.<*>}
     *
     * const lruCache = new LruCache()
     *
     * const aValue = await lruCache.getOrCreate('Key-01', async() => {
     *      return new Promise(onResolve => {
     *          setTimeout(async() => {
     *              onResolve('Finished.')
     *          }, 40)
     *      })
     * })
     *
     * aValue.toString()
     * >>> Finished.
     */
    async getOrCreate(uniqueId, ifNotDefined) {
        const aNode = this.getNodeIfNotStale_(uniqueId)

        if (aNode) return aNode.aValue

        const aValue = await ifNotDefined()

        this.set(uniqueId, aValue)

        return aValue
    }

    /**
     * The `#.getOrCreateSync` Function is a combination of `#.has`, `#.set`
     * and `#.get` at once.
     *
     * @param {String | Function | Object} uniqueId
     * @param {Function} ifNotDefined
     *
     * @return {*}
     *
     * @example
     *
     * <caption>
     * The problem with the demonstrated approach is the time between using the
     * `#.has` and `#.get` method. If the `maxAge` parameter would be surpassed,
     * you'll end up with an `undefined` value instead of the expected one.
     *
     * In order to bypass that problem, the `#.getOrCreateSync` Function was
     * introduced. Using this Function instead of coding that routine yourself,
     * you'll certainly end up with the expected value.
     * </caption>
     *
     * const lruCache = new LruCache()
     *
     * if(lruCache.has('Key-01') === false) {
     *     lruCache.set('Key-01', 'Replace with #.getOrCreateSync!')
     * }
     *
     * const aValue = lruCache.get('Key-01')
     *
     * aValue.toString()
     * >>> Replace with #.getOrCreateSync!
     *
     * //
     * // Using the #.getOrCreateSync Function:
     * const lruCache = new LruCache()
     *
     * const aValue = lruCache.getOrCreateSync('Key-01', () => {
     *    return '#.getOrCreateSync'
     * })
     *
     * aValue.toString()
     * >>> #.getOrCreateSync
     */
    getOrCreateSync(uniqueId, ifNotDefined) {
        const aNode = this.getNodeIfNotStale_(uniqueId)

        if (aNode) return aNode.aValue

        const aValue = ifNotDefined()

        this.set(uniqueId, aValue)

        return aValue
    }

    /**
     * Remove a Key-Value pair from the Cache.
     *
     * @param {String | Function | Object} uniqueId
     *
     * @return {Boolean} Whether an item was actually removed from the Cache. It
     *                   will return `false` if the Key-Value pair didn't exist.
     *
     * @example
     *
     * const lruCache = new LruCache()
     * lruCache.set('Key-01', 'John Doe')
     *
     * lruCache.delete('Key-01')
     * >>> true
     *
     * @example
     *
     * const lruCache = new LruCache()
     *
     * lruCache.delete('An-Undefined-Key')
     * >>> false
     */
    delete(uniqueId) {
        return this.destroyNode_(
            this.itemMap_.get(uniqueId)
        )
    }

    /**
     * Iterate through each Node & check `maxAge` value.
     *
     * `O(n)`
     */
    prune() {
        let rNode = this.pHead_.rNode, tNode = null

        while (!(rNode.aValue instanceof NilW8q7dOsP)) {
            if (this.isStale_(rNode) === true) {
                tNode = rNode.rNode

                this.destroyNode_(rNode)

                rNode = tNode
            }
            else {
                rNode = rNode.rNode
            }
        }
    }

    /**
     * Listen to a certain Event. Currently only the "dispose" Event is being
     * emitted.
     *
     * @param {String} eventName
     * @param {Function} aCallback
     *
     * @example
     *
     * const lruCache = new LruCache({maxSize: 1})
     *
     * lruCache.on('dispose', (aValue, uniqueId) => {
     *     console.log(`The value with key ${uniqueId} has been disposed.`)
     * })
     *
     * lruCache.set('Key-01', 'I will be disposed.')
     * lruCache.set('Key-02', 'I will push out Key-01 which will trigger the "dispose" Event.')
     */
    on(eventName, aCallback) {
        this.eventEmitter_.on(eventName, aCallback)
    }

    /**
     * Create an instance of a Lru Cache with statistical Data about the Hit and
     * Miss Ratio for both the `#.has` and `#.get` Method and so on.
     *
     * @param {{maxSize: Number, maxAge: Number}} cacheConfig
     *
     * @return {Recorder}
     *
     * @example
     *
     * const lruCacheWithRecording = LruCache.withRecording()
     *
     * @example
     *
     * <caption>
     * Look at the `#.constructor` Function for detailed information about the
     * `cacheConfig` Object.
     * </caption>
     *
     * const lruCacheWithRecording = LruCache.withRecording({maxSize: 2, maxAge: 60 * 1000})
     */
    static withRecording(cacheConfig = {}) {
        return new Recorder(cacheConfig)
    }
}

/**
 * @class {Recorder}
 */
class Recorder extends LruCache {
    /**
     * @constructor
     *
     * @param {{maxSize: Number, maxAge: Number, sizeCalculator: Function}} cacheConfig
     *
     * @example
     *
     * const lruCacheWithRecording = LruCache.withRecording()
     *
     * @example
     *
     * <caption>
     * Or with a `cacheConfig` Object. Look at the `#.constructor` of the Lru
     * Cache for more detailed information.
     * </caption>
     *
     * const lruCacheWithRecording = LruCache.withRecording({maxSize: 2, magAge: 60 * 1000})
     */
    constructor(cacheConfig) {
        super(cacheConfig)

        this.hasHitCount = 0
        this.hasMissCount = 0

        this.hasHitMissRatio = 0

        this.getHitCount = 0
        this.getMissCount = 0

        this.getHitMissRatio = 0

        this.nrDefined = 0
        this.nrDisposed = 0

        this.on('dispose', () => this.nrDisposed++)
    }

    /**
     * @private
     *
     * @param {Number} hitOrMiss
     * @param {String} functionName
     */
    _hitOrMiss(hitOrMiss, functionName) {
        const hitName = functionName + 'HitCount', missName = functionName + 'MissCount'

        hitOrMiss > 0 ? this[hitName]++ : this[missName]++

        this[functionName + 'HitMissRatio'] = this[hitName] / (this[hitName] + this[missName])
    }

    /**
     * @param {String | Function | Object} uniqueId
     */
    has(uniqueId) {
        const aNode = super.getNodeIfNotStale_(uniqueId)

        if (aNode) {
            this._hitOrMiss(+1, 'has')

            return true
        }
        else {
            this._hitOrMiss(-1, 'has')

            return false
        }
    }


    /**
     * @param {String | Function | Object} uniqueId
     */
    get(uniqueId) {
        const aNode = super.getNodeIfNotStale_(uniqueId)

        if (aNode) {
            this._hitOrMiss(+1, 'get')

            return aNode.aValue
        }
        else {
            this._hitOrMiss(-1, 'get')

            return undefined
        }
    }

    /**
     * @param {String | Function | Object} uniqueId
     * @param {*} aValue
     *
     * @return {Number}
     */
    set(uniqueId, aValue) {
        this.nrDefined++

        return super.set(uniqueId, aValue)
    }
}

module.exports = LruCache