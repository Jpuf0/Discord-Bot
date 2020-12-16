const { inspect } = require('util');
const fetch = require('node-fetch')
const config = require('../../config.json')

module.exports = async function (msg) {
    if(!msg.member.permission.has('administrator')){
        return msg.channel.createMessage('hahaha no')
    }

    const script = msg.content.slice(config.discord.prefix.length + 5)
    if(!script) {
        return msg.channel.createMessage('bitch what?')
    }

    const m = await msg.channel.createMessage('<a:loading:788523039892439051> brrr...')
    const start = Date.now();

    let js = `const bot = msg._client; const mongo = bot.mongo; ${script}`;
    if(js.includes('await')) js = `(async () => { ${script} })()`
    let result
    try{
        result = await eval(js)
    } catch (err) {
        result = err
    }

    const plsNoSteal = RegExp(`${config.discord.clientSecret}|${config.discord.token}`)
    result = inspect(result, { depth: 1 }).replace(plsNoSteal, 'hahahaha no')
    const processing = ((Date.now() - start) / 1000).toFixed(2)
    if (result.length > 1900) {
        // const res = await fetch('https://haste.jpuf.xyz/documents', { method: 'POST', body: result}).then(r => r.json())
        // m.edit(`Result too long for Discord: <https://haste.jpuf.xyz/${res.key}.js\nTook ${processing} seconds.`)
        m.edit(`Result too long for Discord\nTook ${processing} seconds.`)
    } else {
        m.edit(`\`\`\`js\n${result}\n\`\`\`\nTook ${processing} seconds.`)
    }
}