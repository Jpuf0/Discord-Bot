const { Constants: { AuditLogActions } } = require('eris')
const config = require('./config.json')

const template = `
**$type  |  Case: $case
__User__: $user ($userID)
__Moderator__: $moderator ($moderator)
__Reason__: $reason
`.trim();

module.exports = {
    register (bot) {
      this.bot = bot
      bot.on('guildBanAdd', this.processBanLog.bind(this, true))
      bot.on('guildBanRemove', this.processBanLog.bind(this, false))
      bot.on('guildMemberRemove', this.processLeaveLog.bind(this))
      bot.on('guildMemberUpdate', this.processMuteLog.bind(this))
    },
  
    processBanLog (banned, guild, user) {
      setTimeout(async () => {
        const logs = await guild.getAuditLogs(5, null, banned ? AuditLogActions.MEMBER_BAN_ADD : AuditLogActions.MEMBER_BAN_REMOVE)
        const entry = logs.entries.find(entry => (entry.targetID = user.id))
        const [ modId, modName, reason ] = this._processAuditEntry(entry)
        const channel = this.bot.getChannel(config.discord.ids.channelModLogs)
        const caseId = parseInt((await channel.getMessages(1))[0].content.match(/Case (\d+)/)[1]) + 1
  
        this.bot.createMessage(config.discord.ids.channelModLogs, template
          .replace('$type', banned ? 'Ban' : 'Unban')
          .replace('$case', caseId)
          .replace('$user', `${user.username}#${user.discriminator}`)
          .replace('$userid', user.id)
          .replace('$moderator', modName)
          .replace('$modid', modId)
          .replace('$reason', reason)
        )
      }, 1500) // Ensure audit log entry is there
    },
  
    processLeaveLog (guild, user) {
      setTimeout(async () => {
        const logs = await guild.getAuditLogs(5, null, AuditLogActions.MEMBER_KICK)
        const entry = logs.entries.find(entry => (entry.targetID = user.id))
        if (entry && Date.now() - Number((BigInt(entry.id) >> BigInt('22')) + BigInt('1420070400000')) < 5000) {
          const [ modId, modName, reason ] = this._processAuditEntry(entry)
          const channel = this.bot.getChannel(config.discord.ids.channelModLogs)
          const caseId = parseInt((await channel.getMessages(1))[0].content.match(/Case (\d+)/)[1]) + 1
  
          this.bot.createMessage(config.discord.ids.channelModLogs, template
            .replace('$type', 'Kick')
            .replace('$case', caseId)
            .replace('$user', `${user.username}#${user.discriminator}`)
            .replace('$userid', user.id)
            .replace('$moderator', modName)
            .replace('$modid', modId)
            .replace('$reason', reason)
          )
        }
      }, 1500) // Ensure audit log entry is there
    },
  
    processMuteLog (guild, user) {
      setTimeout(async () => {
        const logs = await guild.getAuditLogs(5, null, AuditLogActions.MEMBER_ROLE_UPDATE)
        const entry = logs.entries.find(entry => (entry.targetID = user.id))
        if (entry && Date.now() - Number((BigInt(entry.id) >> BigInt('22')) + BigInt('1420070400000')) < 5000) {
          if (entry.after.$add && entry.after.$add.find(r => r.id === config.discord.ids.roleMuted)) {
            this._logMute(entry, user, true)
          } else if (entry.after.$remove && entry.after.$remove.find(r => r.id === config.discord.ids.roleMuted)) {
            this._logMute(entry, user, false)
          }
        }
      }, 1500) // Ensure audit log entry is there
    },
  
    async _logMute (entry, user, muted) {
      const [ modId, modName, reason ] = this._processAuditEntry(entry)
      const channel = this.bot.getChannel(config.discord.ids.channelModLogs)
      const caseId = parseInt((await channel.getMessages(1))[0].content.match(/Case (\d+)/)[1]) + 1
  
      this.bot.createMessage(config.discord.ids.channelModLogs, template
        .replace('$type', muted ? 'Mute' : 'Unmute')
        .replace('$case', caseId)
        .replace('$user', `${user.username}#${user.discriminator}`)
        .replace('$userid', user.id)
        .replace('$moderator', modName)
        .replace('$modid', modId)
        .replace('$reason', reason)
      )
    },
  
    _processAuditEntry (entry) {
      let modId,
        modName,
        reason
      if (entry.user.id === this.bot.user.id) {
        const splittedReason = entry.reason.split(' ')
        modName = splittedReason.shift().replace('[', '').replace(']', '')
        reason = splittedReason.join(' ')
        const [ username, discrim ] = modName.split('#')
        modId = entry.guild.members.find(m => m.username === username && m.discriminator === discrim).id
      } else {
        modId = entry.user.id
        modName = `${entry.user.username}#${entry.user.discriminator}`
        reason = entry.reason || 'No reason specified.'
      }
      return [ modId, modName, reason ]
    }
}