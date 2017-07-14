/**
 * ! Note: for performance, just include the required Object instead of using
 *     the "export.js" file.
 */

const moduleMapping = {}

/**
 * @type {CircularBuffer}
 */
moduleMapping.CircularBuffer = require('./lib/CircularBuffer')

/**
 * @type {Deque}
 */
moduleMapping.Deque = require('./lib/Deque')

/**
 * @type {DoubleLinkedList}
 */
moduleMapping.DoubleLinkedList = require('./lib/DoubleLinkedList')

/**
 * @type {Heap}
 */
moduleMapping.Heap = require('./lib/Heap')

moduleMapping.MinHeap = moduleMapping.Heap.MinHeap
moduleMapping.MaxHeap = moduleMapping.Heap.MaxHeap

/**
 * @type {LruCache}
 */
moduleMapping.LruCache = require('./lib/LruCache')

/**
 * @type {Queue}
 */
moduleMapping.Queue = require('./lib/Queue')

/**
 * @type {StableHeap}
 */
moduleMapping.StableHeap = require('./lib/StableHeap')

moduleMapping.StableMinHeap = moduleMapping.StableHeap.MinHeap
moduleMapping.StableMaxHeap = moduleMapping.StableHeap.MaxHeap

module.exports = moduleMapping