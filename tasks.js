const config = require('./config.json')
const GUILD = config.discord.ids.serverID

module.exports = {
    EMPTY_TASK_OBJ: {
        type: null,
        target: null,
        mod: null,
        time: null,
    },

    mute (bot, userID, moderator, reason = 'No reason specified.') {
        bot.addGuildMemberRole(GUILD, userID, config.discord.ids.roleMuted, `[${moderator}] ${reason}`)
    },
    
    unmute (bot, userID, moderator, reason = 'No reason specified.') {
    bot.removeGuildMemberRole(GUILD, userID, config.discord.ids.roleMuted, `[${moderator}] ${reason}`)
    },

    kick (bot, userID, moderator, reason = 'No reason specified.') {
    bot.kickGuildMember(GUILD, userID, `[${moderator}] ${reason}`)
    },

    ban (bot, userID, moderator, reason = 'No reason specified.') {
    bot.banGuildMember(GUILD, userID, 0, `[${moderator}] ${reason}`)
    },

    unban (bot, userID, moderator, reason = 'No reason specified.') {
    bot.unbanGuildMember(GUILD, userID, `[${moderator}] ${reason}`)
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