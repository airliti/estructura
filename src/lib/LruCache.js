const EventEmitter = require('events')

/**
 * @class {LruCache}
 */
class LruCache {
    /**
     * @constructor
     *
     * @param {{maxSize: Number, maxAge: Number}} cacheConfig
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
        /**
         * The maximum size of the Lru Cache.
         *
         * @type {Number}
         *
         * @default Infinity
         */
        this._maxSize = cacheConfig.maxSize || Infinity

        Object.defineProperty(this, 'maxSize', {
            get: () => this._maxSize,
            set: (newValue) => {
                this._maxSize = newValue, this._trim()
            }
        })

        /**
         * Used to calculate the size of each item within the Cache.
         *
         * @type {Function}
         *
         * @default function() { return 1 }
         */
        this.sizeCalculator = cacheConfig.sizeCalculator || function () {
            return 1
        }

        /**
         * The maximum age of an item in the Cache, defined in Milliseconds.
         *
         * @type {Number}
         *
         * @default Infinity
         */
        this._maxAge = cacheConfig.maxAge || Infinity

        Object.defineProperty(this, 'maxAge', {
            get: () => this._maxAge,
            set: (newValue) => {
                this._maxAge = newValue, this.prune()
            }
        })

        /**
         * @private
         *
         * @type {Map}
         */
        this._itemMap = new Map()

        /**
         * @private
         *
         * @type {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *}}
         */
        this._headNode = null

        /**
         * @private
         *
         * @type {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *}}
         */
        this._tailNode = null

        /**
         * @private
         *
         * @type {EventEmitter}
         */
        this._eventEmitter = new EventEmitter()

        /**
         * The total size of the Lru Cache.
         *
         * @type {Number}
         */
        this.size = 0
    }

    /**
     * @private
     *
     * @param {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *}} aNode
     */
    _unshiftNode(aNode) {
        if (aNode === this._headNode) return

        //
        // +---+---+---+---+---+
        // | N | A | B | C | N |
        // +---+---+---+---+---+
        //
        // N: null
        //
        // Case 1: Unshift B
        //
        // if ( A ) A.rNode = C
        // if ( C ) C.lNode = A
        //
        // Case 2: Unshift A
        //
        // if ( N ) -> null
        // if ( B ) B.lNode = null
        //
        // Case 3: Unshift C
        //
        // if ( B ) B.rNode = null
        // if ( N ) -> null
        //
        if (aNode.lNode) aNode.lNode.rNode = aNode.rNode
        if (aNode.rNode) aNode.rNode.lNode = aNode.lNode

        //
        // +---+---+---+---+---+
        // | N | A | B | C | N |
        // +---+---+---+---+---+
        //
        // -> C has to become A. The new Tail is B.
        //
        if (aNode === this._tailNode) this._tailNode = aNode.lNode

        //
        // +---+---+---+---+---+
        // | N | A | B | C | N |
        // +---+---+---+---+---+
        //
        // -> B has to become A. Point the "lNode" of A to B.
        //
        if (this._headNode) this._headNode.lNode = aNode

        //
        // +---+---+---+---+---+
        // | N | A | B | C | N |
        // +---+---+---+---+---+
        //
        // -> B has to become A. The Head cannot have a "lNode"; but it can point
        //    to A as "rNode";
        //
        aNode.lNode = null
        aNode.rNode = this._headNode

        this._headNode = aNode

        //
        // +---+---+---+---+---+
        // | N | A | N | N | N |
        // +---+---+---+---+---+
        //
        // -> Add B. B does NOT exist. A has to become the Tail of the Cache.
        //
        if (!this._tailNode) this._tailNode = this._headNode.rNode
    }

    /**
     * @private
     *
     * @param {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *}}
     */
    _unlinkNode(aNode) {
        if (aNode.lNode) aNode.lNode.rNode = aNode.rNode
        if (aNode.rNode) aNode.rNode.lNode = aNode.lNode

        if (aNode === this._headNode) this._headNode = aNode.rNode
        if (aNode === this._tailNode) this._tailNode = aNode.lNode
    }

    /**
     * @private
     *
     * @param {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *} | undefined} aNode
     *
     * @return {Boolean}
     */
    _destroyNode(aNode) {
        //
        // Delete the Node from the #._itemMap. If it is NOT present within the Map,
        // return "false";
        //
        // @see #._itemMap
        //
        if (typeof aNode !== 'object' || this._itemMap.delete(aNode.uniqueId) === false) return false

        //
        // @type {Number}
        //
        this.size = this.size - aNode.calculatedSize

        //
        // Remove the Node from the Double Linked List and manage the Reference(s)
        // from and to the Node.
        //
        // @see #._unlinkNode
        //
        this._unlinkNode(aNode)

        //
        // Use the Event Emitter to broadcast an Event to the interested who can
        // then take action based on the disposed value and "uniqueId";
        //
        // @see #._eventEmitter
        //
        this._eventEmitter.emit('dispose', aNode.aValue, aNode.uniqueId)

        return true
    }

    /**
     * @protected
     *
     * @param {String | Function | Object} uniqueId
     *
     * @return {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *} | undefined}
     */
    _getNodeIfNotStale(uniqueId) {
        const aNode = this._itemMap.get(uniqueId)

        if (!aNode) return undefined

        //
        // @see maxAge
        //
        if (this._isStale(aNode) === true) {
            //
            // @see #._destroyNode
            //
            this._destroyNode(aNode)

            return undefined
        }

        return aNode
    }

    /**
     * @private
     *
     * @see #.maxSize
     */
    _trim() {
        if (this.maxSize === Infinity) return

        //
        // @type {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *} | undefined}
        //
        let aNode = this._tailNode || this._headNode

        while (aNode && this.size > this.maxSize) {
            this._destroyNode(aNode)

            aNode = aNode.lNode
        }
    }

    /**
     * @private
     *
     * @param {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *}}
     *
     * @return {Boolean}
     */
    _isStale(aNode) {
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
        //
        // @type {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *}}
        //
        let aNode

        //
        // The current "uniqueId" is already defined within the Cache, dispose the
        // item but keep the Node, we'll #.unshift it.
        //
        if (this._itemMap.has(uniqueId) === true) {
            aNode = this._itemMap.get(uniqueId)

            this.size = this.size - aNode.calculatedSize
            this.size = this.size + this.sizeCalculator(aValue, uniqueId)

            this._eventEmitter.emit('dispose', aNode.aValue, aNode.uniqueId)
        }
        else {
            aNode = {
                uniqueId: uniqueId,

                lNode: null,
                rNode: null,

                createdOrUpdatedAt: null,
                aValue: null,

                calculatedSize: this.sizeCalculator(aValue, uniqueId)
            }

            this.size = this.size + aNode.calculatedSize
        }

        // 
        // @type {Number}
        //
        aNode.createdOrUpdatedAt = Date.now()

        // 
        // @type {*}
        //
        aNode.aValue = aValue

        //
        // Modify the Cache to account for the new size.
        //
        this._trim()

        //
        // Replace the Head with the newest Node within the Least Recently Used
        // Cache.
        //
        this._unshiftNode(aNode)

        //
        // Assign the new Node to the Map for fast access later on through the
        // #.get Method.
        //
        this._itemMap.set(uniqueId, aNode)
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
        if (this._itemMap.has(uniqueId) === false) return false

        //
        // Check if the item didn't surpass the "maxAge" and then negate the output
        // from the #._isStale method.
        //
        return !this._isStale(
            this._itemMap.get(uniqueId)
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
        const aNode = this._getNodeIfNotStale(uniqueId)

        if (!aNode) return undefined

        //
        // Update the Time Stamp, point to the new "createdOrUpdatedAt" Date.
        //
        // @type {Number}
        //
        aNode.createdOrUpdatedAt = Date.now()

        this._unshiftNode(aNode)

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
        const aNode = this._getNodeIfNotStale(uniqueId)

        if (aNode) return aNode.aValue

        //
        // @type {*}
        //
        const aValue = await ifNotDefined()

        //
        // Store the newly created value within the Cache.
        //
        // @see #.set
        //
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
        const aNode = this._getNodeIfNotStale(uniqueId)

        if (aNode) return aNode.aValue

        //
        // Use the supplied Function to generate the new value.
        //
        // @type {*}
        //
        const aValue = ifNotDefined()

        //
        // @see #.set
        //
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
        return this._destroyNode(
            this._itemMap.get(uniqueId)
        )
    }

    /**
     * Actively iterate through each Node and check whether the "maxAge" hasn't
     * surpassed.
     *
     * `O(n)`
     */
    prune() {
        //
        // @type {{uniqueId: (String | Function | Object), lNode: *, rNode: *, createdOrUpdatedAt: Number, aValue: *}}
        //
        let curNode = this._headNode

        while (curNode) {
            if (this._isStale(curNode) === true) this._destroyNode(curNode)

            curNode = curNode.rNode
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
        this._eventEmitter.on(eventName, aCallback)
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
     * @param {{maxSize: Number, maxAge: Number}}
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

        /**
         * Updated when the `#.has` Function returned `true`.
         *
         * @type {Number}
         */
        this.hasHitCount = 0

        /**
         * Incremented when the `#.has` Function returned `false`.
         *
         * @type {Number}
         */
        this.hasMissCount = 0

        /**
         * Equal to `this.hasHitCount / (this.hasHitCount + this.hasMissCount)`.
         *
         * @type {Number}
         */
        this.hasHitMissRatio = 0

        /**
         * Count whenever an item was found using the `#.get` Function.
         *
         * @type {Number}
         */
        this.getHitCount = 0

        /**
         * Count whenever the `#.get` Function returned `undefined` because an
         * item was NOT present within the Cache.
         *
         * @type {Number}
         */
        this.getMissCount = 0

        /**
         * A percentage based on the Hit and Miss Count.
         *
         * @type {Number}
         */
        this.getHitMissRatio = 0

        /**
         * Count the usage of the `#.set` Function.
         *
         * @type {Number}
         */
        this.nrDefined = 0

        /**
         * Count the usage of the disposed Event.
         *
         * @type {Number}
         */
        this.nrDisposed = 0

        this.on('dispose', () => this.nrDisposed++)
    }

    /**
     * @private
     *
     * @param {Number} hitOrMiss
     */
    _hitOrMiss(hitOrMiss, functionName) {
        const hitName = functionName + 'HitCount', missName = functionName + 'MissCount'

        hitOrMiss > 0 ? this[hitName]++ : this[missName]++

        //
        // Update the "getHitMissRatio" with the newly calculated Hit and Miss
        // Ratio.
        //
        // @type {Number}
        //
        this[functionName + 'HitMissRatio'] = this[hitName] / (this[hitName] + this[missName])
    }

    /**
     * @param {String | Function | Object} uniqueId
     */
    has(uniqueId) {
        const aNode = super._getNodeIfNotStale(uniqueId)

        //
        // Update the `hasHitCount`, `hasMissCount` and the value of `hasHitMissRatio`
        // according to whether `aNode` has been found.
        //
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
        const aNode = super._getNodeIfNotStale(uniqueId)

        //
        // Update the value of `getHitCount`, `getMissCount` and `getHitMissRatio`
        // according to whether `aNode` is an Object containing an usable value.
        //
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
     */
    set(uniqueId, aValue) {
        this.nrDefined++

        super.set(uniqueId, aValue)
    }
}

module.exports = LruCache