require('proof')(5, async (okay) => {
    const Future = require('../future')
    {
        const future = new Future
        future.resolve()
        const result = await future.promise
        okay(result === undefined, 'resolve empty value')
    }
    {
        const future = new Future
        future.resolve(1)
        const result = await future.promise
        okay(result, 1, 'resolve')
    }
    {
        const test = []
        const future = new Future
        future.resolve(new Error('reject'))
        try {
            await future.promise
        } catch (error) {
            test.push(error.message)
        }
        okay(test, [ 'reject' ], 'reject')
    }
    {
        const future = new Future
        future.resolve(null, 1)
        const result = await future.promise
        okay(result, 1, 'resolve error-first callback')
    }
    {
        const test = []
        const future = new Future
        future.resolve(new Error('reject'), null)
        try {
            await future.promise
        } catch (error) {
            test.push(error.message)
        }
        okay(test, [ 'reject' ], 'reject error-first callbackreject')
    }
})
