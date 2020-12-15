module.exports = function (msg) {
    const startTime = Date.now()
    msg.channel.createMessage('🏓 Pong!').then(m => {
        const restLatency = Date.now() - startTime
        m.edit(`🏓 Pong! | REST: ${restLatency}ms - Gateway: ${msg._client.shards.get(0).latency}ms`)
    })
}