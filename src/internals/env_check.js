const required = [
  'BOT_TOKEN',
  'BOT_PREFIX',
  'YUI_GAMEMASTER'
]

for (const x of required) {
  if (!process.env[x]) {
    global.logger.error(`Missing enviroment variable ${x}`, true)
  }
}
