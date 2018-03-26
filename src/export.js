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
 * @type {SinglyLinkedList}
 */
moduleMapping.SinglyLinkedList = require('./lib/SinglyLinkedList')

/**
 * @type {StableHeap}
 */
moduleMapping.StableHeap = require('./lib/StableHeap')

moduleMapping.StableMinHeap = moduleMapping.StableHeap.MinHeap
moduleMapping.StableMaxHeap = moduleMapping.StableHeap.MaxHeap

/**
 * @type {SkipList}
 */
moduleMapping.SkipList = require('./lib/SkipList')

module.exports = moduleMapping