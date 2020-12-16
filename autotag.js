const config = require('./config.json')

module.exports = {
  register (bot) {
    bot.on('messageCreate', (msg) => this.process(msg))
  },

  async process (msg) {
    if (!msg.content.startsWith(config.discord.prefix)) {
      return
    }

    const command = msg.content.slice(config.discord.prefix.length, msg.content.length).toLowerCase()
    const tags = await msg._client.mongo.collection('tags').find().toArray()

    tags.forEach(tag => {
      if (tag._id.toLowerCase() === command) {
        return msg.channel.createMessage(tag.content)
      }
    })
  }
}