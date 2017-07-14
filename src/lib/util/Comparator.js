/**
 * A default comparison `Function`. Sort each item in an ascending manner.
 *
 * @param {*} itemA
 * @param {*} itemB
 *
 * @return {Number}
 */
const defaultComparator = (itemA, itemB) => {
    if (itemA > itemB) return +1
    if (itemA < itemB) return -1

    return 0
}

/**
 * Negate the result from the default comparison `Function`. Used to sort in a
 * descending fashion.
 *
 * @param {*} itemA
 * @param {*} itemB
 *
 * @return {Number}
 */
const negatedComparator = (itemA, itemB) => -defaultComparator(itemA, itemB)

module.exports = {
    defaultComparator: defaultComparator, negatedComparator: negatedComparator
}