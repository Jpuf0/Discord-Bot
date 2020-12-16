const cron = require('node-cron')
const config = require('./config.json')

module.exports = {
  register (bot) {
    this.bot = bot
    this.messageSentCounter = 0
    this.messageDeletedCounter = 0

    bot.on('messageCreate', () => (this.messageSentCounter++))
    bot.on('messageDelete', () => (this.messageDeletedCounter++))
    bot.on('messageDeleteBulk', (messages) => (this.messageDeletedCounter += messages.length)) // Bans, mostly

    cron.schedule('*/30 * * * *', this.collectStats.bind(this))
    cron.schedule('0 0 * * *', this.purgeOldData.bind(this))
  },

  async collectStats () {
    const counts = { total: 0, online: 0, idle: 0, dnd: 0 }
    const members = await this.bot.guilds.get(config.discord.ids.serverID).fetchMembers({ presences: true })
    members.forEach(member => counts.total++ | (member.status && member.status !== 'offline' && counts[member.status]++))
    const sentMessages = this.messageSentCounter
    const deletedMessages = this.messageDeletedCounter
    this.messageSentCounter = 0
    this.messageDeletedCounter = 0

    this.bot.mongo.collection('guild-stats').insertOne({
      date: new Date(),
      sentMessages,
      deletedMessages,
      ...counts
    })
  },

  async purgeOldData () {
    // Only keep a month & a half of data
  }
}