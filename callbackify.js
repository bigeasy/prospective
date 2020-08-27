function callbackify (f) {
    return function (...vargs) {
        const callback = vargs.pop()
        f.apply(this, vargs)
            .then(vargs => {
                if (vargs.length == 0) {
                    callback()
                } else {
                    callback.apply(null, [ null ].concat(vargs))
                }
            })
            .catch(error => callback(error))
    }
}

module.exports = callbackify
