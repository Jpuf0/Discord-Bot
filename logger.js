const config = require('./config.json')
const { humanTime } = require('./utils')

const zws = '\u200B'
const template = `
Message deleted in <#$channelId>
Author: $username#$discrim ($userId; <@$userId>)
Timestamp: $time ($duration ago)
Message contents: \`\`\`
$message
\`\`\`
`.trim()

module.exports = {
  register (bot) {
    bot.on('messageDelete', (msg) => {
      if (!msg.author || msg.channel.guild.id !== config.discord.ids.serverID || msg.author.bot) {
        return // Message not cached; let's just ignore
      }

      const cleanMessage = msg.cleanContent.replace(/`/g, `\`${zws}`)
      const cleanUsername = msg.author.username.replace(/@/g, `@${zws}`).replace(/`/g, `\`${zws}`)
      const time = new Date(msg.timestamp)
      bot.createMessage(config.discord.ids.channelMessageLogs, template
        .replace('$channelId', msg.channel.id)
        .replace('$username', cleanUsername)
        .replace('$discrim', msg.author.discriminator)
        .replace(/\$userId/g, msg.author.id)
        .replace('$time', time.toUTCString())
        .replace('$duration', humanTime(Date.now() - time))
        .replace('$message', cleanMessage)
      )
    })
  }
}