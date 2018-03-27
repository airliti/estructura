2018-03-27 airliti

    * #.push, #.pop and #.shift Circular Buffer testing

    * Enhanced performance for the Heap

2018-03-26 0.1.7 airliti

    * Released version 0.1.7 on Npm

2018-03-26 airliti

    * Renamed the Single Linked List to Singly Linked List

    * Basic implementation of a Skip List

2018-03-25 airliti

    * Convention
    
    * Simpler implementation for the Lru Cache ( namely, the internal Doubly Linked List )

2018-03-24 airliti

    * #.peekFront as an alias for #.peek

    * #.constructor testing for the Circular Buffer

    * Implementation of a Single Linked List

    * Renamd Double Linked List to Doubly Linked List, but using `require('estructura/double-linked-list')`
      will continue to work ( for the moment )

2018-03-09 airliti

    * Updated travis.yml to include newer Node.js versions and .gitignore to exclude
      package-lock.json

2017-07-14 airliti

    * #.sizeCalculator for the Lru Cache

2017-05-15 0.1.6 airliti

    * Version 0.1.6 released on Npm

    * Adding a Circular Buffer

2017-04-21 airliti

    * Verifying #.hasHitCount, #.hasMissCount, #.getHitCount and #.getMissCount
      used by the Recorder for the Lru Cache

2017-04-19 airliti

    * Documentation for the Recorder attached to the Lru Cache

2017-04-16 airliti

    * Added the documentation for the Deque, Double Linked List, Heap, Lru Cache,
      Queue and Stable Heap immediatly to the `src`

2017-04-04 airliti

    * Transpiling with Babel

    * #.getOrCreate and #.getOrCreateSync for the Lru Cache

2017-04-03 airliti

    * Verification of the #.peek method used by the Double Linked List was pointing
      to the #.peekBack method
      
    * Tested whether the #.peekBack method is becoming an alias for the #.peek
      method when only one item is present within the Double Linked List
          
    * Rewritten the #.set method for the Lru Cache
    
    * Basic implementation of a Recorder for the Lru Cache

2017-04-02 0.1.4 airliti

    * Released version 0.1.4 on Npm
    
    * Added a #.on('dispose') event to the Lru Cache
    
    * The Lru Cache is now automatically being resized when the #.maxSize is 
      adjusted
    
    * When the #.maxAge value is modified, the Lru Cache will activate the #.prune
      method to dispose old data

2017-04-02 0.1.3 airliti

    * Released version 0.1.3 on Npm

    * Updated the Lru Cache

2017-04-02 0.1.2 airliti

    * The #.size value used by the Lru Cache wasn't updated when the #.get method 
      discarded an item because it surpassed the `maxAge` value

    * Added a #.prune method to the Lru Cache

2017-04-01 0.1.1 airliti

    * Version 0.1.1 on Npm

    * Rewritten each and every Unit Test
    
    * Further enhanced the Lru Cache with a #.has and #.delete method

2017-03-31 airliti

    * Removed the #.concat from the Deque, Heap and Double Linked List

    * A basic implementation of a Least Recently Used Cache

2017-03-30 airliti

    * Added the MIT License for the Project in LICENSE.md and package.json

2017-03-29 airliti

    * #.peek and #.peekBack for the Deque and Double Linked List

2017-03-27 0.1.0 airliti

    * Version 0.1.0 released on Npm

    * Added a Deque or Double-Ended Queue
    
    * Introduced the Double Linked List
    
    * Created the Stable Heap based on the Heap
    
    * The offset wasn't taken into account when a Queue was being converted to an 
      Array resulting in `null` values
    
    * Queue
    
    * Added a Heap