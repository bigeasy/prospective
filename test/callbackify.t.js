require('proof')(4, function (okay, callback) {
    const callbackify = require('../callbackify')

    const test = callbackify(async function (array) {
        if (array == null) throw new Error('error')
        return array
    })

    test([], function (...vargs) {
        okay(vargs, [], 'no return')
        test([ 1, 2 ], function (...vargs) {
            okay(vargs, [ null, 1, 2 ], 'multi return')
            test(null, function (error, ...vargs) {
                okay(error.message, 'error', 'errored')
                okay(vargs, [], 'no error return')
                callback()
            })
        })
    })
})
