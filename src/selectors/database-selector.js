const drivers = require('../internals/dirscan')('../databases')
const preferred = `${process.env.YUI_PREFERRED_DATABASE || 'arangodb'}.js`

if (drivers.indexOf(preferred) === -1) {
  global.logger.error(`No database driver available called ${preferred}, available choices: ${drivers.join(', ')}`, true)
}

if (global.logger) global.logger.debug(`Using ${preferred} database driver`)
module.exports = require(`../databases/${preferred}`)
