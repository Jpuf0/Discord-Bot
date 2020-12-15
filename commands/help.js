const config = require('../config.json');

module.exports = async function (msg) {
    let help = '```asciidoc\n'

    Object.keys(msg._client.commands).forEach(cmdName => {
        const cmd = msg._client.commands[cmdName]
        if(cmd.description !== 'No Description'){
            help += `${config.discord.prefix}${cmdName.padEnd(10)} :: ${cmd.description}\n`
        }
    })
    help += '```'

    msg.channel.createMessage(help)
}