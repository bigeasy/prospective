module.exports = function (ee, event, errored) {
    var argc = arguments.length
    return new Promise((resolve, reject) => {
        const listeners = []
        function resolver (name) {
            const listener = {
                name: name,
                f: function (...vargs) {
                    unlisten()
                    if (Array.isArray(event)) {
                        vargs.unshift(name)
                    }
                    var vargs = []
                    vargs.push.apply(vargs, arguments)
                    resolve(vargs)
                }
            }
            listeners.push(listener)
            return listener.f
        }
        function rejector (error) {
            unlisten()
            if (argc == 3) {
                resolve(errored)
            } else {
                reject(error)
            }
        }
        function unlisten () {
            listeners.forEach(listener => ee.removeListener(listener.name, listener.f))
            ee.removeListener('error', rejector)
        }
        const events = Array.isArray(event) ? event : [ event ]
        events.forEach(event => ee.on(event, resolver(event)))
        ee.on(event, resolver)
        ee.on('error', rejector)
    })
}
