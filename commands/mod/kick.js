const config = require('../../config.json')
const task = require('../../tasks')

const USAGE_STR = `Usage: ${config.discord.prefix}kick [mention] (reason)`

module.exports = async function (msg, args) {
  if (!msg.member.permission.has('kickMembers')) {
    return msg.channel.createMessage('no')
  }

  if (args.length === 0) {
    return msg.channel.createMessage(USAGE_STR)
  }

  const target = args.shift().replace(/<@!?(\d+)>/, '$1')

  if (target === msg.author.id) {
    return msg.channel.createMessage('Don\'t do that to yourself')
  }

  task.kick(msg._client, target, `${msg.author.username}#${msg.author.discriminator}`, `${args.join(' ') || 'No reason specified.'}`)
  return msg.channel.createMessage('Yeeted')
}