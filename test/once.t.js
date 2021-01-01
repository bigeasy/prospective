require('proof')(6, async (okay) => {
    const once = require('../once')
    const events = require('events')
    {
        const ee = new events.EventEmitter
        const p = once(ee, 'event')
        ee.emit('event', 1, 2)
        const [ one, two ] = await p.promise
        okay({ one, two }, { one: 1, two: 2 }, 'resolve event')
    }
    {
        const ee = new events.EventEmitter
        const p = once(ee, [ 'event', 'other' ])
        ee.emit('event', 1, 2)
        const [ name, one, two ] = await p.promise
        okay({ name, one, two }, { name: 'event', one: 1, two: 2 }, 'set of events')
    }
    {
        const ee = new events.EventEmitter
        const p = once(ee, 'event').promise
        const test = []
        ee.emit('error', new Error('error'))
        try {
            await p
        } catch (error) {
            test.push(error.message)
        }
        okay(test, [ 'error' ], 'reject')
    }
    {
        const ee = new events.EventEmitter
        const p = once(ee, 'event', null)
        ee.emit('error', new Error('error'))
        okay(await p.promise, null, 'convert rejection')
    }
    {
        const ee = new events.EventEmitter
        const p = once(ee, [ 'skip', 'event' ], null)
        p.resolve('event', 1)
        okay(await p.promise, [ 'event', 1 ], 'cancel with resolve')
        p.resolve('event', 1)
    }
    {
        const ee = new events.EventEmitter
        const p = once(ee, 'event', null)
        p.reject(new Error('thrown'))
        okay(await p.promise, null, 'cancel with rejection')
        p.reject(new Error('thrown'))
    }
    {
        once.NULL.resolve('event')
        once.NULL.reject()
    }
})
