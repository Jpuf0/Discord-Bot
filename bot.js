const { CommandClient } = require("eris");
const config = require("./config.json");
const sniper = require("./sniper");


const bot = new CommandClient(config.discord.token, {
    intents: [ 'guildBans', 'guildMessages', 'guilds']
}, { defaultHelpCommand: false, prefix: config.discord.prefix })

//Default
bot.registerCommand('ping', require('./commands/ping'), { description: 'Pong' })
bot.registerCommand('rule', require('./commands/rule'), { description: 'Helps people unable to read #rules' })
bot.registerCommand('snipe', require('./commands/snipe'), { description: 'Sends a copy of messages deleted or edited in the last 30 seconds.' })
bot.registerCommand('help', require('./commands/help'), { description: 'Shows this very help message' })

//Admin
bot.registerCommand('eval', require('./commands/admin/eval'))

//Other
sniper.register(bot);


bot.on('ready', () => {
    console.log(`logged in as ${bot.user.username}#${bot.user.discriminator}`)
})

bot.connect();