const config = require('./config.json')
const zws = '\u200B'

module.exports = {
    SNIPE_LIFETIME: 30,
    lastMessages: [],
  
    register (bot) {
      bot.on('messageDelete', (msg) => {
        if (!msg.author || msg.channel.guild.id !== config.discord.ids.serverId || msg.author.bot || isPrivate(msg.channel)) {
          return // Let's ignore
        }
  
        this.catch(msg, 'delete')
      })
  
      bot.on('messageUpdate', (msg, old) => {
        if (!old || !msg.author || msg.channel.guild.id !== config.discord.ids.serverId || msg.author.bot || msg.content === old.content || isPrivate(msg.channel)) {
          return // Let's ignore
        }
  
        this.catch({ ...msg, content: old.content }, 'edit')
      })
    },
  
    catch (msg, type) {
      const id = Math.random()
      this.lastMessages.push({
        _id: id,
        author: `${msg.author.username}#${msg.author.discriminator}`,
        msg: msg.content ? msg.content.replace(/\(/g, `${zws}(`) : 'This message had no text content.',
        channel: msg.channel.name,
        type
      })
  
      setTimeout(() => (this.lastMessages = this.lastMessages.filter(m => m._id !== id)), this.SNIPE_LIFETIME * 1e3)
    }
  }
  
function isPrivate (channel) {
  return channel.permissionOverwrites.filter(overwrite => overwrite.id === channel.guild.id && !overwrite.has('readMessages')).length === 1
}