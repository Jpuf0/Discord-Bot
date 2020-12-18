const config = require('./config.json')
const { humanTime } = require('./utils')

const memberLog = config.discord.ids.channelMemberLogs

module.exports = {
  register (bot) {
    if (!memberLog || memberLog === '') return

    this.bot = bot
    bot.on('guildMemberAdd', this.memberAdd.bind(this))
    bot.on('guildMemberRemove', this.memberRemove.bind(this))
    bot.on('guildMemberUpdate', this.memberUpdate.bind(this))
  },

  memberAdd (guild, member) {
    if (guild.id !== config.discord.ids.serverID) return
    const createdAt = new Date(member.createdAt)
    const now = new Date()

    const embed = {
      title: `${member.username}#${member.discriminator} just joined`,
      description: `<@${member.id}> created their accout at ${createdAt.toUTCString()} (${humanTime(now - createdAt)})`,
      timestamp: now.toISOString(),
      color: 0x7289da,
      thumbnail: { url: member.avatarURL },
      footer: { text: `Discord ID: ${member.id}` }
    }
    this.bot.createMessage(memberLog, { embed })
  },

  memberRemove (guild, member) {
    if (guild.id !== config.discord.ids.serverID) return
    const now = Date.now()
    let description = `<@${member.id}> was not in the cache when they left`

    if (member.joinedAt) {
      const joinedAt = new Date(member.joinedAt)
      description = `<@${member.id}> was here for ${humanTime(now - joinedAt)}`
    }

    const embed = {
      title: `${member.user.username}#${member.user.discriminator} just left`,
      description,
      color: 0xdac372,
      thumbnail: { url: member.user.avatarURL },
      footer: { text: `Discord ID: ${member.user.id}` }
    }
    this.bot.createMessage(memberLog, { embed })
  },

  memberUpdate (guild, newMember, oldMember) {
    if (guild.id !== config.discord.ids.serverID) return

    let embed

    if (oldMember.nick !== newMember.nick) embed = this.nickChange(newMember, oldMember.nick)
    if (newMember.roles.length !== oldMember.roles.length || !newMember.roles.every(role => oldMember.roles.includes(role))) embed = this.roleChange(newMember, oldMember)

    if (embed) {
      this.bot.createMessage(memberLog, { embed })
    }
  },

  nickChange (member, oldNick) {
    return {
      title: `${member.username}#${member.discriminator} changed their nickname`,
      color: 0x8f72da,
      fields: [
        {
          name: 'New nickname',
          value: member.nick ? member.nick : member.username,
          inline: true
        }, {
          name: 'Old nickname',
          value: oldNick || member.username,
          inline: true
        }
      ],
      thumbnail: { url: member.avatarURL },
      footer: { text: `Discord ID: ${member.id}` }
    }
  },

  roleChange (newMember, oldMember) {
    const addedRoleIds = newMember.roles.filter(r => !oldMember.roles.includes(r))
    const removedRoleIds = oldMember.roles.filter(r => !newMember.roles.includes(r))

    const newRoleNames = []
    const oldRoleNames = []
    newMember.guild.roles.filter(role => addedRoleIds.includes(role.id)).forEach(role => {
      newRoleNames.push(role.name)
    })
    newMember.guild.roles.filter(role => removedRoleIds.includes(role.id)).forEach(role => {
      oldRoleNames.push(role.name)
    })

    const fields = []
    if (newRoleNames.length > 0) {
      fields.push({
        name: 'Roles added',
        value: newRoleNames.join('\n'),
        inline: true
      })
    }
    if (oldRoleNames.length > 0) {
      fields.push({
        name: 'Roles removed',
        value: oldRoleNames.join('\n'),
        inline: true
      })
    }

    return {
      title: `${newMember.username}#${newMember.discriminator} had a role update`,
      color: 0xdf799d,
      fields,
      thumbnail: { url: newMember.avatarURL },
      footer: { text: `Discord ID: ${newMember.id}` }
    }
  }
}