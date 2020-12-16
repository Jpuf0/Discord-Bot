const config = require('../config.json')
const si = require('systeminformation');
const os = require('os')
const moment = require("moment");
require("moment-duration-format");

module.exports = async function (msg) {
    if(!config.discord['allowed-users'].includes(msg.member.id)){
        return msg.channel.createMessage(':x: Sorry')
    }

    const duration = moment.duration(msg._client.uptime).format(" D [days], H [hrs], m [mins], s [secs], S [ms]");
    const p = config.discord.prefix;
    msg.channel.createMessage(`\`\`\`asciidoc\n= STATISTICS =\n• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024 / 1024).toFixed(2) + "/" + (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB\n• CPU Usage  :: ${((await si.processLoad("node")).cpu).toFixed(3)} %\n• Uptime     :: ${duration}\n• Prefix     :: ${p}\n• Node       :: ${process.version}\`\`\``);
}