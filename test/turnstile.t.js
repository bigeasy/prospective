require('proof')(2, async (okay) => {
    const Turnstile = require('../turnstile')
    {
        okay(new Turnstile != null, 'constructed')
    }
    {
        const turnstile = new Turnstile
        const promise = turnstile.enter()
        turnstile.twist(1)
        okay(await promise, 1, 'pass through')
        turnstile.twist(1)
    }
})
