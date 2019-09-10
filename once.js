const assert = require('assert')

class Once {
    constructor (ee, events, errored, named, argc) {
        this._resolved = false
        this._listeners = []
        this.promise = new Promise((resolve, reject) => {
            const resolver = name => {
                const listener = {
                    name: name,
                    f: function (...vargs) {
                        unlisten()
                        if (named) {
                            vargs.unshift(name)
                        }
                        var vargs = []
                        vargs.push.apply(vargs, arguments)
                        resolve(vargs)
                    }
                }
                this._listeners.push(listener)
                return listener.f
            }
            this._rejector = error => {
                unlisten()
                if (argc == 3) {
                    resolve(errored)
                } else {
                    reject(error)
                }
            }
            const unlisten = () => {
                const listeners = this._listeners.splice(0)
                listeners.forEach(listener => ee.removeListener(listener.name, listener.f))
                ee.removeListener('error', this._rejector)
            }
            events.forEach(e => ee.on(e, resolver(e)))
            ee.on('error', this._rejector)
            this._resolve = resolve
            this._reject = reject
        })
    }

    resolve (name, ...vargs) {
        assert.equal(typeof name, 'string', 'resolve requires an event name')
        if (this._listeners.length != 0) {
            for (const listener of this._listeners) {
                if (listener.name == name) {
                    listener.f.apply(null, vargs)
                    break
                }
            }
            assert.equal(this._listeners.length, 0, `no listener for ${name}`)
        }
    }

    reject (...vargs) {
        if (this._listeners.length != 0) {
            this._rejector.apply(null, vargs)
        }
    }
}

module.exports = function (ee, events, errored) {
    return new Once(ee, Array.isArray(events) ? events : [ events ], errored, Array.isArray(events), arguments.length)
}

module.exports.NULL = {
    resolve: (name) => {
        assert.equal(typeof name, 'string', 'resolve requires an event name')
    },
    reject: () => {}
}
