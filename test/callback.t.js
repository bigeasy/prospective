require('proof')(2, async (okay) => {
    const callback = require('../callback')
    {
        const [ one, two ] = await callback((callback) => callback(null, 1, 2))
        okay({ one, two }, { one: 1, two: 2 }, 'resolve callback')
    }
    {
        const test = []
        try {
            await callback((callback) => callback(new Error('error')))
        } catch (error) {
            test.push(error.message)
        }
        okay(test, [ 'error' ], 'reject callback')
    }
})
