/**
 * Ascending.
 *
 * @param {*} itemA
 * @param {*} itemB
 *
 * @return {Number}
 */
const compareFnAscending = (itemA, itemB) => {
    if (itemA > itemB) return +1
    if (itemA < itemB) return -1

    return 0
}

/**
 * Descending.
 *
 * @param {*} itemA
 * @param {*} itemB
 *
 * @return {Number}
 */
const compareFnDescending = (itemA, itemB) => {
    if (itemA > itemB) return -1
    if (itemA < itemB) return +1

    return 0
}

module.exports = {
    compareFnAscending: compareFnAscending, compareFnDescending: compareFnDescending
}