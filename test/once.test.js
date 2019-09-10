describe('once', () => {
    const assert = require('assert')
    const once = require('../once')
    const events = require('events')
    it('can return an event', async () => {
        const ee = new events.EventEmitter
        const p = once(ee, 'event')
        ee.emit('event', 1, 2)
        const [ one, two ] = await p.promise
        assert.deepStrictEqual({ one, two }, { one: 1, two: 2 }, 'once')
    })
    it('can can match any one event', async () => {
        const ee = new events.EventEmitter
        const p = once(ee, [ 'event', 'other' ])
        ee.emit('event', 1, 2)
        const [ one, two ] = await p.promise
        assert.deepStrictEqual({ one, two }, { one: 1, two: 2 }, 'once')
    })
    it('can throw an error', async () => {
        const ee = new events.EventEmitter
        const p = once(ee, 'event').promise
        const test = []
        ee.emit('error', new Error('error'))
        try {
            await p
        } catch (error) {
            test.push(error.message)
        }
        assert.deepStrictEqual(test, [ 'error' ], 'once')
    })
    it('can catch an error', async () => {
        const ee = new events.EventEmitter
        const p = once(ee, 'event', null)
        ee.emit('error', new Error('error'))
        assert.equal(await p.promise, null, 'caught')
    })
    it('can cancel with resolution', async () => {
        const ee = new events.EventEmitter
        const p = once(ee, [ 'skip', 'event' ], null)
        p.resolve('event', 1)
        assert.equal(await p.promise, 1, 'cancel with resolve')
        p.resolve('event', 1)
    })
    it('can cancel with rejection', async () => {
        const ee = new events.EventEmitter
        const p = once(ee, 'event', null)
        p.reject(new Error('thrown'))
        assert.equal(await p.promise, null, 'cancel with rejection')
        p.reject(new Error('thrown'))
    })
    it('can provide a NULL once', () => {
        once.NULL.resolve('event')
        once.NULL.reject()
    })
})
