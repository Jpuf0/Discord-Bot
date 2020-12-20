const chalk = require('chalk')
const log = console.log
const inspect = require('util').inspect
let raven
let ES
let store = []

if (process.env.ELASTICSEARCH_URI) {
  setInterval(flushES, 10000)
  const es = require('elasticsearch')
  ES = new es.Client({
    host: process.env.ELASTICSEARCH_URI
  })
  const url = require('url')
  log(chalk`{bold.green DEBUG}: Opening Elasticsearch Connection to ${new url.URL(process.env.ELASTICSEARCH_URI).hostname || process.env.ELASTICSEARCH_URI}`)
}

if (process.env.SENTRY_DSN) {
  const revision = require('child_process').execSync('git rev-parse HEAD').toString().trim()
  log(chalk`{bold.green DEBUG}: Initializing Sentry, setting release to ${revision}`)
  raven = require('raven')
  raven.config(process.env.SENTRY_DSN, {
    release: revision,
    parseUser: false
  }).install()
}

module.exports = {
  debug: (msg, data) => {
    if (process.env.NODE_ENV === 'debug') log(chalk`{bold.green DEBUG}: ${msg}`)
    if (data && ES) {
      data.type = 'debug'
      sendToES(data)
    }
  },
  log: (msg) => {
    log(chalk`{bold.blue INFO}: ${msg}`) // nothing too interesting going on here
  },
  error: (e, exit = false) => {
    if (!(e instanceof Error)) {
      exit ? log(chalk`{bold.green.bgRed FATAL}: ${e}`) : log(chalk`{bold.red ERROR}: ${e}`)
      if (exit) process.exit(1)
    } else {
      if (raven && raven.installed) {
        exit ? log(chalk`{bold.black.bgRed FATAL}: ${e.stack ? e.stack : e.message}`) : log(chalk`{bold.red ERROR}: ${e.stack ? e.stack : e.message}`)
        raven.captureException(e, { level: exit ? 'fatal' : 'error' }, () => {
          if (exit) process.exit(1)
        })
      } else {
        exit ? log(chalk`{bold.black.bgRed FATAL}: ${e.stack ? e.stack : e.message}`) : log(chalk`{bold.red ERROR}: ${e.stack ? e.stack : e.message}`)
        if (exit) process.exit(1)
      }
    }
  },
  warn: (msg) => {
    log(chalk`{bold.yellow WARN}: ${msg}`)
  },
  trace: (msg) => {
    if (process.env.NODE_ENV === 'debug') log(chalk`{bold.cyan TRACE]: ${inspect(msg)}`)
  },
  command: (opts) => {
    if (process.env.YUI_SUPRESS_COMMANDLOG) return
    log(chalk`{bold.magenta CMD}: ${opts.cmd} by ${opts.m.author.username} in ${opts.m.channel.guild ? opts.m.channel.guild.name : 'DM'}`)
    opts.m.channel.lastPinTimestamp = undefined
    sendToES({
      type: 'command',
      cmd: opts.cmd,
      args: opts.opts.split(' '),
      author: opts.m.author,
      channel: opts.m.channel,
      guild: transform(opts.m.channel.guild)
    })
  },
  _raven: raven
}

function transform (guild) {
  if (!guild) return
  const proxy = guild
  proxy.joinedAt = new Date(guild.joinedAt).toISOString()
  proxy.createdAt = new Date(guild.createdAt).toISOString()
  proxy.emojis = undefined
  return proxy
}

function sendToES (opts) {
  if (ES) {
    const moment = require('moment')
    opts['@timestamp'] = new Date().toISOString()
    store.push({
      index: {
        _index: (process.env.ELASTICSEARCH_INDEX || 'yui') + `-${moment().format('YYYY.MM.DD')}`, _type: '_doc'
      }
    })
    store.push(opts)
  }
}

function flushES () {
  if (store.length === 0) return
  ES.bulk({
    body: store
  }).then(module.exports.trace).catch(module.exports.error)
  store = []
}
