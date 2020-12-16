const { exec } = require('child_process')
const config = require('../../config.json')

module.exports = async function (msg) {
  if (!msg.member.permission.has('administrator')) {
    return msg.channel.createMessage('haha no')
  }

  const cmd = msg.content.slice(config.discord.prefix.length + 4)
  if (!cmd) {
    return msg.channel.createMessage('do you want me to run `rm -fr /`?')
  }

  const m = await msg.channel.createMessage('<a:loading:788845427072040991> Computing...')
  const start = Date.now()

  exec(cmd, async (e, out, err) => {
    const result = e ? err : out

    const processing = ((Date.now() - start) / 1000).toFixed(2)
    if (result.length > 1900) {
    //   const res = await fetch('https://haste.powercord.dev/documents', { method: 'POST', body: result }).then(r => r.json())
    //   m.edit(`Result too long for Discord: <https://haste.powercord.dev/${res.key}.txt>\nTook ${processing} seconds.`)
      m.edit(`Result too long for Discord\nTook ${processing} seconds.`)
    } else {
      m.edit(`\`\`\`\n${result}\n\`\`\`\nTook ${processing} seconds.`)
    }
  })
}