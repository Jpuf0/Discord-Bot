const config = require('../config.json')
const { parseRule } = require('../utils')

const INFO_STR = `You can read all of the server rules in <#${config.discord.ids.channelRules}>.`
const USAGE_STR = `Usage: ${config.discord.prefix}rule <rule id>`

module.exports = async function (msg, args) {
    if (args.length === 0) {
        return msg.channel.createMessage(`${USAGE_STR}\n\n${INFO_STR}`)
    }

    const id = parseInt(args[0])
    const rule = await parseRule(id, msg)

    if (rule === null){
        return msg.channel.createMessage(`This rule doesn't exist.\n${USAGE_STR}\n\n${INFO_STR}`)
    }

    msg.channel.createMessage(`**Rule #${id}**: ${rule}\n\n${INFO_STR}`)
}