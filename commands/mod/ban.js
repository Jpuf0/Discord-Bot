const config = require('../../../config.json')
const task = require('../../tasks')
const { parseDuration } = require('../../utils')

const USAGE_STR = `Usage: ${config.discord.prefix}ban [mention] (reason)|(duration)`

module.exports = async function (msg, args) {
  if (!msg.member.permission.has('banMembers')) {
    return msg.channel.createMessage('no')
  }

  if (args.length === 0) {
    return msg.channel.createMessage(USAGE_STR)
  }

  const target = args.shift().replace(/<@!?(\d+)>/, '$1')
  const reason = `${args.join(' ').split('|')[0] || 'No reason specified.'}`
  const rawDuration = msg.content.includes('|') ? msg.content.split('|')[1].trim().toLowerCase().match(/\d+(m|h|d)/) : null

  if (target === msg.author.id) {
    return msg.channel.createMessage('Don\'t do that to yourself')
  }

  if (rawDuration) {
    const duration = parseDuration(rawDuration[0])
    if (duration === null) {
      return msg.channel.createMessage('Invalid duration')
    }

    const entry = task.EMPTY_TASK_OBJ
    entry.type = 'unban'
    entry.target = target
    entry.mod = `${msg.author.username}#${msg.author.discriminator}`
    entry.time = Date.now() + duration

    msg._client.mongo.collection('tasks').insertOne(entry)
  }

  task.ban(msg._client, target, `${msg.author.username}#${msg.author.discriminator}`, `${reason} ${rawDuration ? `(for ${rawDuration[0]})` : ''}`)
  return msg.channel.createMessage('Ultra-yeeted')
}