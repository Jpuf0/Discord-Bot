const { CommandClient } = require("eris");
const { MongoClient } = require('mongodb')
const cron = require('node-cron');
const config = require("./config.json");
const modlog = require('./modlog')
const sniper = require('./sniper')
const logger = require('./logger')
const stats = require('./stats')
const starboard = require('./starboard')
const task = require('./tasks')
const autotag = require('./autotag')
const memberLog = require('./memberlog');
const { humanTime } = require("./utils");
const fs = require('fs')

const clientOptions = {
    intents: [
        'guilds',
        'guildMembers',
        'GUILD_MEMBERS',
        'guildBans',
        'guildPresences',
        'GUILD_PRESENCES',
        'guildMessages',
        'guildMessageReactions'
    ]
}

const bot = new CommandClient(config.discord.token, {clientOptions}, { defaultHelpCommand: false, prefix: config.discord.prefix })

//Default
bot.registerCommand('ping', require('./commands/ping'), { description: 'Pong' })
bot.registerCommand('rule', require('./commands/rule'), { description: 'Helps people unable to read #rules' })
bot.registerCommand('snipe', require('./commands/snipe'), { description: 'Sends a copy of messages deleted or edited in the last 30 seconds.' })
bot.registerCommand('tag', require('./commands/tag'), {description: 'Custom commands' })
bot.registerCommand('help', require('./commands/help'), { description: 'Shows this very help message' })
bot.registerCommand('profile', require('./commands/levels/profile'), {description: 'Shows a rank card for the server'})
bot.registerCommand('userinfo', require('./commands/userinfo'), {description: 'Returns information of a user ID, mention or name'})

//Moderator
bot.registerCommand('edit', require('./commands/mod/edit'))
bot.registerCommand('kick', require('./commands/mod/kick'))
bot.registerCommand('ban', require('./commands/mod/ban'))
bot.registerCommand('unban', require('./commands/mod/unban'))
bot.registerCommand('mute', require('./commands/mod/mute'))
bot.registerCommand('unmute', require('./commands/mod/unmute'))
bot.registerCommand('enforce', require('./commands/mod/enforce'))

//Admin
bot.registerCommand('eval', require('./commands/admin/eval'))
bot.registerCommand('ssh', require('./commands/admin/ssh'))
bot.registerCommand('stats', require('./commands/stat'))

//Other
modlog.register(bot);
sniper.register(bot);
logger.register(bot);
starboard.register(bot);
stats.register(bot);
autotag.register(bot);
memberLog.register(bot);


bot.on('ready', () => { 
    console.log(`logged in as ${bot.user.username}#${bot.user.discriminator}`)
    bot.getDMChannel(config.discord.OwnerID)
        .then(channel => {
            channel.createMessage(`Yui Is Online!`)
        })
})

console.log('Connecting to Mongo')
//USERNAME:Yui
//PASSWORD:YuiTheAi
//URI: mongodb+srv://Yui:YuiTheAi@dao-bot.yxbij.mongodb.net/<dbname>?retryWrites=true&w=majority
MongoClient.connect(config.mango, { useUnifiedTopology: true })
    .then(c => c.db('Yui'))
    .then(mongo => {
        bot.mongo = mongo
        console.log('Connecting to discord')
        bot.connect();
    })

cron.schedule('* * * * *', () => task.handleSchedule(bot))