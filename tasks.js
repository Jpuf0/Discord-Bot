const config = require('./config.json')
const { cleanString } = require('./utils')
const GUILD = config.discord.ids.serverID

module.exports = {
    EMPTY_TASK_OBJ: {
        type: null,
        target: null,
        mod: null,
        time: null,
    },

    mute (bot, userID, moderator, reason = 'No reason specified.') {
        bot.addGuildMemberRole(GUILD, userID, config.discord.ids.roleMuted, `[${cleanString(moderator)}] ${reason}`)
    },
    
    unmute (bot, userID, moderator, reason = 'No reason specified.') {
        bot.removeGuildMemberRole(GUILD, userID, config.discord.ids.roleMuted, `[${cleanString(moderator)}] ${reason}`)
    },

    kick (bot, userID, moderator, reason = 'No reason specified.') {
        bot.kickGuildMember(GUILD, userID, `[${cleanString(moderator)}] ${reason}`)
    },

    ban (bot, userID, moderator, reason = 'No reason specified.') {
        bot.banGuildMember(GUILD, userID, 0, `[${cleanString(moderator)}] ${reason}`)
    },

    unban (bot, userID, moderator, reason = 'No reason specified.') {
        bot.unbanGuildMember(GUILD, userID, `[${cleanString(moderator)}] ${reason}`)
    },

    async handleSchedule (bot) {
        const tasks = await bot.mongo.collection('tasks').find().toArray()

        tasks.forEach(task => {
            if (task.time < Date.now()) {
                switch (task.type) {
                    case 'unmute':
                        this.unmute(bot, task.target, task.mod, 'Automatically unmuted')
                        break
                    case 'unban':
                        this.unban(bot, task.target, task.mod, 'Automatically unbanned')
                        break
                }
                bot.mongo.collection('tasks').deleteOne({ _id: task._id })
            }
        })
    }
}