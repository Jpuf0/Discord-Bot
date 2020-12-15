const sniper = require('../sniper')

const ANIMALS = [
  '🦅', '🐦', '🦄', '🐙', '🐢', '🐌', '🐬', '🐠', '🦈', '🦏',
  '🐖', '🦒', '🦘', '🐘', '🐳', '🐕', '🐑', '🐓', '🦜', '🦥',
  '🐿️', '🦔', '🦩', '🦢'
]

module.exports = function (msg) {
  if (sniper.lastMessages.length === 0) {
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
    return msg.channel.createMessage(`${animal} There is nothing to snipe.`)
  }

  const fields = [ [] ]
  let cursor = 0
  let length = 0
  for (const snipe of sniper.lastMessages) {
    const name = `${snipe.author} (${snipe.type})`
    if (fields[cursor].length === 25 || length + name.length + Math.floor(snipe.msg.length / 1024) * 3 + snipe.msg.length >= 5900) {
      fields.push([])
      length = 0
      cursor++
    }

    length += name.length + snipe.msg.length
    fields[cursor].push({
      name: `${snipe.author} (${snipe.type}) in #${snipe.channel}`,
      value: snipe.msg.slice(0, 1024)
    })

    if (snipe.msg.length > 1024) {
      fields[cursor].push({
        name: '...',
        value: snipe.msg.slice(1024)
      })
    }
  }

  sniper.lastMessages = []
  fields.forEach((f, i) => {
    const embed = { fields: f }
    if (i === 0) {
      embed.description = `Edits and deletes for the last ${sniper.SNIPE_LIFETIME} seconds`
    }
    if (i === fields.length - 1) {
      embed.footer = { text: `Sniped by ${msg.author.username}#${msg.author.discriminator}` }
    }

    msg.channel.createMessage({ embed })
  })
}