class Sub extends Promise {
    constructor (executor) {
        let _resolve, _reject
        super((resolve, reject) => {
            [ _resolve, _reject ] = [ resolve, reject ]
            return executor(resolve, reject)
        })
        this._resolve = _resolve
        this._reject = _reject
    }

    /*
    then (fulfilled, rejected) {
        const returnValue = super.then(fulfilled, rejected)
        return returnValue
    }
    */
}

console.log('before')
const sub = new Sub((resolve, reject) => setImmediate(resolve))
console.log('after')

sub.then(() => console.log('then'))
return

class LifeUniverseEverythingPromise extends Promise{
    constructor(){ super(resolve=> resolve(42)) }
}

const lue = new LifeUniverseEverythingPromise(resolve => resolve())

lue.then(() => {})
