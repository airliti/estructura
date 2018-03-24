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
 * @type {DoublyLinkedList}
 */
moduleMapping.DoubleLinkedList = require('./lib/DoublyLinkedList')
moduleMapping.DoublyLinkedList = require('./lib/DoublyLinkedList')

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
 * @type {SingleLinkedList}
 */
moduleMapping.SingleLinkedList = require('./lib/SingleLinkedList')

/**
 * @type {StableHeap}
 */
moduleMapping.StableHeap = require('./lib/StableHeap')

moduleMapping.StableMinHeap = moduleMapping.StableHeap.MinHeap
moduleMapping.StableMaxHeap = moduleMapping.StableHeap.MaxHeap

module.exports = moduleMapping