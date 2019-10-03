require('proof')(7, async (okay) => {
    const Latch = require('../latch')
    {
        let _resolve = null
        const test = []
        const promise = new Promise(resolve => _resolve = resolve)
        const latch = new Latch().then(promise)
        latch.await((error, result) => test.push({ error, result }))
        _resolve(1)
        await promise
        okay(test, [{ error: null, result: 1 }], 'invoke on resolve')
    }
    {
        let _reject = null
        const test = []
        const promise = new Promise((resolve, reject) => _reject = reject)
        const latch = new Latch().then(promise)
        latch.await((error, result) => test.push(error.message))
        _reject(new Error('error'))
        try {
            await promise
        } catch (error) {
        }
        okay(test, [ 'error' ], 'invoke on reject')
    }
    {
        let _reject = null
        const test = []
        const promise = new Promise((resolve, reject) => _reject = reject)
        const latch = new Latch().then(promise)
        latch.await((error, result) => test.push(error.message))
        _reject(new Error('error'))
        try {
            await promise
        } catch (error) {
        }
        okay(test, [ 'error' ], 'await reject')
    }
    {
        const test = []
        const latch = new Latch()
        latch.unlatch(null, 1)
        latch.await((error, result) => test.push({ error, result }))
        okay(test, [{ error: null, result: 1 }], 'invoke unlatched')
    }
    {
        const test = []
        const latch = new Latch()
        latch.await((error, result) => test.push({ error, result }))
        const f = latch.await((error, result) => test.push({ error, result }))
        okay(latch.cancel(f) === f, 'cancel')
        okay(latch.cancel(f) === null, 'cancel not found')
        latch.unlatch(null, 1)
        okay(test, [{ error: null, result: 1 }], 'cancel')
    }
})
