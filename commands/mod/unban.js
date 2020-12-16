const config = require('../../config.json')
const task = require('../../tasks')
const { cleanString } = require('../../utils')

const USAGE_STR = `Usage: ${config.discord.prefix}unban [userID] (reason)`

module.exports = async function (msg, args) {
  if (!msg.member.permission.has('banMembers')) {
    return msg.channel.createMessage('no')
  }

  if (args.length === 0) {
    return msg.channel.createMessage(USAGE_STR)
  }

  const target = args.shift()

  task.unban(msg._client, target, `${cleanString(msg.author.username)}#${msg.author.discriminator}`, `${args.join(' ') || 'No reason specified.'}`)
  return msg.channel.createMessage('Un-yeeted')
}