const config = require('../../config.json')
const task = require('../../tasks')
const { cleanString } = require('../../utils')

const USAGE_STR = `Usage: ${config.discord.prefix}unmute [mention] (reason)`

module.exports = async function (msg, args) {
  if (!msg.member.permission.has('manageMessages')) {
    return msg.channel.createMessage('no')
  }

  if (args.length === 0) {
    return msg.channel.createMessage(USAGE_STR)
  }

  const target = args.shift().replace(/<@!?(\d+)>/, '$1')

  if (target === msg.author.id) {
    return msg.channel.createMessage('You\'re already talking fam.')
  }

  task.unmute(msg._client, target, `${cleanString(msg.author.username)}#${msg.author.discriminator}`, `${args.join(' ') || 'No reason specified.'}`)
  return msg.channel.createMessage('Speak')
}