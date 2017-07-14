[![Build Status](https://travis-ci.org/airliti/estructura.svg?branch=master)](https://travis-ci.org/airliti/estructura)

# Estructura

Data Structures written in JavaScript for Node.js

**Please feel free to open an Issue for Features, new Data Structures etc.**

----

## Overview

* [Deque](https://github.com/airliti/estructura/wiki/Deque)

* [Double Linked List](https://github.com/airliti/estructura/wiki/Double-Linked-List)

* [Heap](https://github.com/airliti/estructura/wiki/Heap)

* [Lru Cache](https://github.com/airliti/estructura/wiki/Lru-Cache)

* [Queue](https://github.com/airliti/estructura/wiki/Queue)

* [Stable Heap](https://github.com/airliti/estructura/wiki/Stable-Heap)

----

## Installation

```
npm install estructura --save
```

----

## Testing & Code Coverage

```
git clone https://github.com/airliti/estructura.git
```

The repository on GitHub is only containing the code which is using the latest
version of JavaScript. But to keep it compatible with at least Node.js version 
6.10.2, Grunt and Babel are being used to transpile the code to valid EcmaScript 
2015 code.

```
npm install
```

The `npm install` command will install Babel and Grunt for the ES6 version of
Estructura. Then execute the `grunt build` command to create the `package` used
for the NPM release.

```
grunt build
```

Go to the newly created `package` folder and run the `npm install` command to
install Mocha, Chai and Istanbul.

```
cd package

npm install
```

If you just want to verify whether the `src` code is working. Go to that directory
and install the `devDependencies` and `dependencies` with:

```
cd src

npm install
```

Once you've chosen either the `src` or `package` version, go to that specific
folder and execute the Unit Tests with:

```
npm test
```

And to get a report on Code Coverage, use:

```
npm run coverage
```