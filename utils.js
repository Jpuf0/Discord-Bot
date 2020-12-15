const config = require('./config.json')

module.exports = {
    async parseRule (ruleID, msg) {
        const messages = await msg._client.getMessages(config.discord.ids.channelRules)
        let rules
        messages.reverse().forEach(msg => {
            rules += msg.content.slice(6, msg.contnet.length - 3)
        })
        rules += '||||'

        const match = rules.match(new RegExp(`\\[0?${ruleID}] (([^\\[]*)([^\\d]*)([^\\]]*))`))
        if(!match){
            return null
        }

        const rule = match[1].split('\n').map(s => s.trim()).join(' ')
            .replace(/\[#[^a-z0-9-_]?([a-z0-9-_]+)\]/ig, (og, name) => {
                const channel = msg.channel.guild.channels.find(c => c.name === name)
                return channel ? `<#${channel.id}>` : og
            })
            .replace(/Actions: /, '\nActions: ')
        
        return rule.slice(0, rule.length - 4).trim()
    },

    parseDuration (rawDuration) {
        if (rawDuration.endsWith('m')) {
            return rawDuration.match(/\d+/)[0] * 1000 * 60
        } else if (rawDuration.endsWith('h')) {
            return rawDuration.match(/\d+/)[0] * 1000 * 60 * 60
        } else if (rawDuration.endsWith('d')) {
            return rawDuration.match(/\d+/)[0] * 1000 * 60 * 60 * 24
        } else {
            return null
        }
    },

    humanTime (time) {
        const plurialify = (c, w) => c === 1 ? w : `${w}s`
        const y = Math.floor(time / 31536000e3)
        const d = Math.floor((time - y * 31536000e3) / 86400e3)
        const h = Math.floor((time - y * 31536000e3 - d * 86400e3) / 3600e3)
        const m = Math.floor((time - y * 31536000e3 - d * 86400e3 - h * 3600e3) / 60e3)
        const s = Math.floor((time - y * 31536000e3 - d * 86400e3 - h * 3600e3 - m * 60e3) / 1e3)

        return [
            y ? `${y} ${plurialify(y, 'year')}` : '',
            d ? `${d} ${plurialify(h, 'day')}` : '',
            h ? `${h} ${plurialify(h, 'hour')}` : '',
            m ? `${m} ${plurialify(m, 'minute')}` : '',
            s ? `${s} ${plurialify(s, 'second')}` : ''
          ].filter(Boolean).join(', ') || 'under a second'
    }
}