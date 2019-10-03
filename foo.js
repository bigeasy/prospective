const promise = require('./latch').latch

async function main () {
    const [ exit, exited ] = promise()
    setTimeout(exited.resolve, 1000)
    await exit
    console.log('exited')
}

main()
