const config = require('../../config.json')

module.exports = async function (msg, args) {
  if (!msg.member.permission.has('manageMessages')) {
    return msg.channel.createMessage('no')
  }

  const caseId = parseInt(args.shift())
  let newReason = args.join(' ')
  if (!caseId || !newReason) {
    return msg.channel.createMessage(`Usage: ${config.discord.prefix}edit [caseId] [newReason]`)
  }

  const channel = msg._client.getChannel(config.discord.ids.channelModLogs)
  const messages = await channel.getMessages(100)
  const message = messages.find(m => m.content.includes(`Case ${caseId}`))
  if (!message) {
    return msg.channel.createMessage('This case doesn\'t exist or is too old')
  }

  const modId = message.content.match(/\n__Moderator(?:[^(]+)\((\d+)/)[1]
  if (modId !== msg.author.id && !msg.member.permission.has('administrator')) {
    return msg.channel.createMessage('You\'re not the responsible moderator')
  }

  const content = message.content.match(/([^]+)\n__Reason__/)[1]
  if (modId !== msg.author.id) {
    newReason += ` *(edited by ${msg.author.username}#${msg.author.discriminator})*`
  }

  await message.edit(`${content}\n__Reason__: ${newReason}`)
  msg.channel.createMessage('Updooted')
}